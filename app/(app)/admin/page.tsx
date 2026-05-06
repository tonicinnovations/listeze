// v1.14 — Admin dashboard: MRR, signups, costs, usage
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, DollarSign, Cpu, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // Cache for 60 seconds

// Use service role for admin queries (bypasses RLS)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAdminData() {
  const supabase = getAdminSupabase();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // Today's signups
  const { count: signupsToday } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay);

  // Today's generations
  const { count: generationsToday } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay);

  // Total users
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Users by plan
  const { data: planCounts } = await supabase
    .from("users")
    .select("plan");

  const planBreakdown: Record<string, number> = {};
  (planCounts || []).forEach((u) => {
    planBreakdown[u.plan] = (planBreakdown[u.plan] || 0) + 1;
  });

  // MRR calculation
  const MRR_PRICES: Record<string, number> = {
    solo: 29, team: 99, brokerage: 299,
  };
  const mrr = Object.entries(planBreakdown).reduce(
    (sum, [plan, count]) => sum + (MRR_PRICES[plan] || 0) * count, 0
  );

  // Lifetime sales
  const lifetimeSold = planBreakdown["lifetime"] || 0;

  // Last 10 lifetime buyers
  const { data: lifetimeBuyers } = await supabase
    .from("users")
    .select("email, created_at")
    .eq("plan", "lifetime")
    .order("created_at", { ascending: false })
    .limit(10);

  // Recent generations (last 50)
  const { data: recentGenerations } = await supabase
    .from("generations")
    .select("id, format, fair_housing_score, cost_cents, model_used, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(50);

  // Top users this month by generation count
  const { data: monthGenerations } = await supabase
    .from("generations")
    .select("user_id")
    .gte("created_at", startOfMonth);

  const userGenCounts: Record<string, number> = {};
  (monthGenerations || []).forEach((g) => {
    userGenCounts[g.user_id] = (userGenCounts[g.user_id] || 0) + 1;
  });
  const topUsers = Object.entries(userGenCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Fetch emails for top users
  const topUserIds = topUsers.map(([id]) => id);
  const { data: topUserData } = await supabase
    .from("users")
    .select("id, email, plan")
    .in("id", topUserIds.length > 0 ? topUserIds : ["none"]);

  const topUserMap = new Map((topUserData || []).map((u) => [u.id, u]));

  // Anthropic cost this month
  const { data: monthCosts } = await supabase
    .from("generations")
    .select("cost_cents")
    .gte("created_at", startOfMonth);

  const totalCostCents = (monthCosts || []).reduce((sum, g) => sum + (g.cost_cents || 0), 0);

  // Total generations this month
  const { count: monthGenCount } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth);

  return {
    signupsToday: signupsToday || 0,
    generationsToday: generationsToday || 0,
    totalUsers: totalUsers || 0,
    planBreakdown,
    mrr,
    lifetimeSold,
    lifetimeBuyers: lifetimeBuyers || [],
    recentGenerations: recentGenerations || [],
    topUsers: topUsers.map(([id, count]) => ({
      id,
      email: topUserMap.get(id)?.email || "Unknown",
      plan: topUserMap.get(id)?.plan || "trial",
      count,
    })),
    totalCostCents,
    monthGenCount: monthGenCount || 0,
  };
}

export default async function AdminPage() {
  const data = await getAdminData();
  const marginPercent = data.mrr > 0
    ? Math.round(((data.mrr * 100 - data.totalCostCents) / (data.mrr * 100)) * 100)
    : 0;

  return (
    <div className="font-sans min-h-screen bg-muted">
      <header className="bg-card border-b-4 border-red-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/generate" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-red-800">Admin</h1>
            </Link>
            <Badge className="bg-red-100 text-red-700">Admin Only</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.signupsToday}</div>
              <div className="text-xs text-muted-foreground">Signups today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.generationsToday}</div>
              <div className="text-xs text-muted-foreground">Generations today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">${data.mrr}</div>
              <div className="text-xs text-muted-foreground">MRR</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total users</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* MRR by tier */}
          <Card>
            <CardHeader><h2 className="font-bold">MRR by Tier</h2></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(data.planBreakdown).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{plan}</span>
                    <span className="text-muted-foreground">{count} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lifetime sales */}
          <Card>
            <CardHeader><h2 className="font-bold">Lifetime Sales</h2></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{data.lifetimeSold} / 100</div>
              <div className="w-full bg-muted rounded-full h-3 mb-4">
                <div
                  className="bg-amber-500 h-3 rounded-full"
                  style={{ width: `${Math.min(data.lifetimeSold, 100)}%` }}
                />
              </div>
              {data.lifetimeBuyers.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Last 10 buyers</p>
                  {data.lifetimeBuyers.map((b, i) => (
                    <div key={i} className="flex justify-between text-xs text-muted-foreground">
                      <span>{b.email}</span>
                      <span>{new Date(b.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Anthropic cost vs revenue */}
          <Card>
            <CardHeader><h2 className="font-bold">Cost vs Revenue (This Month)</h2></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Cpu className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-lg font-bold">${(data.totalCostCents / 100).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Anthropic cost</div>
                </div>
                <div>
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-bold">${data.mrr}</div>
                  <div className="text-xs text-muted-foreground">Revenue (MRR)</div>
                </div>
                <div>
                  <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold">{marginPercent}%</div>
                  <div className="text-xs text-muted-foreground">Margin</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{data.monthGenCount} generations this month</p>
            </CardContent>
          </Card>

          {/* Top users */}
          <Card>
            <CardHeader><h2 className="font-bold">Top Users (This Month)</h2></CardHeader>
            <CardContent>
              {data.topUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No generations yet this month.</p>
              ) : (
                <div className="space-y-2">
                  {data.topUsers.map((u, i) => (
                    <div key={u.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/70 w-5">{i + 1}.</span>
                        <span className="truncate max-w-[200px]">{u.email}</span>
                        <Badge variant="secondary" className="text-xs">{u.plan}</Badge>
                      </div>
                      <span className="font-medium">{u.count} gens</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent generations */}
        <Card className="mt-6">
          <CardHeader><h2 className="font-bold">Recent Generations (Last 50)</h2></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Format</th>
                    <th className="pb-2 pr-4">FH Score</th>
                    <th className="pb-2 pr-4">Cost</th>
                    <th className="pb-2">Model</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentGenerations.map((g) => (
                    <tr key={g.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-xs text-muted-foreground">
                        {new Date(g.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant="secondary" className="text-xs">{g.format}</Badge>
                      </td>
                      <td className="py-2 pr-4">
                        {g.fair_housing_score !== null ? (
                          <span className={g.fair_housing_score >= 90 ? "text-green-600" : g.fair_housing_score >= 70 ? "text-yellow-600" : "text-red-600"}>
                            <ShieldCheck className="w-3 h-3 inline mr-1" />{g.fair_housing_score}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/70">—</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-xs">${((g.cost_cents || 0) / 100).toFixed(3)}</td>
                      <td className="py-2 text-xs text-muted-foreground">{g.model_used || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
