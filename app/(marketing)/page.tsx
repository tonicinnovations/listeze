// v2.0 — Landing page redesign: custom hero, animated demo, visual variety
import { Home, Check, ShieldCheck, Sparkles, Package, Camera, Globe, Lock, CreditCard, ArrowRight, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AnimatedDemo } from "@/components/landing/animated-demo";
import { ContactFormDialog } from "@/components/landing/contact-form-dialog";
import { LifetimeCounter } from "@/components/landing/lifetime-counter";
import { UsageCounter } from "@/components/landing/usage-counter";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const SAMPLE_OUTPUTS = [
  {
    title: "$350K Starter Home",
    location: "Phoenix, AZ",
    tone: "Starter",
    description:
      "Your opportunity to own in one of Phoenix's most convenient corridors. This well-maintained 3-bedroom, 2-bath home offers 1,450 square feet of functional living space with an updated kitchen featuring granite countertops and stainless appliances.",
  },
  {
    title: "$1.2M Family Home",
    location: "Scottsdale, AZ",
    tone: "Family",
    description:
      "Spacious 5-bedroom residence in Scottsdale's Gainey Ranch community spanning 3,800 square feet on a quarter-acre lot. The split floor plan places the primary suite on one side with a private en-suite and walk-in closet.",
  },
  {
    title: "$4.5M Luxury Estate",
    location: "Paradise Valley, AZ",
    tone: "Luxury",
    description:
      "An architectural statement of refined desert living, this 7,200-square-foot estate occupies a premier acre lot along the Camelback Mountain corridor. Imported Italian marble flows through the grand foyer into a formal living room.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      {/* Announcement Banner */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-2.5 flex items-center justify-center gap-3 text-sm text-white/90">
            <strong>Launch Lifetime — $97 one-time</strong>
            <LifetimeCounter />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-extrabold tracking-tight">ListEze</span>
            </div>
            <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#samples" className="hover:text-foreground transition-colors">Samples</a>
              <a href="#compare" className="hover:text-foreground transition-colors">Compare</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ContactFormDialog />
              <Link href="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
                  Login / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero — centered layout with animated demo below */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-8">
          {/* Centered text */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-950 px-4 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-200 dark:ring-green-800 mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Every output reviewed for Fair Housing Act compliance
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Write <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MLS listings</span>
              <br />in 30 seconds
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Enter an address. AI auto-fills specs, generates 3 compliance-scanned descriptions, and builds your full marketing kit.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 text-base font-semibold shadow-lg shadow-blue-500/25">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="rounded-xl px-8 py-3 text-base font-semibold">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                256-bit SSL
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Secured by Stripe
              </span>
              <span>No credit card required</span>
            </div>
          </div>

          {/* Animated demo */}
          <div className="mt-16 max-w-2xl mx-auto">
            <AnimatedDemo />
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-8 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <UsageCounter />
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-3">
            Built for agents at every brokerage
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-muted-foreground/50 text-sm font-semibold">
            <span>Coldwell Banker</span>
            <span>Keller Williams</span>
            <span>RE/MAX</span>
            <span>Compass</span>
            <span>eXp Realty</span>
            <span>Berkshire Hathaway HS</span>
            <span>Century 21</span>
            <span>Sotheby&apos;s</span>
          </div>
        </div>
      </section>

      {/* How it works — horizontal timeline */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">Three steps. Thirty seconds.</h2>
            <p className="mt-2 text-muted-foreground">No prompts to write. No templates to fill.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", icon: <MapPin className="w-6 h-6" />, title: "Enter an address", desc: "Smart lookup auto-fills beds, baths, sqft, and lot size from public records." },
              { step: "02", icon: <Sparkles className="w-6 h-6" />, title: "Pick tone & generate", desc: "Choose from 9 presets. AI crafts 3 compliance-scanned variants in seconds." },
              { step: "03", icon: <FileText className="w-6 h-6" />, title: "Copy, export, expand", desc: "One-click copy, .docx export, or generate the full 10-format marketing kit." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Step {item.step}</span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — alternating layout */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold">Everything you need to list faster</h2>
            <p className="mt-2 text-muted-foreground">Purpose-built for real estate — not a generic AI tool.</p>
          </div>

          <div className="space-y-16">
            {/* Feature row 1 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> The killer feature
                </div>
                <h3 className="text-2xl font-bold">Fair Housing Compliance Scanner</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Every output is scanned against 45+ flagged terms from HUD guidance and NAR Code of Ethics. Violations are highlighted inline with one-click AI rewrite. No other listing tool does this.
                </p>
              </div>
              <Card className="p-5 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Fair Housing Score</span>
                    <Badge className="bg-green-600 text-white">100 / 100</Badge>
                  </div>
                  <Separator />
                  <div className="text-muted-foreground">
                    <span className="line-through text-red-400 bg-red-100 dark:bg-red-900/30 rounded px-1">master bedroom</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600 bg-green-100 dark:bg-green-900/30 rounded px-1">primary bedroom</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="line-through text-red-400 bg-red-100 dark:bg-red-900/30 rounded px-1">walking distance</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600 bg-green-100 dark:bg-green-900/30 rounded px-1">0.3 miles to</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Feature row 2 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Card className="p-5 rounded-2xl border border-border order-2 md:order-1">
                <div className="flex flex-wrap gap-2">
                  {["MLS Default", "Luxury", "Starter", "Investor", "Family", "First-Time", "Fixer", "Vacation", "Land"].map((t) => (
                    <Badge key={t} variant="secondary" className={`text-xs ${t === "Luxury" ? "bg-blue-600 text-white" : ""}`}>{t}</Badge>
                  ))}
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;Exquisite craftsmanship meets timeless elegance in this estate...&rdquo;
                </p>
              </Card>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Adaptive tone
                </div>
                <h3 className="text-2xl font-bold">9 Tone Presets</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Luxury, starter, investor, family, fixer — auto-suggested based on property specs. Each preset fundamentally changes the writing style, vocabulary, and emphasis.
                </p>
              </div>
            </div>

            {/* Feature row 3 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/50 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  <Package className="w-3.5 h-3.5" /> One input, ten outputs
                </div>
                <h3 className="text-2xl font-bold">10-Format Marketing Kit</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  MLS descriptions, Instagram captions with hashtags, Facebook posts, email blasts, flyer copy, door knock scripts, cold call scripts, and coming soon teasers — all from one property input.
                </p>
              </div>
              <Card className="p-5 rounded-2xl border border-border">
                <div className="grid grid-cols-2 gap-2">
                  {["MLS Description", "Instagram", "Facebook", "Email Blast", "Flyer Copy", "Door Knock", "Cold Call", "Coming Soon"].map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium">
                      <Check className="w-3 h-3 text-green-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Feature row 4 — smaller features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="p-5 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold">Photo Feature Extraction</h3>
                </div>
                <p className="text-sm text-muted-foreground">Upload listing photos — AI identifies stainless appliances, hardwood floors, pool, and more to pre-fill your input.</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold">English + Spanish</h3>
                </div>
                <p className="text-sm text-muted-foreground">Native Spanish output — not translated, but written by AI as a Spanish-speaking copywriter. Fair housing scanner works in Spanish too.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Outputs — with visual cards */}
      <section id="samples" className="py-20 bg-muted/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">See real output</h2>
            <p className="mt-2 text-muted-foreground">Three properties, three tones — generated by ListEze.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_OUTPUTS.map((sample) => (
              <Card key={sample.title} className="rounded-2xl border border-border overflow-hidden flex flex-col">
                {/* Colored top bar */}
                <div className={`h-1.5 ${sample.tone === "Luxury" ? "bg-gradient-to-r from-amber-400 to-yellow-500" : sample.tone === "Family" ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-blue-400 to-blue-500"}`} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm">{sample.title}</h3>
                    <Badge variant="secondary" className="text-[10px]">{sample.tone}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{sample.location}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed flex-1">{sample.description}</p>
                  <Link href="/login" className="mt-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                      Generate yours <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">Purpose-built for MLS</h2>
            <p className="mt-2 text-muted-foreground">Not a generic AI chatbot with a real estate prompt.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-blue-600">ListEze</th>
                  <th className="px-4 py-3 text-left font-semibold">ChatGPT</th>
                  <th className="px-4 py-3 text-left font-semibold">ListingAI</th>
                  <th className="px-4 py-3 text-left font-semibold">Epique.ai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  ["Fair housing scanner", "Built in", "No", "No", "No"],
                  ["Address autofill", "Built in", "No", "Limited", "No"],
                  ["MLS-tuned tone", "9 presets", "Generic", "Generic+", "Marketing"],
                  ["Marketing kit", "10 formats", "No", "Some", "Some"],
                  ["No prompts needed", "Just fill specs", "Requires prompts", "Guided", "Guided"],
                  ["Compliance review", "Auto on every output", "No", "No", "No"],
                  ["Native Spanish", "EN + ES", "Manual", "No", "No"],
                  ["Pricing", "Free trial / $29/mo", "$20/mo", "Subscription", "Subscription"],
                ].map(([feature, listeze, chatgpt, listingai, epique], i) => (
                  <tr key={feature} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                    <td className="px-4 py-3 font-medium">{feature}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{listeze}</td>
                    <td className="px-4 py-3 text-muted-foreground">{chatgpt}</td>
                    <td className="px-4 py-3 text-muted-foreground">{listingai}</td>
                    <td className="px-4 py-3 text-muted-foreground">{epique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="py-16 bg-muted/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Start free. Upgrade when ready.</h2>
          <p className="mt-2 text-muted-foreground">3 free generations, no credit card required.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-semibold shadow-lg shadow-blue-500/25">
                Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="rounded-xl px-8 font-semibold">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is the copy MLS-compliant?", a: "Every output is scanned for Fair Housing Act violations with flagged terms highlighted and one-click fixable. Always review for your local board's rules." },
              { q: "Do you store my property data?", a: "Your listings are stored in your account so you can access history and regenerate. We never share your data with third parties." },
              { q: "Can I generate listings in Spanish?", a: "Yes. Toggle to Español and get native Spanish descriptions — written by AI as a Spanish-speaking copywriter, not machine-translated. Fair housing terms are scanned in Spanish too." },
              { q: "What formats are included?", a: "MLS descriptions (3 variants), Instagram captions, Facebook posts, email blasts, flyer copy, door knock scripts, cold call scripts, and coming soon teasers." },
              { q: "Refund policy?", a: "30-day money-back guarantee. Contact support@listeze.com." },
            ].map((faq) => (
              <Card key={faq.q} className="rounded-xl border border-border p-5">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to write listings in 30 seconds?</h2>
          <p className="mt-3 text-white/80 text-lg">Join hundreds of agents saving 45+ minutes per listing.</p>
          <Link href="/login">
            <Button size="lg" className="mt-8 bg-white hover:bg-white/90 text-blue-700 rounded-xl px-8 font-semibold shadow-lg">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">ListEze</span>
            </div>
            <nav className="text-sm text-muted-foreground flex items-center gap-4">
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/fair-housing-checker" className="hover:text-foreground transition-colors">Fair Housing</Link>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </nav>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>MLS is a registered trademark. ListEze is not affiliated with MLS systems or Realtor associations.</p>
            <p>support@listeze.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
