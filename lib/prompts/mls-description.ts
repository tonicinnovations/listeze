// v1.3 — MLS description prompt with tone presets and length tiers
import { TONE_PRESETS, type TonePreset } from "./tone-presets";

export interface PropertyInput {
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: number;
  lotSize?: string;
  features?: string;
  locationHighlights?: string;
}

export type LengthTier = "short" | "medium" | "long";

const LENGTH_GUIDES: Record<LengthTier, string> = {
  short: "Write approximately 250 words per variant. Concise and MLS-ready.",
  medium: "Write approximately 500 words per variant. Balanced detail and narrative.",
  long: "Write approximately 750 words per variant. Rich detail, full narrative, comprehensive description.",
};

export function buildSystemPrompt(tone: TonePreset = "mls_default", language: "en" | "es" = "en"): string {
  const langInstruction = language === "es"
    ? "\n\nIMPORTANT: Write ALL output in native, professional Spanish. Do NOT translate from English — write as a native Spanish-speaking real estate copywriter would. Use vocabulary natural to the TX/FL/AZ/CA Spanish-speaking market."
    : "";

  return `You are a senior real estate copywriter with 15+ years writing MLS descriptions.

RULES:
- No Fair Housing Act violations. Never reference race, religion, familial status, disability, sex, or national origin.
- No superlatives without specifics — don't say "best" or "amazing" without backing it up.
- Lead with the strongest feature of the property.
- Vary sentence length for readability.
- Use "primary bedroom" not "master bedroom".
- Do not invent features not provided in the input.

SEO OPTIMIZATION:
- Naturally incorporate the city, state, and neighborhood name early in the description.
- Include the property type (e.g., "single-family home", "condo", "townhouse") within the first two sentences.
- Use buyer search phrases naturally: "move-in ready", "updated kitchen", "open floor plan", "near schools", "close to downtown", etc.
- Include specific measurements and counts (bedrooms, bathrooms, square footage) as text, not just numbers.
- Write a headline that includes the city/neighborhood and a compelling feature.
- The hook (opening sentence) should be unique and attention-grabbing for search snippets.
- Do NOT keyword-stuff — every search term must read naturally in context.

TONE: ${TONE_PRESETS[tone]}${langInstruction}

Always respond with valid JSON only. No markdown code fences.`;
}

export function buildMlsPrompt(
  input: PropertyInput,
  tone: TonePreset = "mls_default",
  length: LengthTier = "medium",
  language: "en" | "es" = "en"
): string {
  const langNote = language === "es" ? "\n\nWrite ALL variants in native Spanish." : "";
  return `Generate 3 distinct MLS listing description variants for this property.${langNote}

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Location Highlights: ${input.locationHighlights || "None specified"}

LENGTH: ${LENGTH_GUIDES[length]}

Respond with this exact JSON format:
{
  "variants": [
    { "description": "...", "headline": "short punchy headline", "hook": "opening sentence" },
    { "description": "...", "headline": "...", "hook": "..." },
    { "description": "...", "headline": "...", "hook": "..." }
  ]
}`;
}
