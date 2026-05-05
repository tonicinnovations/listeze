// v1.0 — Landing page demo widget (client-side only, no API call)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

export function LandingDemo() {
  const [demoForm, setDemoForm] = useState({
    address: "123 Maple Street, Denver, CO 80202",
    bedrooms: "4",
    bathrooms: "3",
    sqft: "2200",
    lotSize: "0.25 acres",
    features:
      "modern kitchen, quartz countertops, pool, finished basement, new roof",
    locationHighlights:
      "tree-lined streets, near top-rated schools, quick freeway access",
  });
  const [autoFilled, setAutoFilled] = useState(false);
  const [demoOutput, setDemoOutput] = useState({ var1: "", var2: "" });

  const simulateAddressLookup = () => {
    if (!autoFilled) {
      setDemoForm({
        ...demoForm,
        bedrooms: "4",
        bathrooms: "3",
        sqft: "2200",
        lotSize: "0.25 acres",
      });
      setAutoFilled(true);
    }
  };

  const generateSample = () => {
    const { bedrooms, bathrooms, sqft, features, locationHighlights } =
      demoForm;

    const v1 = `Welcome to this beautifully presented ${bedrooms}-bed, ${bathrooms}-bath home offering approximately ${sqft} sq ft of comfortable living. Highlights include ${features}. Set within ${locationHighlights}, this residence blends everyday convenience with inviting style - ideal for relaxing and entertaining alike. Thoughtful updates, abundant natural light, and an easy indoor-outdoor flow make this a must-see.`;

    const v2 = `Discover exceptional living in this stunning ${bedrooms}-bedroom, ${bathrooms}-bathroom residence spanning ${sqft} square feet. Premium features include ${features}, creating the perfect backdrop for modern living. Nestled in a desirable location with ${locationHighlights}, this home offers both comfort and convenience. Move-in ready with designer touches throughout - schedule your private showing today.`;

    setDemoOutput({ var1: v1, var2: v2 });
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Please select and copy manually");
    }
  };

  return (
    <div className="relative">
      <Card className="rounded-3xl shadow-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground/80">Sample Input</div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateSample();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label
              htmlFor="demo-address"
              className="text-sm font-medium block text-foreground/80 mb-1"
            >
              Property Address
            </label>
            <div className="relative">
              <input
                id="demo-address"
                type="text"
                value={demoForm.address}
                onChange={(e) =>
                  setDemoForm({ ...demoForm, address: e.target.value })
                }
                className="w-full rounded-xl border border-border px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter property address..."
              />
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Button
                type="button"
                onClick={simulateAddressLookup}
                size="sm"
                className="absolute right-2 top-2 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-xs"
              >
                <Search className="h-3 w-3 mr-1" />
                Lookup
              </Button>
            </div>
            {autoFilled && (
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Property details auto-filled! Customize below.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block text-foreground/80 mb-1">
                Bedrooms
              </label>
              <input
                type="text"
                value={demoForm.bedrooms}
                onChange={(e) =>
                  setDemoForm({ ...demoForm, bedrooms: e.target.value })
                }
                className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium block text-foreground/80 mb-1">
                Bathrooms
              </label>
              <input
                type="text"
                value={demoForm.bathrooms}
                onChange={(e) =>
                  setDemoForm({ ...demoForm, bathrooms: e.target.value })
                }
                className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block text-foreground/80 mb-1">
                Square Feet
              </label>
              <input
                type="number"
                min="0"
                value={demoForm.sqft}
                onChange={(e) =>
                  setDemoForm({ ...demoForm, sqft: e.target.value })
                }
                className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium block text-foreground/80 mb-1">
                Lot Size
              </label>
              <input
                type="text"
                value={demoForm.lotSize}
                onChange={(e) =>
                  setDemoForm({ ...demoForm, lotSize: e.target.value })
                }
                className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block text-foreground/80 mb-1">
              Property Features
            </label>
            <input
              type="text"
              value={demoForm.features}
              onChange={(e) =>
                setDemoForm({ ...demoForm, features: e.target.value })
              }
              className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="modern kitchen, hardwood floors, etc."
            />
          </div>

          <div>
            <label className="text-sm font-medium block text-foreground/80 mb-1">
              Location Highlights
            </label>
            <input
              type="text"
              value={demoForm.locationHighlights}
              onChange={(e) =>
                setDemoForm({
                  ...demoForm,
                  locationHighlights: e.target.value,
                })
              }
              className="w-full rounded-xl border border-border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="near schools, shopping, parks, etc."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Generate MLS Descriptions
          </Button>
        </form>

        {(demoOutput.var1 || demoOutput.var2) && (
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium text-foreground/80">
              Output Preview
            </div>
            {demoOutput.var1 && (
              <div className="rounded-2xl border border-border bg-muted p-4 text-sm">
                {demoOutput.var1}
              </div>
            )}
            {demoOutput.var2 && (
              <div className="rounded-2xl border border-border bg-muted p-4 text-sm">
                {demoOutput.var2}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => copyText(demoOutput.var1)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Variation 1
              </Button>
              <Button
                onClick={() => copyText(demoOutput.var2)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Variation 2
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
