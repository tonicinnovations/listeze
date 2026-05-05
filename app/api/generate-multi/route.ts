// v1.5 — Multi-format generation: parallel Anthropic calls, fair housing scan, persistence
import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FORMAT_REGISTRY, getFormatsForPlan } from "@/lib/prompts/format-registry";
import { scanText } from "@/lib/fair-housing";

const requestSchema = z.object({
  listingId: z.string().min(1),
  address: z.string().min(1),
  bedrooms: z.string().min(1),
  bathrooms: z.string().min(1),
  sqft: z.number().min(1),
  lotSize: z.string().optional(),
  features: z.string().optional(),
  locationHighlights: z.string().optional(),
  formats: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = dbUser?.plan || "trial";

    if (plan === "trial") {
      return NextResponse.json(
        { message: "Marketing kit requires a paid plan. Upgrade to access all formats.", upgradeUrl: "/pricing" },
        { status: 402 }
      );
    }

    const body = await request.json();
    const validated = requestSchema.parse(body);

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ message: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const allowedFormats = getFormatsForPlan(plan);
    const allowedKeys = new Set(allowedFormats.map((f) => f.key));

    // Filter requested formats to what the plan allows
    const requestedFormats = validated.formats.filter((f) => allowedKeys.has(f));
    if (requestedFormats.length === 0) {
      return NextResponse.json(
        { message: "No formats available for your plan", upgradeUrl: "/pricing" },
        { status: 402 }
      );
    }

    const propertyInput = {
      address: validated.address,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms,
      sqft: validated.sqft,
      lotSize: validated.lotSize,
      features: validated.features,
      locationHighlights: validated.locationHighlights,
    };

    // Fan out parallel Anthropic calls
    const results = await Promise.allSettled(
      requestedFormats.map(async (formatKey) => {
        const formatDef = FORMAT_REGISTRY.find((f) => f.key === formatKey);
        if (!formatDef) throw new Error(`Unknown format: ${formatKey}`);

        const prompt = formatDef.buildPrompt(propertyInput);

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
          system: "You are a professional real estate marketing copywriter. Respond with valid JSON only. No markdown code fences. Never include Fair Housing Act violations.",
        });

        const textBlock = response.content.find((b) => b.type === "text");
        if (!textBlock || textBlock.type !== "text") {
          throw new Error("No text response");
        }

        let jsonStr = textBlock.text.trim();
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
        }

        const parsed = JSON.parse(jsonStr);

        // Extract the main text content for fair housing scan
        const mainText = parsed.caption || parsed.post || parsed.plainText || parsed.script || parsed.body || "";
        const scan = scanText(mainText);

        // Persist generation
        const tokensIn = response.usage?.input_tokens ?? 0;
        const tokensOut = response.usage?.output_tokens ?? 0;
        const costCents = Math.round((tokensIn * 0.003 + tokensOut * 0.015) / 10);

        await supabase.from("generations").insert({
          listing_id: validated.listingId,
          user_id: user.id,
          format: formatKey,
          content: JSON.stringify(parsed),
          fair_housing_score: scan.score,
          fair_housing_flags: scan.flags,
          model_used: "claude-sonnet-4-20250514",
          tokens_in: tokensIn,
          tokens_out: tokensOut,
          cost_cents: costCents,
        });

        return {
          format: formatKey,
          label: formatDef.label,
          content: parsed,
          fairHousing: { score: scan.score, flags: scan.flags },
        };
      })
    );

    const outputs = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<unknown>).value);

    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r, i) => ({ format: requestedFormats[i], error: (r as PromiseRejectedResult).reason?.message || "Failed" }));

    return NextResponse.json({ outputs, errors });
  } catch (error) {
    console.error("Multi-format generation error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
