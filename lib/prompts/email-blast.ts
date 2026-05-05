// v1.5 — Email blast prompt
import type { PropertyInput } from "./mls-description";

export function buildEmailBlastPrompt(input: PropertyInput): string {
  return `Write a real estate email blast for this property listing.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Subject line (50 chars max, compelling)
- Preview text (90 chars max)
- Plain text version (300-500 words)
- Professional but warm tone
- Clear CTA to schedule a showing
- Include property highlights as bullet points

Respond with JSON:
{
  "subject": "email subject line",
  "previewText": "preview text for email clients",
  "plainText": "the full plain text email body"
}`;
}
