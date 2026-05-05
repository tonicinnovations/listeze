// v1.0 — Generate MLS listing descriptions via Anthropic
import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { buildMlsPrompt } from "@/lib/prompts/mls-description";

const generateListingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  bedrooms: z.string().min(1, "Bedrooms is required"),
  bathrooms: z.string().min(1, "Bathrooms is required"),
  sqft: z.number().min(1, "Square footage must be greater than 0"),
  lotSize: z.string().optional(),
  features: z.string().optional(),
  locationHighlights: z.string().optional(),
});

export async function POST(request: Request) {
  try {
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

    const prompt = buildMlsPrompt(validatedData);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system:
        "You are a professional real estate copywriter specializing in MLS listings. Always respond with valid JSON only.",
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Anthropic");
    }

    const result = JSON.parse(textBlock.text);

    if (!result.variation1 || !result.variation2) {
      throw new Error("Invalid response format from Anthropic");
    }

    const wordCounts = {
      variation1: result.variation1.split(/\s+/).length,
      variation2: result.variation2.split(/\s+/).length,
    };

    return NextResponse.json({
      variation1: result.variation1,
      variation2: result.variation2,
      wordCounts,
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
