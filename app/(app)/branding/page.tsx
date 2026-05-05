// v1.11 — Branding: logo upload + primary color
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Palette, Upload, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [userPlan, setUserPlan] = useState("trial");
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchBranding = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: dbUser } = await supabase
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single();
    setUserPlan(dbUser?.plan || "trial");

    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (membership) {
      const { data: team } = await supabase
        .from("teams")
        .select("id, brand_logo_url, brand_primary_color")
        .eq("id", membership.team_id)
        .single();

      if (team) {
        setTeamId(team.id);
        setLogoUrl(team.brand_logo_url);
        if (team.brand_primary_color) setPrimaryColor(team.brand_primary_color);
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const handleLogoUpload = async (file: File) => {
    if (!teamId) return;

    const ext = file.name.split(".").pop();
    const path = `logos/${teamId}.${ext}`;

    const { error } = await supabase.storage
      .from("brand-assets")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Failed to upload logo");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("brand-assets")
      .getPublicUrl(path);

    setLogoUrl(urlData.publicUrl);

    await supabase
      .from("teams")
      .update({ brand_logo_url: urlData.publicUrl })
      .eq("id", teamId);

    toast.success("Logo uploaded");
  };

  const handleSaveColor = async () => {
    if (!teamId) return;
    setSaving(true);

    const { error } = await supabase
      .from("teams")
      .update({ brand_primary_color: primaryColor })
      .eq("id", teamId);

    if (error) {
      toast.error("Failed to save color");
    } else {
      toast.success("Brand color saved");
    }
    setSaving(false);
  };

  const canBrand = ["team", "brokerage", "lifetime"].includes(userPlan);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <header className="bg-white border-b-4 border-blue-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/generate" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-blue-800">Branding</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          </div>
        ) : !canBrand ? (
          <Card className="p-8 text-center">
            <Palette className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Brand customization requires a Team or Brokerage plan</h2>
            <p className="text-slate-600 mb-6">Upgrade to add your logo and brand colors to exports.</p>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Plans</Button>
            </Link>
          </Card>
        ) : !teamId ? (
          <Card className="p-8 text-center">
            <Palette className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Create a team first</h2>
            <p className="text-slate-600 mb-6">Set up your team to access branding options.</p>
            <Link href="/team">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go to Team</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Logo */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold">Brokerage Logo</h2>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                />
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-white overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" onClick={() => fileRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      {logoUrl ? "Replace Logo" : "Upload Logo"}
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, or SVG. Will appear on exports.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Color */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold">Brand Color</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <Label className="text-sm">Primary Color</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-28 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveColor} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white mt-6">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Color"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold">Export Preview</h2>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-xl p-6 bg-white">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: primaryColor }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
                    ) : (
                      <div className="h-8 w-24 bg-slate-200 rounded" />
                    )}
                    <span className="text-xs text-slate-500">Branded Export</span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: primaryColor }}>
                    Beautiful 4-Bed Home in Scottsdale
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    This is a preview of how your branded exports will look. Your logo and brand color will appear on .docx, PDF flyer, and email exports.
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Generated by ListEze</span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
