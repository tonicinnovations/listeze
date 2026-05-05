// v1.5 — Format registry: maps format keys to prompt builders and plan access
import type { PropertyInput } from "./mls-description";
import { buildInstagramPrompt, buildFacebookPrompt, buildComingSoonPrompt } from "./social-caption";
import { buildEmailBlastPrompt } from "./email-blast";
import { buildFlyerCopyPrompt } from "./flyer-copy";
import { buildDoorKnockPrompt, buildColdCallPrompt } from "./scripts";

export interface FormatDef {
  key: string;
  label: string;
  buildPrompt: (input: PropertyInput) => string;
  plans: string[]; // which plans can access this format
}

export const FORMAT_REGISTRY: FormatDef[] = [
  // MLS handled separately via /api/generate
  {
    key: "ig_caption",
    label: "Instagram Caption",
    buildPrompt: buildInstagramPrompt,
    plans: ["solo", "team", "brokerage", "lifetime"],
  },
  {
    key: "fb_post",
    label: "Facebook Post",
    buildPrompt: buildFacebookPrompt,
    plans: ["solo", "team", "brokerage", "lifetime"],
  },
  {
    key: "email_blast",
    label: "Email Blast",
    buildPrompt: buildEmailBlastPrompt,
    plans: ["team", "brokerage", "lifetime"],
  },
  {
    key: "flyer",
    label: "Flyer Copy",
    buildPrompt: buildFlyerCopyPrompt,
    plans: ["team", "brokerage", "lifetime"],
  },
  {
    key: "door_knock",
    label: "Door Knock Script",
    buildPrompt: buildDoorKnockPrompt,
    plans: ["team", "brokerage", "lifetime"],
  },
  {
    key: "cold_call",
    label: "Cold Call Script",
    buildPrompt: buildColdCallPrompt,
    plans: ["team", "brokerage", "lifetime"],
  },
  {
    key: "coming_soon",
    label: "Coming Soon Teaser",
    buildPrompt: buildComingSoonPrompt,
    plans: ["team", "brokerage", "lifetime"],
  },
];

export function getFormatsForPlan(plan: string): FormatDef[] {
  return FORMAT_REGISTRY.filter((f) => f.plans.includes(plan));
}
