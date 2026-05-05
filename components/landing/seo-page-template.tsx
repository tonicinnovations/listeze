// v1.9 — Shared SEO page template
import { Home, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface SeoPageProps {
  title: string;
  h1: string;
  intro: string;
  secondParagraph: string;
  faqs: { q: string; a: string }[];
  relatedLinks?: { label: string; href: string }[];
  jsonLd?: Record<string, unknown>;
}

export function SeoPageTemplate({
  title,
  h1,
  intro,
  secondParagraph,
  faqs,
  relatedLinks,
  jsonLd,
}: SeoPageProps) {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-extrabold tracking-tight">ListEze</span>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Fair Housing compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{h1}</h1>
          <p className="mt-4 text-lg text-slate-600">{intro}</p>
          <p className="mt-3 text-slate-600">{secondParagraph}</p>
          <div className="mt-8 flex gap-3">
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="rounded-2xl px-6 py-3 font-semibold">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-5 rounded-2xl">
              <div className="text-sm font-semibold text-green-700 mb-1">Compliance Built In</div>
              <p className="text-sm text-slate-600">Every output scanned for Fair Housing violations.</p>
            </Card>
            <Card className="p-5 rounded-2xl">
              <div className="text-sm font-semibold text-blue-700 mb-1">9 Tone Presets</div>
              <p className="text-sm text-slate-600">Luxury, starter, investor, family, and more.</p>
            </Card>
            <Card className="p-5 rounded-2xl">
              <div className="text-sm font-semibold text-purple-700 mb-1">10 Output Formats</div>
              <p className="text-sm text-slate-600">MLS, Instagram, Facebook, email, flyer, scripts.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* TODO(real-data): market data block — median price, days on market */}

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-5 rounded-2xl">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      {relatedLinks && relatedLinks.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-lg font-bold mb-4">Related pages</h2>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-blue-600 hover:underline bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-700 to-purple-600 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-extrabold">Try ListEze free — 3 generations, no card required</h2>
          <Link href="/login">
            <Button className="mt-4 bg-white hover:bg-slate-100 text-blue-700 rounded-2xl px-6 py-3 font-semibold">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-xs text-slate-500">
          <p>ListEze MLS Generator · support@listeze.com · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link></p>
        </div>
      </footer>
    </div>
  );
}
