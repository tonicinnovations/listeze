// v1.3 — Listing results display (3 variants with headline/hook/description)
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, CheckCircle, Loader2, Clock, TextCursorInput } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  description: string;
  headline: string;
  hook: string;
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

export function ListingResults({ listings, isLoading }: ListingResultsProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

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

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Generating 3 Variants
              </h3>
              <p className="text-slate-600 text-lg">
                Crafting professional MLS descriptions...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!listings) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Ready to Generate Listings
            </h3>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Fill in the property details to generate 3 professional MLS listing
              descriptions with your chosen tone and length.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm max-w-lg mx-auto">
              <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">3 variants</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <TextCursorInput className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-800">9 tone presets</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <Copy className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-purple-800">Copy ready</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {listings.variants.map((variant, idx) => {
        const colors = VARIANT_COLORS[idx] || VARIANT_COLORS[0];
        const wordCount = variant.description.split(/\s+/).length;

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
                  <Badge variant="secondary" className="text-xs">{wordCount} words</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(variant.description, idx)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {variant.headline && (
                <p className="mt-2 text-sm font-semibold text-slate-800">{variant.headline}</p>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {variant.hook && (
                <p className="text-sm text-blue-700 font-medium mb-3 italic">
                  {variant.hook}
                </p>
              )}
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {variant.description}
              </p>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>MLS-ready</span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(variant.description, idx)}
                  disabled={copiedIdx === idx}
                >
                  {copiedIdx === idx ? "Copied!" : "Copy Listing"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
