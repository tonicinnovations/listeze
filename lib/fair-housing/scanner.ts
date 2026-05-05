// v1.0 — Fair housing scanner stub
export interface Flag {
  term: string;
  position: number;
  category: string;
  severity: string;
  suggestion: string;
}

export function scanText(_text: string): { flags: Flag[]; score: number } {
  return { flags: [], score: 100 };
}
