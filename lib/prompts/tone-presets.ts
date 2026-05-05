// v1.3 — Tone presets for MLS descriptions
export const TONE_PRESETS = {
  mls_default: "Professional, MLS-tuned, balanced. Lead with strongest feature.",
  luxury: "Aspirational, refined vocabulary, evocative imagery. References to craftsmanship, provenance, lifestyle. Avoid 'cozy' and 'cute'.",
  starter: "Warm, accessible, opportunity-focused. Highlight value, livability, low-maintenance features.",
  investor: "Numbers-forward. Lead with cap rate potential, rentability, recent comps, condition. Skip emotional language.",
  family: "Functional rather than demographic. Mention lot size, storage, mudroom, multi-bedroom layouts — not 'great for kids'.",
  first_time: "Reassuring, demystifying. Highlight move-in readiness, recent updates, low surprises.",
  fixer: "Honest about condition. Lead with potential and bones — square footage, lot, layout. Use phrases like 'opportunity to update'.",
  vacation: "Lifestyle-driven. Proximity to attractions, rental history if any, short-term rental zoning if applicable.",
  land: "Spec-driven. Acreage, topography, utilities, zoning, easements, water rights, road access.",
} as const;

export type TonePreset = keyof typeof TONE_PRESETS;

export const TONE_LABELS: Record<TonePreset, string> = {
  mls_default: "MLS Default",
  luxury: "Luxury",
  starter: "Starter Home",
  investor: "Investor",
  family: "Family",
  first_time: "First-Time Buyer",
  fixer: "Fixer-Upper",
  vacation: "Vacation",
  land: "Land / Lot",
};

export const TONE_ICONS: Record<TonePreset, string> = {
  mls_default: "FileText",
  luxury: "Gem",
  starter: "Home",
  investor: "TrendingUp",
  family: "Users",
  first_time: "Key",
  fixer: "Wrench",
  vacation: "Palmtree",
  land: "Mountain",
};

export const TONE_EXAMPLES: Record<TonePreset, string> = {
  mls_default: "Professional, balanced MLS tone — works for most listings.",
  luxury: "\"Exquisite craftsmanship meets timeless elegance in this estate...\"",
  starter: "\"Your opportunity to own in a sought-after neighborhood...\"",
  investor: "\"Strong rental potential with recent updates and low maintenance...\"",
  family: "\"Spacious layout with large yard, mudroom, and ample storage...\"",
  first_time: "\"Move-in ready with modern updates — nothing left to do but unpack...\"",
  fixer: "\"Solid bones and great lot — bring your vision and make it yours...\"",
  vacation: "\"Steps from the beach with turnkey rental history...\"",
  land: "\"5.2 acres, gentle slope, paved road access, well and septic ready...\"",
};

/**
 * Auto-suggest a tone based on property input.
 */
export function suggestTone(sqft: number, features: string, lotSize: string): TonePreset {
  const f = features.toLowerCase();
  const l = lotSize.toLowerCase();

  if (f.includes("as-is") || f.includes("needs work") || f.includes("fixer") || f.includes("tlc")) {
    return "fixer";
  }
  if (sqft > 4000 || f.includes("marble") || f.includes("wine cellar") || f.includes("elevator") || f.includes("estate")) {
    return "luxury";
  }
  if (f.includes("rental") || f.includes("cap rate") || f.includes("investment") || f.includes("tenant")) {
    return "investor";
  }
  if (f.includes("beach") || f.includes("lake") || f.includes("ski") || f.includes("resort") || f.includes("vacation")) {
    return "vacation";
  }
  if (l.includes("acre") && !f && sqft === 0) {
    return "land";
  }
  if (sqft > 0 && sqft < 1500) {
    return "starter";
  }

  return "mls_default";
}
