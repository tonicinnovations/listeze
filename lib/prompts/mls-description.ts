// v1.0 — MLS description prompt (ported from v0.x OpenAI prompt, adapted for Anthropic)
export interface PropertyInput {
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: number;
  lotSize?: string;
  features?: string;
  locationHighlights?: string;
}

export function buildMlsPrompt(input: PropertyInput): string {
  return `You are an experienced real estate copywriter.
Your task is to generate a professional, MLS-ready property listing description.

INPUT DETAILS:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Neighborhood/Location Highlights: ${input.locationHighlights || "None specified"}

OUTPUT REQUIREMENTS:
- Write in an inviting, professional tone that appeals to homebuyers.
- Highlight the property's unique features.
- Emphasize lifestyle benefits (neighborhood, convenience, comfort).
- Keep each variation between 120-180 words.
- Provide 2 different variations.

Respond with JSON in this exact format:
{
  "variation1": "MLS listing text for variation 1",
  "variation2": "MLS listing text for variation 2"
}`;
}
