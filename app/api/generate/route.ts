// v1.3 — Generate MLS listing descriptions (refactored: 3 variants, tone, length, persistence)
import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { buildMlsPrompt, buildSystemPrompt, type LengthTier } from "@/lib/prompts/mls-description";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { TonePreset } from "@/lib/prompts/tone-presets";

const generateListingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  bedrooms: z.string().min(1, "Bedrooms is required"),
  bathrooms: z.string().min(1, "Bathrooms is required"),
  sqft: z.number().min(1, "Square footage must be greater than 0"),
  lotSize: z.string().optional(),
  features: z.string().optional(),
  locationHighlights: z.string().optional(),
  tone: z.string().optional().default("mls_default"),
  length: z.enum(["short", "medium", "long"]).optional().default("medium"),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Trial enforcement
    const { data: dbUser } = await supabase
      .from("users")
      .select("plan, trial_generations_used")
      .eq("id", user.id)
      .single();

    if (dbUser?.plan === "trial" && (dbUser.trial_generations_used ?? 0) >= 3) {
      return NextResponse.json(
        { message: "Free trial limit reached (3 generations). Upgrade to continue.", upgradeUrl: "/pricing" },
        { status: 402 }
      );
    }

    const body = await request.json();
    const validatedData = generateListingSchema.parse(body);

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { message: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const tone = validatedData.tone as TonePreset;
    const length = validatedData.length as LengthTier;
    const prompt = buildMlsPrompt(validatedData, tone, length);
    const systemPrompt = buildSystemPrompt(tone);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
      system: systemPrompt,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Anthropic");
    }

    // Strip markdown code fences if present
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
    }

    const result = JSON.parse(jsonText);

    if (!result.variants || !Array.isArray(result.variants) || result.variants.length < 3) {
      throw new Error("Invalid response format from Anthropic");
    }

    // Persist listing to Supabase
    const { data: listing } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        address: validatedData.address,
        bedrooms: parseInt(validatedData.bedrooms) || null,
        bathrooms: parseFloat(validatedData.bathrooms) || null,
        square_feet: validatedData.sqft,
        lot_size: validatedData.lotSize || null,
        property_features: validatedData.features || null,
        location_highlights: validatedData.locationHighlights || null,
        tone_preset: tone,
      })
      .select("id")
      .single();

    // Persist each generation
    const tokensIn = response.usage?.input_tokens ?? 0;
    const tokensOut = response.usage?.output_tokens ?? 0;
    // Rough cost estimate: Sonnet input $3/MTok, output $15/MTok
    const costCents = Math.round((tokensIn * 0.003 + tokensOut * 0.015) / 10);

    if (listing) {
      const generationRows = result.variants.map((v: { description: string }, i: number) => ({
        listing_id: listing.id,
        user_id: user.id,
        format: `mls_${length}`,
        content: v.description,
        model_used: "claude-sonnet-4-20250514",
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        cost_cents: costCents,
      }));

      await supabase.from("generations").insert(generationRows);
    }

    // Increment trial counter
    if (dbUser?.plan === "trial") {
      await supabase
        .from("users")
        .update({
          trial_generations_used: (dbUser.trial_generations_used ?? 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Log usage event
    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type: "generation",
      metadata: {
        tone,
        length,
        format: "mls",
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        cost_cents: costCents,
      },
    });

    return NextResponse.json({
      listingId: listing?.id,
      variants: result.variants,
      usage: { tokensIn, tokensOut, costCents },
    });
  } catch (error) {
    console.error("Error generating listing:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate MLS listing",
      },
      { status: 500 }
    );
  }
}
