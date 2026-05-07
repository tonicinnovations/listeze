// v2.0 — Animated demo: auto-types address, auto-fills specs, generates output
"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";

const DEMO_ADDRESS = "4821 E Cactus Rd, Scottsdale, AZ 85254";
const DEMO_SPECS = { beds: "4", baths: "3", sqft: "2,850", lot: "0.31 acres" };
const DEMO_OUTPUT = `Nestled on a tree-lined street in one of Scottsdale's most sought-after corridors, this beautifully updated 4-bedroom, 3-bath residence offers 2,850 square feet of refined living on a generous third-acre lot. Step inside to find soaring ceilings and sun-drenched living spaces anchored by a redesigned chef's kitchen with quartz countertops, soft-close cabinetry, and premium stainless appliances. The primary suite provides a private retreat with spa-inspired bath and walk-in closet. Outside, the resort-style backyard features a sparkling pool, covered patio with misting system, and mature desert landscaping — all designed for effortless Arizona entertaining.`;

type Phase = "idle" | "typing" | "looking-up" | "filling" | "generating" | "done";

export function AnimatedDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedAddress, setTypedAddress] = useState("");
  const [specs, setSpecs] = useState({ beds: "", baths: "", sqft: "", lot: "" });
  const [output, setOutput] = useState("");
  const [outputVisible, setOutputVisible] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const timeout = setTimeout(() => {
      setPhase("typing");
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setTypedAddress(DEMO_ADDRESS.slice(0, i));
        if (i >= DEMO_ADDRESS.length) {
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setPhase("looking-up");
            setTimeout(() => {
              setPhase("filling");
              setSpecs(DEMO_SPECS);
              setTimeout(() => {
                setPhase("generating");
                setOutput(DEMO_OUTPUT);
                let j = 0;
                const outputInterval = setInterval(() => {
                  j += 3;
                  setOutputVisible(j);
                  if (j >= DEMO_OUTPUT.length) {
                    clearInterval(outputInterval);
                    setPhase("done");
                  }
                }, 15);
              }, 800);
            }, 1200);
          }, 500);
        }
      }, 35);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_OUTPUT);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[2rem] blur-2xl" />

      <Card className="relative rounded-2xl shadow-2xl border border-border/50 overflow-hidden bg-card">
        {/* Terminal-style header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">ListEze Generator</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Address input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</label>
            <div className="mt-1 relative">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-sm font-mono">
                  {typedAddress}
                  {(phase === "typing") && <span className="animate-pulse text-blue-500">|</span>}
                </span>
              </div>
              {phase === "looking-up" && (
                <div className="absolute right-3 top-2.5">
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    Looking up...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Beds", value: specs.beds },
              { label: "Baths", value: specs.baths },
              { label: "Sq Ft", value: specs.sqft },
              { label: "Lot", value: specs.lot },
            ].map((spec) => (
              <div key={spec.label} className="rounded-lg border border-border bg-muted/30 p-2 text-center">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">{spec.label}</div>
                <div className={`text-sm font-bold mt-0.5 transition-all duration-300 ${spec.value ? "text-foreground" : "text-muted-foreground/30"}`}>
                  {spec.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Generating indicator */}
          {phase === "generating" && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              Generating MLS description...
            </div>
          )}

          {/* Output */}
          {output && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px]">Variant 1 of 3</Badge>
                  {phase === "done" && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px]">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      FH Score: 100
                    </Badge>
                  )}
                </div>
                {phase === "done" && (
                  <button onClick={copyOutput} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {output.slice(0, outputVisible)}
                {phase === "generating" && <span className="animate-pulse text-blue-500">|</span>}
              </p>
            </div>
          )}

          {/* Idle state */}
          {phase === "idle" && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <Sparkles className="w-5 h-5 mx-auto mb-2 text-blue-500 animate-pulse" />
              Watch the demo...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
