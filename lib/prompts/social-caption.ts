// v1.5 — Instagram caption prompt
import type { PropertyInput } from "./mls-description";

export function buildInstagramPrompt(input: PropertyInput): string {
  return `Write an Instagram caption for this property listing.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Engaging, scroll-stopping opening line
- 2200 character max
- Include emoji sparingly (2-3 max)
- End with a clear CTA
- Include 30 relevant real estate hashtags on a separate line

Respond with JSON:
{
  "caption": "the full caption text",
  "hashtags": "#hashtag1 #hashtag2 ..."
}`;
}

export function buildFacebookPrompt(input: PropertyInput): string {
  return `Write a Facebook post for this property listing.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Lot Size: ${input.lotSize || "Not specified"}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Long-form, conversational tone
- Tell a story about the lifestyle this home offers
- Include a clear CTA to schedule a showing or DM for details
- Link-friendly format (assume a link will be added after)
- 500-800 words

Respond with JSON:
{
  "post": "the full Facebook post text"
}`;
}

export function buildComingSoonPrompt(input: PropertyInput): string {
  return `Write a "Coming Soon" teaser post for Instagram/Facebook for this property.

PROPERTY:
- Address: ${input.address}
- Bedrooms: ${input.bedrooms}
- Bathrooms: ${input.bathrooms}
- Square Footage: ${input.sqft}
- Key Features: ${input.features || "None specified"}
- Location: ${input.locationHighlights || "None specified"}

REQUIREMENTS:
- Build anticipation without revealing everything
- Short (150-250 words)
- Tease 2-3 standout features
- CTA: "DM me for early access" or similar
- Include 5-10 hashtags

Respond with JSON:
{
  "post": "the teaser post text",
  "hashtags": "#comingsoon #hashtag2 ..."
}`;
}
