// v1.2 — Checkout button (redirects to Stripe)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CheckoutButtonProps {
  priceId: string;
  mode: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
}

export function CheckoutButton({
  priceId,
  mode,
  children,
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (!priceId) {
      toast.error("Pricing not configured yet");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (res.status === 410) {
        toast.error("Lifetime spots are sold out!");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
