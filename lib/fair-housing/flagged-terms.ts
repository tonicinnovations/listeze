// v1.4 — Fair Housing Act + state-level flagged terms
// Source: HUD guidance, NAR Code of Ethics Article 10, state real estate commission bulletins
export interface FlaggedTerm {
  term: string;
  category: "familial" | "race" | "religion" | "disability" | "sex";
  severity: "high" | "medium" | "low";
  suggestion: string;
}

export const FLAGGED_TERMS: FlaggedTerm[] = [
  // Familial status
  { term: "family-friendly", category: "familial", severity: "high", suggestion: "describe features: large yard, multiple bedrooms" },
  { term: "great for families", category: "familial", severity: "high", suggestion: "describe features instead of audience" },
  { term: "perfect for kids", category: "familial", severity: "high", suggestion: "mention fenced yard, play space, etc." },
  { term: "bachelor pad", category: "familial", severity: "high", suggestion: "describe layout neutrally" },
  { term: "empty nesters", category: "familial", severity: "medium", suggestion: "describe single-level, low-maintenance, etc." },
  { term: "no children", category: "familial", severity: "high", suggestion: "remove entirely — illegal" },
  { term: "adults only", category: "familial", severity: "high", suggestion: "remove unless legally 55+ community" },
  { term: "young couple", category: "familial", severity: "medium", suggestion: "describe the property, not the buyer" },
  { term: "singles", category: "familial", severity: "medium", suggestion: "describe the property, not the buyer" },
  { term: "mature couple", category: "familial", severity: "medium", suggestion: "describe the property, not the buyer" },

  // Race / ethnicity / national origin
  { term: "exclusive neighborhood", category: "race", severity: "high", suggestion: "describe specific amenities or location" },
  { term: "exclusive area", category: "race", severity: "high", suggestion: "describe specific amenities or location" },
  { term: "traditional neighborhood", category: "race", severity: "medium", suggestion: "describe architecture or era instead" },
  { term: "established neighborhood", category: "race", severity: "low", suggestion: "consider 'mature trees' or specific year built" },
  { term: "integrated", category: "race", severity: "high", suggestion: "remove — implies racial commentary" },
  { term: "ethnic", category: "race", severity: "high", suggestion: "remove" },
  { term: "desirable neighborhood", category: "race", severity: "medium", suggestion: "describe specific amenities" },
  { term: "changing neighborhood", category: "race", severity: "high", suggestion: "remove — implies demographic shift" },

  // Religion
  { term: "near churches", category: "religion", severity: "high", suggestion: "if relevant, name a non-religious landmark" },
  { term: "christian community", category: "religion", severity: "high", suggestion: "remove" },
  { term: "near temple", category: "religion", severity: "high", suggestion: "remove" },
  { term: "near mosque", category: "religion", severity: "high", suggestion: "remove" },
  { term: "near synagogue", category: "religion", severity: "high", suggestion: "remove" },

  // Disability / ableist
  { term: "walking distance", category: "disability", severity: "medium", suggestion: "use 'X miles to' or '5-minute drive to'" },
  { term: "able-bodied", category: "disability", severity: "high", suggestion: "remove" },
  { term: "must be able to", category: "disability", severity: "high", suggestion: "rewrite without ability requirement" },
  { term: "handicapped", category: "disability", severity: "high", suggestion: "use 'accessible' instead" },

  // Sex / gender
  { term: "master bedroom", category: "sex", severity: "low", suggestion: "use 'primary bedroom' (NAR-preferred since 2020)" },
  { term: "master suite", category: "sex", severity: "low", suggestion: "use 'primary suite'" },
  { term: "master bath", category: "sex", severity: "low", suggestion: "use 'primary bath'" },
  { term: "mother-in-law suite", category: "sex", severity: "low", suggestion: "use 'in-law suite' or 'accessory dwelling unit'" },
  { term: "man cave", category: "sex", severity: "low", suggestion: "use 'bonus room' or 'recreation room'" },

  // Implicit safety/crime claims
  { term: "safe neighborhood", category: "race", severity: "high", suggestion: "remove — implies discriminatory comparison" },
  { term: "low crime", category: "race", severity: "high", suggestion: "remove — cannot make this claim" },
  { term: "bad area", category: "race", severity: "high", suggestion: "remove" },
  { term: "dangerous area", category: "race", severity: "high", suggestion: "remove" },

  // Schools (subtle — context-dependent)
  { term: "good schools", category: "race", severity: "medium", suggestion: "name the district and let buyer research ratings" },
  { term: "top-rated schools", category: "race", severity: "medium", suggestion: "name the district by name" },
  { term: "best schools", category: "race", severity: "medium", suggestion: "name the district by name" },

  // Other commonly-cited
  { term: "private community", category: "race", severity: "medium", suggestion: "describe HOA or gated features specifically" },
  { term: "members only", category: "race", severity: "medium", suggestion: "describe the club/HOA factually" },
  { term: "restricted", category: "race", severity: "high", suggestion: "specify what is restricted (e.g., HOA rules)" },
];
