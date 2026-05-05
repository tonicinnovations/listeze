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
