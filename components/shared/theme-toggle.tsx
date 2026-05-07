// v2.0 — Theme dropdown (Light / Dark / System)
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Select value={theme} onValueChange={(v) => setTheme(v ?? "system")}>
      <SelectTrigger className="w-[120px] h-8 text-xs gap-1.5">
        {theme === "dark" ? <Moon className="w-3.5 h-3.5" /> : theme === "light" ? <Sun className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <span className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5" /> Light
          </span>
        </SelectItem>
        <SelectItem value="dark">
          <span className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5" /> Dark
          </span>
        </SelectItem>
        <SelectItem value="system">
          <span className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" /> System
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
