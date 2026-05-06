// v1.8 — History dashboard: searchable listing history with filters
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Copy,
  RefreshCw,
  Trash2,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { TONE_LABELS, type TonePreset } from "@/lib/prompts/tone-presets";

interface Listing {
  id: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: string | null;
  property_features: string | null;
  location_highlights: string | null;
  tone_preset: string | null;
  created_at: string;
  generations: Generation[];
}

interface Generation {
  id: string;
  format: string;
  content: string;
  fair_housing_score: number | null;
  created_at: string;
}

export default function HistoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toneFilter, setToneFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*, generations(*)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (searchQuery.trim()) {
      query = query.ilike("address", `%${searchQuery.trim()}%`);
    }

    if (toneFilter !== "all") {
      query = query.eq("tone_preset", toneFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load history");
    } else {
      setListings((data as Listing[]) || []);
    }
    setLoading(false);
  }, [searchQuery, toneFilter, supabase]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleDelete = async (listingId: string) => {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (error) {
      toast.error("Failed to delete listing");
    } else {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      toast.success("Listing deleted");
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

  const getBestScore = (generations: Generation[]): number | null => {
    const scores = generations
      .map((g) => g.fair_housing_score)
      .filter((s): s is number => s !== null);
    if (scores.length === 0) return null;
    return Math.min(...scores);
  };

  const ScoreBadge = ({ score }: { score: number | null }) => {
    if (score === null) return <Badge variant="secondary" className="text-xs">Not scanned</Badge>;
    if (score >= 90) return <Badge className="bg-green-100 text-green-700 text-xs"><ShieldCheck className="w-3 h-3 mr-1" />{score}</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-700 text-xs"><ShieldAlert className="w-3 h-3 mr-1" />{score}</Badge>;
    return <Badge className="bg-red-100 text-red-700 text-xs"><ShieldX className="w-3 h-3 mr-1" />{score}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getFormatLabel = (format: string): string => {
    const labels: Record<string, string> = {
      mls_short: "MLS Short",
      mls_medium: "MLS Medium",
      mls_long: "MLS Long",
      ig_caption: "Instagram",
      fb_post: "Facebook",
      email_blast: "Email",
      flyer: "Flyer",
      door_knock: "Door Knock",
      cold_call: "Cold Call",
      coming_soon: "Coming Soon",
    };
    return labels[format] || format;
  };

  const getRegenerateUrl = (listing: Listing): string => {
    const params = new URLSearchParams();
    params.set("address", listing.address);
    if (listing.bedrooms) params.set("bedrooms", String(listing.bedrooms));
    if (listing.bathrooms) params.set("bathrooms", String(listing.bathrooms));
    if (listing.square_feet) params.set("sqft", String(listing.square_feet));
    if (listing.lot_size) params.set("lotSize", listing.lot_size);
    if (listing.property_features) params.set("features", listing.property_features);
    if (listing.location_highlights) params.set("locationHighlights", listing.location_highlights);
    if (listing.tone_preset) params.set("tone", listing.tone_preset);
    return `/generate?${params.toString()}`;
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-card border-b-4 border-blue-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/generate" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">Listing History</h1>
              </div>
            </Link>
            <Link href="/generate">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                New Listing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  placeholder="Search by address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={toneFilter} onValueChange={(v) => setToneFilter(v ?? "all")}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All tones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tones</SelectItem>
                  {(Object.keys(TONE_LABELS) as TonePreset[]).map((key) => (
                    <SelectItem key={key} value={key}>{TONE_LABELS[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/70 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">Generate your first MLS listing to see it here.</p>
            <Link href="/generate">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Generate a Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => {
              const isExpanded = expandedId === listing.id;
              const bestScore = getBestScore(listing.generations);
              const genCount = listing.generations.length;

              return (
                <Card key={listing.id} className="bg-card/95">
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : listing.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground truncate">{listing.address}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(listing.created_at)}
                              {listing.tone_preset && ` · ${TONE_LABELS[listing.tone_preset as TonePreset] || listing.tone_preset}`}
                              {listing.square_feet && ` · ${listing.square_feet} sqft`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <ScoreBadge score={bestScore} />
                          <Badge variant="secondary" className="text-xs">{genCount} gen{genCount !== 1 ? "s" : ""}</Badge>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/70" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/70" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <CardContent className="pt-0 border-t border-border/50">
                      <div className="flex gap-2 mb-4 mt-3">
                        <Link href={getRegenerateUrl(listing)}>
                          <Button size="sm" variant="outline" className="text-xs">
                            <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(listing.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>

                      {listing.generations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No generations found.</p>
                      ) : (
                        <div className="space-y-3">
                          {listing.generations.map((gen) => {
                            // Try to parse JSON content, fall back to raw text
                            let displayText = gen.content;
                            try {
                              const parsed = JSON.parse(gen.content);
                              displayText = parsed.caption || parsed.post || parsed.plainText || parsed.script || parsed.description || gen.content;
                            } catch {
                              // raw text
                            }

                            return (
                              <div key={gen.id} className="rounded-lg border border-border p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{getFormatLabel(gen.format)}</Badge>
                                    <ScoreBadge score={gen.fair_housing_score} />
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyContent(displayText)}
                                    className="text-xs"
                                  >
                                    <Copy className="w-3 h-3 mr-1" /> Copy
                                  </Button>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 whitespace-pre-line">
                                  {displayText}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
