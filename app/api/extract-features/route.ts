// v1.10 — Extract property features from photos via Claude vision
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const PLAN_PHOTO_LIMITS: Record<string, number> = {
  trial: 0,
  solo: 3,
  team: 8,
  brokerage: 8,
  lifetime: 8,
};

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
    const maxPhotos = PLAN_PHOTO_LIMITS[plan] || 0;

    if (maxPhotos === 0) {
      return NextResponse.json(
        { message: "Photo feature extraction requires a paid plan.", upgradeUrl: "/pricing" },
        { status: 402 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("photos") as File[];

    if (files.length === 0) {
      return NextResponse.json({ message: "No photos provided" }, { status: 400 });
    }

    if (files.length > maxPhotos) {
      return NextResponse.json(
        { message: `Your plan allows up to ${maxPhotos} photos. You uploaded ${files.length}.` },
        { status: 400 }
      );
    }

    // Convert files to base64
    const imageContents: Anthropic.ImageBlockParam[] = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
        return {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mediaType,
            data: base64,
          },
        };
      })
    );

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ message: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            ...imageContents,
            {
              type: "text",
              text: `Analyze these property listing photos. Extract a comma-separated list of property features visible in the images. Focus on:
- Kitchen features (appliances, countertops, cabinets)
- Flooring types
- Bathroom features
- Structural features (fireplace, vaulted ceilings, crown molding)
- Outdoor features (pool, patio, landscaping, deck)
- Notable finishes and materials
- Storage features
- Lighting and windows

Return JSON only:
{
  "features": ["feature 1", "feature 2", ...],
  "confidence": 0.85
}

Be specific (e.g., "stainless steel appliances" not just "appliances"). Only include features you can clearly identify in the photos.`,
            },
          ],
        },
      ],
      system: "You are a real estate photography analyst. Extract property features from listing photos. Respond with valid JSON only. No markdown code fences.",
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from vision model");
    }

    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
    }

    const result = JSON.parse(jsonStr);

    return NextResponse.json({
      features: result.features || [],
      confidence: result.confidence || 0,
    });
  } catch (error) {
    console.error("Feature extraction error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Feature extraction failed" },
      { status: 500 }
    );
  }
}
