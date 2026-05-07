// v1.15 — Live usage counter: agents + listings generated
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Users, FileText } from "lucide-react";

export function UsageCounter() {
  const [stats, setStats] = useState<{ agents: number; listings: number } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [usersResult, listingsResult] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("generations").select("*", { count: "exact", head: true }),
      ]);

      const agents = usersResult.count ?? 0;
      const listings = listingsResult.count ?? 0;

      // Only show if we have meaningful numbers
      if (agents > 0 || listings > 0) {
        setStats({ agents, listings });
      }
    }
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center justify-center gap-6 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4 text-blue-600" />
        <span><strong className="text-foreground">{stats.agents.toLocaleString()}</strong> agents</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="w-4 h-4 text-green-600" />
        <span><strong className="text-foreground">{stats.listings.toLocaleString()}</strong> listings generated</span>
      </div>
    </div>
  );
}
