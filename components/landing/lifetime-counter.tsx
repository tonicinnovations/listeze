// v1.2 — Live lifetime spots remaining counter
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export function LifetimeCounter() {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const supabase = createClient();
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("plan", "lifetime");

      setSpotsLeft(100 - (count ?? 0));
    }
    fetchCount();
  }, []);

  if (spotsLeft === null) return null;

  // Only show counter once 50+ have sold
  const sold = 100 - spotsLeft;
  if (sold < 50 && spotsLeft > 0) return null;

  return (
    <span className="font-semibold">
      {spotsLeft > 0 ? `${spotsLeft} / 100 spots left` : "Sold out!"}
    </span>
  );
}
