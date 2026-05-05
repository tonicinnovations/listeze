// v1.2 — Pricing page with four tiers + lifetime banner
import { Check, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LifetimeCounter } from "@/components/landing/lifetime-counter";
import { CheckoutButton } from "@/components/landing/checkout-button";

const tiers = [
  {
    name: "Free Trial",
    price: "$0",
    period: "",
    description: "Try it out — no card required",
    features: [
      "3 MLS descriptions",
      "2 variations per listing",
      "One-click copy",
    ],
    cta: "Start Free Trial",
    href: "/login",
    priceId: null,
    mode: null,
    highlight: false,
  },
  {
    name: "Solo",
    price: "$29",
    period: "/mo",
    description: "For individual agents",
    features: [
      "Unlimited MLS descriptions",
      "All tone presets",
      "MLS + IG + FB formats",
      "Fair housing scanner",
      "Photo feature extraction (3 photos)",
      "Copy + .docx export",
    ],
    cta: "Subscribe",
    href: null,
    priceId: process.env.STRIPE_PRICE_SOLO_MONTHLY || "",
    mode: "subscription",
    highlight: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    description: "For small teams (5 seats)",
    features: [
      "Everything in Solo",
      "5 team member seats",
      "All 10 output formats",
      "Photo feature extraction (8 photos)",
      "Basic brand customization",
    ],
    cta: "Subscribe",
    href: null,
    priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY || "",
    mode: "subscription",
    highlight: false,
  },
  {
    name: "Brokerage",
    price: "$299",
    period: "/mo",
    description: "For brokerages (25 seats)",
    features: [
      "Everything in Team",
      "25 team member seats",
      "Full brand customization",
      "Branded exports with logo",
      "Priority support",
    ],
    cta: "Subscribe",
    href: null,
    priceId: process.env.STRIPE_PRICE_BROKERAGE_MONTHLY || "",
    mode: "subscription",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-extrabold tracking-tight">
                ListEze MLS Generator
              </span>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Lifetime Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-4 text-sm">
          <span className="font-bold">Launch Lifetime — $97 one-time</span>
          <LifetimeCounter />
          <CheckoutButton
            priceId={process.env.STRIPE_PRICE_LIFETIME_LAUNCH || ""}
            mode="payment"
            className="bg-white text-orange-600 hover:bg-orange-50 rounded-lg px-4 py-1.5 text-sm font-semibold"
          >
            Get Lifetime Access
          </CheckoutButton>
        </div>
      </div>

      {/* Pricing Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`rounded-3xl p-6 flex flex-col ${
                  tier.highlight
                    ? "border-2 border-blue-500 shadow-xl relative"
                    : "border border-slate-200"
                }`}
              >
                {tier.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {tier.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-slate-500">{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.href ? (
                  <Link href={tier.href}>
                    <Button
                      className={`w-full rounded-xl ${
                        tier.highlight
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlight ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                ) : (
                  <CheckoutButton
                    priceId={tier.priceId!}
                    mode={tier.mode!}
                    className={`w-full rounded-xl ${
                      tier.highlight
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : ""
                    }`}
                    variant={tier.highlight ? "default" : "outline"}
                  >
                    {tier.cta}
                  </CheckoutButton>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">ListEze MLS Generator</span>
            </div>
            <nav className="text-sm text-slate-600 flex items-center gap-4">
              <Link href="/privacy" className="hover:text-blue-700">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-700">Terms</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
