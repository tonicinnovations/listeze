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
  short: "Keep each variant under 250 characters. Tight, punchy, MLS-ready.",
  medium: "Target 400-600 characters per variant. Balanced detail.",
  long: "Write 800-1200 characters per variant. Rich detail, full narrative.",
};

export function buildSystemPrompt(tone: TonePreset = "mls_default"): string {
  return `You are a senior real estate copywriter with 15+ years writing MLS descriptions.

RULES:
- No Fair Housing Act violations. Never reference race, religion, familial status, disability, sex, or national origin.
- No superlatives without specifics — don't say "best" or "amazing" without backing it up.
- Lead with the strongest feature of the property.
- Vary sentence length for readability.
- Use "primary bedroom" not "master bedroom".
- Do not invent features not provided in the input.

TONE: ${TONE_PRESETS[tone]}

Always respond with valid JSON only. No markdown code fences.`;
}

export function buildMlsPrompt(
  input: PropertyInput,
  tone: TonePreset = "mls_default",
  length: LengthTier = "medium"
): string {
  return `Generate 3 distinct MLS listing description variants for this property.

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
