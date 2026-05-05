// v1.5 — Flyer copy prompt
import type { PropertyInput } from "./mls-description";

export function buildFlyerCopyPrompt(input: PropertyInput): string {
  return `Write copy for a real estate flyer (8.5x11 print) for this property.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Bold headline (8 words max)
- Subheadline (15 words max)
- 3 bullet feature highlights (each 10-15 words)
- Short body paragraph (50-75 words)
- CTA with placeholder for agent name/phone

Respond with JSON:
{
  "headline": "bold headline",
  "subheadline": "supporting subheadline",
  "bullets": ["feature 1", "feature 2", "feature 3"],
  "body": "short body paragraph",
  "cta": "call to action text"
}`;
}
