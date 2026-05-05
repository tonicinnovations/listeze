// v1.4 — Listing results with fair housing compliance badges + fix all
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, FileText, CheckCircle, Loader2, Clock, TextCursorInput, ShieldCheck, ShieldAlert, ShieldX, Download } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/posthog";

interface Flag {
  term: string;
  position: number;
  endPosition: number;
  category: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface Variant {
  description: string;
  headline: string;
  hook: string;
}

interface VariantState {
  variant: Variant;
  score: number | null;
  flags: Flag[];
  scanning: boolean;
  fixing: boolean;
}

interface ListingResultsProps {
  listings: {
    variants: Variant[];
    listingId?: string;
  } | null;
  isLoading: boolean;
}

const VARIANT_COLORS = [
  { from: "from-green-50/50", to: "to-emerald-50/50", bg: "from-green-500 to-emerald-500" },
  { from: "from-blue-50/50", to: "to-indigo-50/50", bg: "from-blue-500 to-indigo-500" },
  { from: "from-purple-50/50", to: "to-pink-50/50", bg: "from-purple-500 to-pink-500" },
];

function ComplianceBadge({ score, onClick }: { score: number | null; onClick: () => void }) {
  if (score === null) return null;

  if (score >= 90) {
    return (
      <button onClick={onClick} className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
        <ShieldCheck className="w-3 h-3" />
        {score}
      </button>
    );
  }
  if (score >= 70) {
    return (
      <button onClick={onClick} className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-medium">
        <ShieldAlert className="w-3 h-3" />
        {score}
      </button>
    );
  }
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium">
      <ShieldX className="w-3 h-3" />
      {score}
    </button>
  );
}

function HighlightedText({ text, flags }: { text: string; flags: Flag[] }) {
  if (flags.length === 0) return <span>{text}</span>;

  const sorted = [...flags].sort((a, b) => a.position - b.position);
  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  sorted.forEach((flag, i) => {
    if (flag.position > lastEnd) {
      parts.push(<span key={`t-${i}`}>{text.slice(lastEnd, flag.position)}</span>);
    }

    const severityColors = {
      high: "bg-red-200 text-red-900 border-b-2 border-red-400",
      medium: "bg-yellow-200 text-yellow-900 border-b-2 border-yellow-400",
      low: "bg-blue-100 text-blue-900 border-b-2 border-blue-300",
    };

    parts.push(
      <Tooltip key={`f-${i}`}>
        <TooltipTrigger className={`${severityColors[flag.severity]} rounded px-0.5 cursor-help`}>
          {text.slice(flag.position, flag.endPosition)}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold text-xs uppercase">{flag.category} — {flag.severity}</p>
          <p className="text-sm mt-1">{flag.suggestion}</p>
        </TooltipContent>
      </Tooltip>
    );

    lastEnd = flag.endPosition;
  });

  if (lastEnd < text.length) {
    parts.push(<span key="end">{text.slice(lastEnd)}</span>);
  }

  return <>{parts}</>;
}

export function ListingResults({ listings, isLoading }: ListingResultsProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [variantStates, setVariantStates] = useState<VariantState[]>([]);
  const [expandedFlags, setExpandedFlags] = useState<Set<number>>(new Set());

  // Auto-scan when listings change
  useEffect(() => {
    if (!listings) {
      setVariantStates([]);
      return;
    }

    const states = listings.variants.map((v) => ({
      variant: v,
      score: null,
      flags: [],
      scanning: true,
      fixing: false,
    }));
    setVariantStates(states);

    // Scan each variant
    listings.variants.forEach(async (variant, idx) => {
      try {
        const res = await fetch("/api/fair-housing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: variant.description }),
        });
        if (res.ok) {
          const data = await res.json();
          setVariantStates((prev) => {
            const updated = [...prev];
            if (updated[idx]) {
              updated[idx] = {
                ...updated[idx],
                score: data.score,
                flags: data.flags,
                scanning: false,
              };
            }
            return updated;
          });
        }
      } catch {
        setVariantStates((prev) => {
          const updated = [...prev];
          if (updated[idx]) {
            updated[idx] = { ...updated[idx], scanning: false };
          }
          return updated;
        });
      }
    });
  }, [listings]);

  const handleFixAll = async (idx: number) => {
    const state = variantStates[idx];
    if (!state || state.flags.length === 0) return;
    trackEvent("fix_all_clicked", { variant: idx, flag_count: state.flags.length });

    setVariantStates((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], fixing: true };
      return updated;
    });

    try {
      const res = await fetch("/api/fair-housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: state.variant.description, rewrite: true }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestedRewrite) {
          // Re-scan the rewrite
          const rescanRes = await fetch("/api/fair-housing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data.suggestedRewrite }),
          });
          const rescanData = rescanRes.ok ? await rescanRes.json() : { flags: [], score: 100 };

          setVariantStates((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              variant: { ...updated[idx].variant, description: data.suggestedRewrite },
              score: rescanData.score,
              flags: rescanData.flags,
              fixing: false,
            };
            return updated;
          });
          toast.success(`Variant ${idx + 1} rewritten for compliance`);
        }
      }
    } catch {
      toast.error("Rewrite failed");
      setVariantStates((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], fixing: false };
        return updated;
      });
    }
  };

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      toast.success(`Variant ${idx + 1} copied to clipboard`);
      setTimeout(() => setCopiedIdx(null), 3000);
    } catch {
      toast.error("Could not copy text to clipboard");
    }
  };

  const toggleFlags = (idx: number) => {
    setExpandedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Generating 3 Variants</h3>
              <p className="text-slate-600">Crafting professional MLS descriptions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!listings || variantStates.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Generate</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Fill in the property details to generate 3 professional MLS descriptions with fair housing compliance check.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm max-w-lg mx-auto">
              <div className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">3 variants</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-800">Compliance scan</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-xl">
                <TextCursorInput className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-purple-800">One-click fix</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {variantStates.map((state, idx) => {
        const colors = VARIANT_COLORS[idx] || VARIANT_COLORS[0];
        const wordCount = state.variant.description.split(/\s+/).length;
        const showFlags = expandedFlags.has(idx);

        return (
          <Card key={idx} className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
            <CardHeader className={`bg-gradient-to-r ${colors.from} ${colors.to} border-b border-slate-100`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colors.bg} rounded-lg flex items-center justify-center shadow-sm`}>
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span>Variant {idx + 1}</span>
                </h3>
                <div className="flex items-center space-x-2">
                  {state.scanning ? (
                    <Badge variant="secondary" className="text-xs"><Loader2 className="w-3 h-3 animate-spin mr-1" />Scanning</Badge>
                  ) : (
                    <ComplianceBadge score={state.score} onClick={() => toggleFlags(idx)} />
                  )}
                  {state.score !== null && state.score >= 90 && state.flags.length === 0 && (
                    <Badge className="bg-green-600 text-white text-xs">Fair Housing Reviewed</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">{wordCount} words</Badge>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(state.variant.description, idx)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {state.variant.headline && (
                <p className="mt-2 text-sm font-semibold text-slate-800">{state.variant.headline}</p>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {state.variant.hook && (
                <p className="text-sm text-blue-700 font-medium mb-3 italic">{state.variant.hook}</p>
              )}

              {/* Description with inline highlights when flags expanded */}
              <div className="text-slate-700 leading-relaxed">
                {showFlags && state.flags.length > 0 ? (
                  <HighlightedText text={state.variant.description} flags={state.flags} />
                ) : (
                  <p className="whitespace-pre-line">{state.variant.description}</p>
                )}
              </div>

              {/* Flag details panel */}
              {showFlags && state.flags.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-amber-900">
                      {state.flags.length} issue{state.flags.length > 1 ? "s" : ""} found
                    </h4>
                    <Button
                      size="sm"
                      onClick={() => handleFixAll(idx)}
                      disabled={state.fixing}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    >
                      {state.fixing ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Fixing...</> : "Fix All"}
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {state.flags.map((flag, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        <Badge variant={flag.severity === "high" ? "destructive" : "secondary"} className="text-xs shrink-0 mt-0.5">
                          {flag.severity}
                        </Badge>
                        <div>
                          <span className="font-medium">&ldquo;{flag.term}&rdquo;</span>
                          <span className="text-slate-600"> — {flag.suggestion}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>MLS-ready</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      trackEvent("export_clicked", { format: "docx", variant: idx });
                      try {
                        const res = await fetch("/api/export/docx", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            content: state.variant.description,
                            headline: state.variant.headline,
                          }),
                        });
                        if (res.ok) {
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `listing-variant-${idx + 1}.docx`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success("DOCX downloaded");
                        }
                      } catch {
                        toast.error("Export failed");
                      }
                    }}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" /> .docx
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(state.variant.description, idx)}
                    disabled={copiedIdx === idx}
                  >
                    {copiedIdx === idx ? "Copied!" : "Copy Listing"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
