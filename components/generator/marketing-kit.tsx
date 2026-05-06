// v1.5 — Marketing kit modal: select formats, generate, display in tabs
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Copy, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FORMAT_REGISTRY } from "@/lib/prompts/format-registry";

interface PropertyData {
  listingId: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: number;
  lotSize?: string;
  features?: string;
  locationHighlights?: string;
}

interface FormatOutput {
  format: string;
  label: string;
  content: Record<string, unknown>;
  fairHousing: { score: number; flags: unknown[] };
}

export function MarketingKit({ propertyData }: { propertyData: PropertyData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    new Set(FORMAT_REGISTRY.map((f) => f.key))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<FormatOutput[]>([]);

  const toggleFormat = (key: string) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selectedFormats.size === 0) {
      toast.error("Select at least one format");
      return;
    }

    setIsGenerating(true);
    setOutputs([]);

    try {
      const res = await fetch("/api/generate-multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...propertyData,
          formats: Array.from(selectedFormats),
        }),
      });

      if (res.status === 402) {
        const data = await res.json();
        toast.error(data.message);
        if (data.upgradeUrl) window.location.href = data.upgradeUrl;
        return;
      }

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setOutputs(data.outputs || []);

      if (data.errors?.length > 0) {
        toast.error(`${data.errors.length} format(s) failed to generate`);
      } else {
        toast.success(`${data.outputs.length} formats generated!`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const getDisplayText = (content: Record<string, unknown>): string => {
    const parts: string[] = [];
    if (content.subject) parts.push(`Subject: ${content.subject}`);
    if (content.previewText) parts.push(`Preview: ${content.previewText}`);
    if (content.headline) parts.push(`${content.headline}`);
    if (content.subheadline) parts.push(`${content.subheadline}`);
    if (content.caption) parts.push(content.caption as string);
    if (content.post) parts.push(content.post as string);
    if (content.plainText) parts.push(content.plainText as string);
    if (content.script) parts.push(content.script as string);
    if (content.body) parts.push(content.body as string);
    if (content.bullets && Array.isArray(content.bullets)) {
      parts.push(content.bullets.map((b: string) => `• ${b}`).join("\n"));
    }
    if (content.cta) parts.push(`CTA: ${content.cta}`);
    if (content.hashtags) parts.push(`\n${content.hashtags}`);
    return parts.join("\n\n");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-6 font-semibold transition-colors">
        <Package className="w-5 h-5" />
        Generate Marketing Kit
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Marketing Kit — {propertyData.address}</DialogTitle>
        </DialogHeader>

        {outputs.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the formats you want to generate from this listing:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FORMAT_REGISTRY.map((f) => (
                <button
                  key={f.key}
                  onClick={() => toggleFormat(f.key)}
                  className={`rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                    selectedFormats.has(f.key)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || selectedFormats.size === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating {selectedFormats.size} formats...</>
              ) : (
                `Generate ${selectedFormats.size} Format${selectedFormats.size > 1 ? "s" : ""}`
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={outputs[0]?.format}>
            <TabsList className="flex flex-wrap gap-1 h-auto">
              {outputs.map((o) => (
                <TabsTrigger key={o.format} value={o.format} className="text-xs">
                  {o.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {outputs.map((o) => {
              const displayText = getDisplayText(o.content);
              return (
                <TabsContent key={o.format} value={o.format}>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{o.label}</h3>
                        <div className="flex items-center gap-2">
                          {o.fairHousing.score >= 90 && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              {o.fairHousing.score}
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => copyContent(displayText)}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm text-foreground/80 font-sans leading-relaxed">
                        {displayText}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => { setOutputs([]); }}
            >
              Generate More Formats
            </Button>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
