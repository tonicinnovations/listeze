// v1.0 — Listing results display (ported from Replit v0.x)
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileText, CheckCircle, Loader2, Clock, TextCursorInput } from "lucide-react";
import { toast } from "sonner";

interface ListingResultsProps {
  listings: {
    variation1: string;
    variation2: string;
    wordCounts: { variation1: number; variation2: number };
  } | null;
  isLoading: boolean;
}

export function ListingResults({ listings, isLoading }: ListingResultsProps) {
  const [copiedVariation, setCopiedVariation] = useState<string | null>(null);

  const copyToClipboard = async (text: string, variationName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVariation(variationName);
      toast.success(`${variationName} copied to clipboard`);
      setTimeout(() => setCopiedVariation(null), 3000);
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
                Generating Listings
              </h3>
              <p className="text-slate-600 text-lg">
                Creating professional MLS descriptions...
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
              Fill in the property details on the left to generate professional
              MLS listing descriptions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-500 max-w-lg mx-auto">
              <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">2 variations</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <TextCursorInput className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-800">120-180 words</span>
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
      {/* Variation 1 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span>Variation 1</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">
                {listings.wordCounts.variation1} words
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(listings.variation1, "Variation 1")
                }
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {listings.variation1}
          </p>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Professional tone</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(listings.variation1, "Variation 1")
              }
              disabled={copiedVariation === "Variation 1"}
            >
              {copiedVariation === "Variation 1" ? "Copied!" : "Copy Listing"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variation 2 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/60">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span>Variation 2</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">
                {listings.wordCounts.variation2} words
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(listings.variation2, "Variation 2")
                }
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {listings.variation2}
          </p>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Feature-focused</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(listings.variation2, "Variation 2")
              }
              disabled={copiedVariation === "Variation 2"}
            >
              {copiedVariation === "Variation 2" ? "Copied!" : "Copy Listing"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
