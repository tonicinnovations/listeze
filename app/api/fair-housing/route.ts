// v1.4 — Fair housing scan + rewrite endpoint
import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { scanText, buildAiScanPrompt, type Flag } from "@/lib/fair-housing";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const requestSchema = z.object({
  text: z.string().min(1),
  generationId: z.string().optional(),
  rewrite: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, generationId, rewrite } = requestSchema.parse(body);

    // Pass 1: regex scan
    const regexResult = scanText(text);

    // Pass 2: AI scan via Haiku for context-sensitive issues
    let aiFlags: Flag[] = [];
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const aiResponse = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          messages: [{ role: "user", content: buildAiScanPrompt(text) }],
          system: "You are a Fair Housing Act compliance expert. Respond with valid JSON only. No markdown code fences.",
        });

        const aiText = aiResponse.content.find((b) => b.type === "text");
        if (aiText && aiText.type === "text") {
          let jsonStr = aiText.text.trim();
          if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
          }
          const parsed = JSON.parse(jsonStr);
          if (parsed.issues && Array.isArray(parsed.issues)) {
            aiFlags = parsed.issues.map((issue: { term: string; category: string; severity: string; suggestion: string }) => {
              const lowerText = text.toLowerCase();
              const pos = lowerText.indexOf(issue.term.toLowerCase());
              return {
                term: issue.term,
                position: pos >= 0 ? pos : 0,
                endPosition: pos >= 0 ? pos + issue.term.length : 0,
                category: issue.category,
                severity: issue.severity as "high" | "medium" | "low",
                suggestion: issue.suggestion,
              };
            });
          }
        }
      } catch (aiErr) {
        console.error("AI scan error (non-fatal):", aiErr);
      }
    }

    // Merge flags, deduplicate by position
    const allFlags = [...regexResult.flags, ...aiFlags];
    const uniqueFlags = allFlags.filter(
      (flag, i, arr) => arr.findIndex((f) =>
        f.position === flag.position && f.term.toLowerCase() === flag.term.toLowerCase()
      ) === i
    );

    // Recalculate score
    const deductions: Record<string, number> = { high: 20, medium: 10, low: 5 };
    const totalDeduction = uniqueFlags.reduce(
      (sum, f) => sum + (deductions[f.severity] || 5), 0
    );
    const score = Math.max(0, 100 - totalDeduction);

    // Optional rewrite
    let suggestedRewrite: string | null = null;
    if (rewrite && uniqueFlags.length > 0 && process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const rewriteResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: text }],
        system: "Rewrite the following property description to remove all fair housing violations while preserving meaning, factual claims, and tone. Return only the rewritten description, no explanations.",
      });

      const rewriteBlock = rewriteResponse.content.find((b) => b.type === "text");
      if (rewriteBlock && rewriteBlock.type === "text") {
        suggestedRewrite = rewriteBlock.text.trim();
      }
    }

    // Persist to generation record if provided
    if (generationId) {
      await supabase
        .from("generations")
        .update({
          fair_housing_score: score,
          fair_housing_flags: uniqueFlags,
        })
        .eq("id", generationId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      flags: uniqueFlags,
      score,
      suggestedRewrite,
    });
  } catch (error) {
    console.error("Fair housing scan error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Scan failed" },
      { status: 500 }
    );
  }
}
