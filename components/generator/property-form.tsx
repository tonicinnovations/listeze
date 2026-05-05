// v1.3 — Property form with tone presets and length toggle
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Sparkles, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  TONE_LABELS,
  TONE_EXAMPLES,
  suggestTone,
  type TonePreset,
} from "@/lib/prompts/tone-presets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Gem,
  Home as HomeIcon,
  TrendingUp,
  Users,
  Key,
  Wrench,
  Palmtree,
  Mountain,
} from "lucide-react";

const TONE_ICON_MAP: Record<string, React.ReactNode> = {
  mls_default: <FileText className="w-3.5 h-3.5" />,
  luxury: <Gem className="w-3.5 h-3.5" />,
  starter: <HomeIcon className="w-3.5 h-3.5" />,
  investor: <TrendingUp className="w-3.5 h-3.5" />,
  family: <Users className="w-3.5 h-3.5" />,
  first_time: <Key className="w-3.5 h-3.5" />,
  fixer: <Wrench className="w-3.5 h-3.5" />,
  vacation: <Palmtree className="w-3.5 h-3.5" />,
  land: <Mountain className="w-3.5 h-3.5" />,
};

const generateListingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  bedrooms: z.string().min(1, "Bedrooms is required"),
  bathrooms: z.string().min(1, "Bathrooms is required"),
  sqft: z.number().min(1, "Square footage must be greater than 0"),
  lotSize: z.string().optional(),
  features: z.string().optional(),
  locationHighlights: z.string().optional(),
});

type GenerateListingRequest = z.infer<typeof generateListingSchema>;

interface Variant {
  description: string;
  headline: string;
  hook: string;
}

interface PropertyFormProps {
  onListingsGenerated: (data: {
    variants: Variant[];
    listingId?: string;
  }) => void;
  onLoadingChange: (loading: boolean) => void;
  onInputCapture?: (data: {
    address: string;
    bedrooms: string;
    bathrooms: string;
    sqft: number;
    lotSize?: string;
    features?: string;
    locationHighlights?: string;
  }) => void;
}

export function PropertyForm({
  onListingsGenerated,
  onLoadingChange,
  onInputCapture,
}: PropertyFormProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [tone, setTone] = useState<TonePreset>("mls_default");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");

  // Pre-fill from URL params (regenerate flow from history)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("address")) form.setValue("address", params.get("address")!);
    if (params.get("bedrooms")) form.setValue("bedrooms", params.get("bedrooms")!);
    if (params.get("bathrooms")) form.setValue("bathrooms", params.get("bathrooms")!);
    if (params.get("sqft")) form.setValue("sqft", parseInt(params.get("sqft")!) || 0);
    if (params.get("lotSize")) form.setValue("lotSize", params.get("lotSize")!);
    if (params.get("features")) form.setValue("features", params.get("features")!);
    if (params.get("locationHighlights")) form.setValue("locationHighlights", params.get("locationHighlights")!);
    if (params.get("tone")) setTone(params.get("tone") as TonePreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<GenerateListingRequest>({
    resolver: zodResolver(generateListingSchema),
    defaultValues: {
      address: "",
      bedrooms: "",
      bathrooms: "",
      sqft: 0,
      lotSize: "",
      features: "",
      locationHighlights: "",
    },
  });

  // Auto-suggest tone when key fields change
  const watchedSqft = form.watch("sqft");
  const watchedFeatures = form.watch("features");
  const watchedLotSize = form.watch("lotSize");

  const handleAutoSuggest = () => {
    const suggested = suggestTone(
      watchedSqft || 0,
      watchedFeatures || "",
      watchedLotSize || ""
    );
    if (suggested !== "mls_default") {
      setTone(suggested);
    }
  };

  const handleAddressLookup = async () => {
    const address = form.getValues("address");
    if (!address || address.trim().length < 10) return;

    setIsLookingUp(true);
    try {
      const res = await fetch("/api/address-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });
      const data = await res.json();

      if (data.found) {
        if (data.bedrooms) form.setValue("bedrooms", data.bedrooms);
        if (data.bathrooms) form.setValue("bathrooms", data.bathrooms);
        if (data.sqft) form.setValue("sqft", data.sqft);
        if (data.lotSize) form.setValue("lotSize", data.lotSize);
        form.trigger();
        // Auto-suggest tone after filling data
        setTimeout(handleAutoSuggest, 100);
        toast.success("Property details auto-filled!");
      } else {
        toast.error("Property not found. Please enter details manually.");
      }
    } catch {
      toast.error("Lookup failed. Please enter details manually.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const onSubmit = async (data: GenerateListingRequest) => {
    onLoadingChange(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tone, length }),
      });

      if (res.status === 402) {
        const err = await res.json();
        toast.error(err.message);
        if (err.upgradeUrl) window.location.href = err.upgradeUrl;
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Generation failed");
      }

      const result = await res.json();
      onListingsGenerated({
        variants: result.variants,
        listingId: result.listingId,
      });
      onInputCapture?.(data);
      toast.success("Listings generated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate listings"
      );
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 shadow-2xl border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b-2 border-blue-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Property Details</h2>
            <CardDescription className="text-blue-100">
              Enter the property address and basic specs will auto-fill.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">
              Property Address *
            </Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="123 Main Street, City, State ZIP"
                className="mt-2 pr-20"
                {...form.register("address")}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddressLookup}
                disabled={isLookingUp}
                className="absolute right-1 top-3 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-xs"
              >
                <Search className="w-3 h-3 mr-1" />
                {isLookingUp ? "..." : "Lookup"}
              </Button>
            </div>
            {form.formState.errors.address && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Bedrooms *</Label>
              <Select
                onValueChange={(value) => form.setValue("bedrooms", value ?? "")}
                value={form.watch("bedrooms")}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5", "6", "7", "8+"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.bedrooms && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.bedrooms.message}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Bathrooms *</Label>
              <Select
                onValueChange={(value) => form.setValue("bathrooms", value ?? "")}
                value={form.watch("bathrooms")}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5+"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.bathrooms && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.bathrooms.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sqft" className="text-sm font-medium text-slate-700">Square Footage *</Label>
              <Input id="sqft" type="number" placeholder="2,500" min="1" className="mt-2" {...form.register("sqft", { valueAsNumber: true })} />
              {form.formState.errors.sqft && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.sqft.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lotSize" className="text-sm font-medium text-slate-700">Lot Size</Label>
              <Input id="lotSize" placeholder="0.25 acres" className="mt-2" {...form.register("lotSize")} />
            </div>
          </div>

          <div>
            <Label htmlFor="features" className="text-sm font-medium text-slate-700">Key Features</Label>
            <Textarea id="features" rows={3} placeholder="Updated kitchen, hardwood floors, fireplace, garage, pool..." className="mt-2 resize-none" {...form.register("features")} />
          </div>

          <div>
            <Label htmlFor="locationHighlights" className="text-sm font-medium text-slate-700">Neighborhood & Location Highlights</Label>
            <Textarea id="locationHighlights" rows={3} placeholder="Close to schools, shopping centers, parks, downtown area..." className="mt-2 resize-none" {...form.register("locationHighlights")} />
          </div>

          {/* Tone Preset Chips */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Tone Preset</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TONE_LABELS) as TonePreset[]).map((key) => (
                <Tooltip key={key}>
                  <TooltipTrigger
                    type="button"
                    onClick={() => setTone(key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      tone === key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {TONE_ICON_MAP[key]}
                    {TONE_LABELS[key]}
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    {TONE_EXAMPLES[key]}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Length Toggle */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Description Length</Label>
            <div className="flex gap-2">
              {(["short", "medium", "long"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    length === l
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {l === "short" ? "Short (~250 chars)" : l === "medium" ? "Medium (~500 chars)" : "Long (~1000+ chars)"}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 font-semibold rounded-xl shadow-lg"
            disabled={form.formState.isSubmitting}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {form.formState.isSubmitting ? "Generating..." : "Generate Professional Listings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
