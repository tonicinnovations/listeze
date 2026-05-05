// v1.5 — Generator page (3 variants, tone presets, length toggle, marketing kit)
"use client";

import { useState } from "react";
import { PropertyForm } from "@/components/generator/property-form";
import { ListingResults } from "@/components/generator/listing-results";
import { MarketingKit } from "@/components/generator/marketing-kit";
import { Home, Sparkles, TrendingUp, Package } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface Variant {
  description: string;
  headline: string;
  hook: string;
}

interface GeneratedData {
  variants: Variant[];
  listingId?: string;
}

export default function GeneratePage() {
  const [generatedListings, setGeneratedListings] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInput, setLastInput] = useState<{
    address: string;
    bedrooms: string;
    bathrooms: string;
    sqft: number;
    lotSize?: string;
    features?: string;
    locationHighlights?: string;
  } | null>(null);

  const handleGenerated = (data: GeneratedData) => {
    setGeneratedListings(data);
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="relative bg-card border-b-4 border-blue-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  ListEze MLS Generator
                </h1>
                <p className="text-sm text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-Powered Real Estate Copy</span>
                </p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Generate Professional MLS Listings
            <span className="text-blue-600"> in Seconds</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Smart address lookup automatically fills property details, then AI
            creates compelling, professional listing descriptions ready for MLS
            platforms.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>3 unique variations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-green-500" />
              <span>Fair housing scanned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-500" />
              <span>10-format marketing kit</span>
            </div>
          </div>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PropertyForm
              onListingsGenerated={handleGenerated}
              onLoadingChange={setIsLoading}
              onInputCapture={setLastInput}
            />
            {/* Marketing Kit button appears after generation */}
            {generatedListings?.listingId && lastInput && (
              <MarketingKit
                propertyData={{
                  listingId: generatedListings.listingId,
                  address: lastInput.address,
                  bedrooms: lastInput.bedrooms,
                  bathrooms: lastInput.bathrooms,
                  sqft: lastInput.sqft,
                  lotSize: lastInput.lotSize,
                  features: lastInput.features,
                  locationHighlights: lastInput.locationHighlights,
                }}
              />
            )}
          </div>
          <ListingResults listings={generatedListings} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
