// v1.4 — Fair housing scanner: regex pass + AI pass
import { FLAGGED_TERMS, type FlaggedTerm } from "./flagged-terms";
import { FLAGGED_TERMS_ES } from "./flagged-terms-es";

export interface Flag {
  term: string;
  position: number;
  endPosition: number;
  category: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

export interface ScanResult {
  flags: Flag[];
  score: number;
}

/**
 * Regex-based scan against the flagged terms list.
 * Returns flags with position offsets for inline highlighting.
 */
export function scanText(text: string, language: "en" | "es" = "en"): ScanResult {
  const flags: Flag[] = [];
  const lowerText = text.toLowerCase();
  const termList = language === "es" ? [...FLAGGED_TERMS, ...FLAGGED_TERMS_ES] : FLAGGED_TERMS;

  for (const flaggedTerm of termList) {
    const termLower = flaggedTerm.term.toLowerCase();
    let searchFrom = 0;

    while (true) {
      const idx = lowerText.indexOf(termLower, searchFrom);
      if (idx === -1) break;

      // Check word boundaries to avoid partial matches
      const charBefore = idx > 0 ? lowerText[idx - 1] : " ";
      const charAfter = idx + termLower.length < lowerText.length
        ? lowerText[idx + termLower.length]
        : " ";

      const isWordBoundaryBefore = /[\s,.\-;:!?"'(]/.test(charBefore) || idx === 0;
      const isWordBoundaryAfter = /[\s,.\-;:!?"')]/.test(charAfter) || idx + termLower.length === lowerText.length;

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        flags.push({
          term: text.substring(idx, idx + termLower.length),
          position: idx,
          endPosition: idx + termLower.length,
          category: flaggedTerm.category,
          severity: flaggedTerm.severity,
          suggestion: flaggedTerm.suggestion,
        });
      }

      searchFrom = idx + termLower.length;
    }
  }

  // Deduplicate by position
  const unique = flags.filter(
    (flag, i, arr) => arr.findIndex((f) => f.position === flag.position) === i
  );

  // Score: start at 100, deduct per flag
  const deductions: Record<string, number> = { high: 20, medium: 10, low: 5 };
  const totalDeduction = unique.reduce(
    (sum, f) => sum + (deductions[f.severity] || 5),
    0
  );
  const score = Math.max(0, 100 - totalDeduction);

  return { flags: unique, score };
}

/**
 * Build a prompt for Claude Haiku to catch context-sensitive issues
 * that the regex scan misses.
 */
export function buildAiScanPrompt(text: string): string {
  return `Analyze this property listing description for Fair Housing Act violations.
Look for:
- References to protected classes (race, color, religion, sex, disability, familial status, national origin)
- Coded language that implies preference or exclusion
- Demographic targeting of buyers
- Unverifiable claims about safety, crime, or school quality
- Ableist language

Text to analyze:
"""
${text}
"""

Respond with JSON only:
{
  "issues": [
    { "term": "the flagged phrase", "category": "category", "severity": "high|medium|low", "suggestion": "what to do instead" }
  ]
}

If no issues found, respond: { "issues": [] }`;
}
