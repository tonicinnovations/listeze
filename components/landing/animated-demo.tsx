// v2.1 — Animated demo: loops, matches real generator UI
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Sparkles, Copy, Search, FileText, Check } from "lucide-react";
import { toast } from "sonner";

const DEMOS = [
  {
    address: "4821 E Cactus Rd, Scottsdale, AZ 85254",
    specs: { beds: "4", baths: "3", sqft: "2,850", lot: "0.31 acres" },
    features: "quartz countertops, pool, covered patio, desert landscaping",
    tone: "MLS Default",
    output: `Nestled on a tree-lined street in one of Scottsdale's most sought-after corridors, this beautifully updated 4-bedroom, 3-bath residence offers 2,850 square feet of refined living on a generous third-acre lot. Step inside to find soaring ceilings and sun-drenched living spaces anchored by a redesigned chef's kitchen with quartz countertops, soft-close cabinetry, and premium stainless appliances. The primary suite provides a private retreat with spa-inspired bath and walk-in closet. Outside, the resort-style backyard features a sparkling pool, covered patio with misting system, and mature desert landscaping.`,
  },
  {
    address: "2100 N Central Ave, Phoenix, AZ 85004",
    specs: { beds: "2", baths: "2", sqft: "1,180", lot: "N/A" },
    features: "floor-to-ceiling windows, modern kitchen, rooftop access",
    tone: "Starter",
    output: `Welcome to urban living at its finest in the heart of downtown Phoenix. This move-in ready 2-bedroom, 2-bath condo offers 1,180 square feet of thoughtfully designed space with floor-to-ceiling windows that flood every room with natural light. The modern kitchen features clean-line cabinetry, quartz counters, and stainless appliances. Building amenities include a rooftop deck with panoramic city views, fitness center, and secured parking. Steps from restaurants, light rail, and Roosevelt Row arts district.`,
  },
  {
    address: "8500 E Indian Bend Rd, Paradise Valley, AZ 85253",
    specs: { beds: "6", baths: "7", sqft: "8,200", lot: "1.2 acres" },
    features: "wine cellar, home theater, infinity pool, mountain views",
    tone: "Luxury",
    output: `An extraordinary expression of desert modern architecture, this 8,200-square-foot estate commands a premier 1.2-acre parcel with unobstructed Camelback Mountain views. Six bedroom suites and seven baths are complemented by a temperature-controlled wine cellar, private home theater with acoustic paneling, and a chef's kitchen appointed with La Cornue range and marble waterfall island. The primary wing encompasses a private terrace, dual walk-in closets, and spa-caliber bath. The negative-edge infinity pool and outdoor pavilion with built-in kitchen create a resort-caliber entertaining experience.`,
  },
];

type Phase = "idle" | "typing" | "looking-up" | "filling" | "generating" | "done" | "pausing";

export function AnimatedDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedAddress, setTypedAddress] = useState("");
  const [specs, setSpecs] = useState({ beds: "", baths: "", sqft: "", lot: "" });
  const [features, setFeatures] = useState("");
  const [output, setOutput] = useState("");
  const [outputVisible, setOutputVisible] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const reset = useCallback(() => {
    setTypedAddress("");
    setSpecs({ beds: "", baths: "", sqft: "", lot: "" });
    setFeatures("");
    setOutput("");
    setOutputVisible(0);
    setScore(null);
    setPhase("idle");
  }, []);

  const runDemo = useCallback((idx: number) => {
    const demo = DEMOS[idx];
    reset();

    addTimeout(() => {
      setPhase("typing");
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypedAddress(demo.address.slice(0, i));
        if (i >= demo.address.length) {
          clearInterval(typeInterval);
          addTimeout(() => {
            setPhase("looking-up");
            addTimeout(() => {
              setPhase("filling");
              setSpecs(demo.specs);
              setFeatures(demo.features);
              addTimeout(() => {
                setPhase("generating");
                setOutput(demo.output);
                let j = 0;
                const outputInterval = setInterval(() => {
                  j += 4;
                  setOutputVisible(j);
                  if (j >= demo.output.length) {
                    clearInterval(outputInterval);
                    setScore(100);
                    setPhase("done");
                    // Pause then loop
                    addTimeout(() => {
                      setPhase("pausing");
                      addTimeout(() => {
                        const nextIdx = (idx + 1) % DEMOS.length;
                        setDemoIndex(nextIdx);
                        runDemo(nextIdx);
                      }, 1500);
                    }, 4000);
                  }
                }, 12);
              }, 800);
            }, 1000);
          }, 400);
        }
      }, 30);
    }, 1000);
  }, [reset, addTimeout]);

  useEffect(() => {
    runDemo(0);
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demo = DEMOS[demoIndex];

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-blue-500/15 rounded-[2rem] blur-2xl" />

      <Card className="relative rounded-2xl shadow-2xl border border-border/50 overflow-hidden bg-card">
        {/* Header matching real generator */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b py-3 px-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Property Details</h2>
              <CardDescription className="text-blue-100 text-xs">
                Enter address and specs auto-fill
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Address field */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Property Address</label>
            <div className="relative">
              <div className="flex items-center rounded-lg border border-border bg-background px-3 py-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground mr-2 shrink-0" />
                <span className="text-sm flex-1 min-h-[20px]">
                  {typedAddress}
                  {phase === "typing" && <span className="animate-pulse text-blue-500">|</span>}
                </span>
                <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                  phase === "looking-up" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-muted text-muted-foreground"
                }`}>
                  <Search className="w-2.5 h-2.5" />
                  {phase === "looking-up" ? "Looking up..." : "Lookup"}
                </div>
              </div>
              {(phase === "filling" || phase === "generating" || phase === "done" || phase === "pausing") && (
                <p className="text-[10px] text-green-600 mt-1 flex items-center">
                  <Check className="h-2.5 w-2.5 mr-0.5" />
                  Property details auto-filled
                </p>
              )}
            </div>
          </div>

          {/* Specs row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Beds", value: specs.beds },
              { label: "Baths", value: specs.baths },
              { label: "Sq Ft", value: specs.sqft },
              { label: "Lot", value: specs.lot },
            ].map((spec) => (
              <div key={spec.label}>
                <label className="text-[10px] font-medium text-foreground block mb-0.5">{spec.label}</label>
                <div className={`rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm transition-all duration-300 ${
                  spec.value ? "font-semibold text-foreground" : "text-muted-foreground/30"
                }`}>
                  {spec.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <label className="text-[10px] font-medium text-foreground block mb-0.5">Key Features</label>
            <div className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs min-h-[28px] text-muted-foreground">
              {features || "—"}
            </div>
          </div>

          {/* Tone chip */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-medium text-foreground">Tone:</label>
            <Badge className="bg-blue-600 text-white text-[10px]">{demo.tone}</Badge>
          </div>

          {/* Generate button */}
          <Button
            className={`w-full rounded-lg text-sm font-semibold transition-all ${
              phase === "generating"
                ? "bg-blue-500 text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            }`}
            disabled
          >
            {phase === "generating" ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Generate Professional Listings
              </span>
            )}
          </Button>

          {/* Output */}
          {output && outputVisible > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold">Variant 1</span>
                </div>
                <div className="flex items-center gap-2">
                  {score !== null && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px]">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      {score}
                    </Badge>
                  )}
                  {phase === "done" && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(demo.output);
                          toast.success("Copied to clipboard");
                        } catch {
                          toast.error("Copy failed");
                        }
                      }}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <Copy className="w-2.5 h-2.5" /> Copy
                    </button>
                  )}
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs leading-relaxed text-foreground/80">
                  {output.slice(0, outputVisible)}
                  {phase === "generating" && <span className="animate-pulse text-blue-500">|</span>}
                </p>
              </div>
            </div>
          )}

          {/* Idle */}
          {phase === "idle" && (
            <div className="text-center py-4 text-muted-foreground text-xs">
              <Sparkles className="w-4 h-4 mx-auto mb-1.5 text-blue-500 animate-pulse" />
              Starting demo...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo indicator dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {DEMOS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === demoIndex ? "bg-blue-600" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
