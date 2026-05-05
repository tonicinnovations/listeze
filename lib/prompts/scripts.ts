// v1.5 — Door knock and cold call script prompts
import type { PropertyInput } from "./mls-description";

export function buildDoorKnockPrompt(input: PropertyInput): string {
  return `Write a 90-second door knock script for a "just listed" property. The agent is visiting neighbors of the listed property.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Friendly, neighborly tone
- Introduce yourself and mention the listing
- Ask if they know anyone looking to move to the area
- Offer to share market info
- 90 seconds when spoken aloud (~200 words)
- Include stage directions in brackets [knock on door, smile, etc.]

Respond with JSON:
{
  "script": "the full door knock script with [stage directions]"
}`;
}

export function buildColdCallPrompt(input: PropertyInput): string {
  return `Write a cold call script for reaching out to absentee owners near this listed property.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Professional opener (identify yourself, reason for call)
- Value proposition (market activity in their area)
- Soft ask (would they consider selling, or know someone who would?)
- Handle one common objection
- 60-90 seconds when spoken (~150-200 words)

Respond with JSON:
{
  "script": "the full cold call script"
}`;
}
