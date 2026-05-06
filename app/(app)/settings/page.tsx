// v1.15 — Settings page: account info, plan, billing portal, navigation
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, User, CreditCard, History, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("trial");
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [portalLoading, setPortalLoading] = useState(false);

  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEmail(user.email || "");

    const { data: dbUser } = await supabase
      .from("users")
      .select("plan, trial_generations_used")
      .eq("id", user.id)
      .single();

    if (dbUser) {
      setPlan(dbUser.plan);
      setGenerationsUsed(dbUser.trial_generations_used || 0);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        const data = await res.json();
        toast.error(data.message || "Could not open billing portal");
      }
    } catch {
      toast.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const planLabels: Record<string, string> = {
    trial: "Free Trial",
    solo: "Solo",
    team: "Team",
    brokerage: "Brokerage",
    lifetime: "Lifetime",
    past_due: "Past Due",
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-card border-b-4 border-blue-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/generate" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-blue-800">Settings</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <h2 className="font-bold text-lg">Account</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">{email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <Badge className={plan === "trial" ? "bg-muted text-foreground" : "bg-blue-600 text-white"}>
                      {planLabels[plan] || plan}
                    </Badge>
                  </div>
                  {plan === "trial" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Free generations used</span>
                      <span className="text-sm font-medium">{generationsUsed} / 3</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <h2 className="font-bold text-lg">Quick Links</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/generate">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" /> Generate Listings
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button variant="outline" className="w-full justify-start">
                      <History className="w-4 h-4 mr-2" /> Past Submissions
                    </Button>
                  </Link>
                  {plan === "trial" && (
                    <Link href="/pricing">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                        <CreditCard className="w-4 h-4 mr-2" /> Upgrade Plan
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing */}
            {plan !== "trial" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="font-bold text-lg">Billing</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your subscription, update payment method, view invoices, or cancel.
                  </p>
                  <Button
                    onClick={handleBillingPortal}
                    disabled={portalLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {portalLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" />Opening...</>
                    ) : (
                      <><CreditCard className="w-4 h-4 mr-2" />Manage Billing</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
