// v1.7 — Landing page (Phase 8 polish: samples, ChatGPT comparison, fair housing hero, no fake testimonials)
import { Home, Check, ShieldCheck, Sparkles, Package, Camera, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LandingDemo } from "@/components/landing/demo";
import { ContactFormDialog } from "@/components/landing/contact-form-dialog";
import { LifetimeCounter } from "@/components/landing/lifetime-counter";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const SAMPLE_OUTPUTS = [
  {
    title: "$350K Starter Home — Phoenix, AZ",
    tone: "Starter",
    description:
      "Your opportunity to own in one of Phoenix's most convenient corridors. This well-maintained 3-bedroom, 2-bath home offers 1,450 square feet of functional living space with an updated kitchen featuring granite countertops and stainless appliances. The open floor plan connects the living and dining areas, while the private backyard includes a covered patio — perfect for Arizona evenings. Minutes from the Loop 101, Tempe Marketplace, and light rail access. Move-in ready with fresh interior paint and new flooring throughout.",
  },
  {
    title: "$1.2M Family Home — Scottsdale, AZ",
    tone: "Family",
    description:
      "Spacious 5-bedroom residence in Scottsdale's Gainey Ranch community spanning 3,800 square feet on a quarter-acre lot. The split floor plan places the primary suite on one side with a private en-suite and walk-in closet, while four additional bedrooms occupy the opposite wing. The chef's kitchen opens to a great room with floor-to-ceiling windows framing mountain views. A three-car garage, mudroom with built-in cubbies, and dedicated homework nook off the kitchen round out this thoughtfully designed layout. Community amenities include pools, tennis courts, and walking paths.",
  },
  {
    title: "$4.5M Luxury Estate — Paradise Valley, AZ",
    tone: "Luxury",
    description:
      "An architectural statement of refined desert living, this 7,200-square-foot estate occupies a premier acre lot along the Camelback Mountain corridor. Imported Italian marble flows through the grand foyer into a formal living room anchored by a floor-to-ceiling stone fireplace. The primary suite features a private terrace, spa-caliber bath with soaking tub, and custom closet systems by California Closets. A temperature-controlled wine room, home theater with acoustic paneling, and resort-style infinity pool with negative edge complete this extraordinary offering. Guard-gated community with 24-hour security.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      {/* Announcement Banner */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/90">
            <div className="text-center sm:text-left">
              <strong>Launch Lifetime — $97 one-time</strong>{" "}
              <LifetimeCounter />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-extrabold tracking-tight">
                ListEze MLS Generator
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-blue-700">Features</a>
              <a href="#samples" className="hover:text-blue-700">Samples</a>
              <a href="#compare" className="hover:text-blue-700">Compare</a>
              <a href="#pricing" className="hover:text-blue-700">Pricing</a>
              <a href="#faq" className="hover:text-blue-700">FAQ</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="#demo" className="hidden sm:inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                Live Demo
              </a>
              <ThemeToggle />
              <ContactFormDialog />
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 py-16 lg:py-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-950 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-200 dark:ring-green-800 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Every output reviewed for Fair Housing Act compliance
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Write <span className="text-blue-600">MLS listings</span> in 30 seconds.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Enter an address, auto-fill property specs, then generate 3 polished, compliance-scanned MLS descriptions. Plus a full marketing kit — IG, FB, email, flyer, and scripts.
              </p>
              <ul className="mt-6 space-y-2 text-foreground/80">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>Fair housing compliance on every output</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>Smart address lookup auto-fills property specs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>9 tone presets + 3 length options + 10 output formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>English + native Spanish output for TX/FL/AZ/CA markets</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 text-base font-semibold shadow">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="rounded-2xl px-6 py-3 text-base font-semibold">
                    Or get $97 lifetime — limited to first 100
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                3 free generations, no credit card required.
              </p>
            </div>

            {/* Demo Widget */}
            <LandingDemo />
          </div>
        </div>
      </section>

      {/* Built for strip */}
      <section className="py-8 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground/70 mb-4">
            Built for agents at every brokerage. Logos shown for industry context — not endorsements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/70 text-sm font-semibold">
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

      {/* Features */}
      <section id="features" className="py-16 lg:py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div>
              <h2 className="text-3xl font-extrabold">Built for MLS speed and polish</h2>
              <p className="mt-3 text-muted-foreground">
                ListEze focuses on one job: crafting professional, MLS-ready copy fast. No bloated marketing suite — just the words you need, now.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <Card className="rounded-3xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Fair Housing Scanner
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Every output is scanned for Fair Housing Act violations. Flagged terms highlighted with one-click rewrite.
                </p>
              </Card>
              <Card className="rounded-3xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 9 Tone Presets
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Luxury, starter, investor, family, fixer, vacation, land — auto-suggested based on your input.
                </p>
              </Card>
              <Card className="rounded-3xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-purple-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> 10-Format Marketing Kit
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  MLS + Instagram + Facebook + email blast + flyer + door knock + cold call + coming soon — all from one input.
                </p>
              </Card>
              <Card className="rounded-3xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> Photo Feature Extraction
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Upload listing photos and AI extracts features — stainless appliances, hardwood floors, pool — to pre-fill your input.
                </p>
              </Card>
              <Card className="rounded-3xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> English + Spanish
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Generate native Spanish listings — not translated, but written by AI as a Spanish-speaking copywriter. Built for TX, FL, AZ, and CA markets.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Outputs */}
      <section id="samples" className="py-16 lg:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">Real sample outputs</h2>
          <p className="mt-2 text-muted-foreground">
            Three properties, three tones — generated by ListEze.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {SAMPLE_OUTPUTS.map((sample) => (
              <Card key={sample.title} className="rounded-3xl border border-border p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{sample.title}</h3>
                  <Badge variant="secondary" className="text-xs">{sample.tone}</Badge>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                  {sample.description}
                </p>
                <Link href="/login" className="mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm">
                    Generate yours
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 lg:py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="rounded-3xl bg-card border border-border p-6">
              <div className="text-xs font-semibold text-muted-foreground">Step 1</div>
              <h3 className="mt-1 font-semibold">Enter address</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Smart lookup auto-fills beds, baths, sqft. Add features and location highlights.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <div className="text-xs font-semibold text-muted-foreground">Step 2</div>
              <h3 className="mt-1 font-semibold">Pick tone & generate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose from 9 tone presets. AI crafts 3 compliance-scanned variants in seconds.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <div className="text-xs font-semibold text-muted-foreground">Step 3</div>
              <h3 className="mt-1 font-semibold">Copy, export, or expand</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Copy to clipboard, export to .docx, or generate the full 10-format marketing kit.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison — now includes ChatGPT */}
      <section id="compare" className="py-16 lg:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">How we compare</h2>
          <p className="mt-2 text-muted-foreground">
            Purpose-built for MLS — not a generic AI chatbot.
          </p>
          <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">ListEze</th>
                  <th className="px-4 py-3 text-left font-semibold">ChatGPT</th>
                  <th className="px-4 py-3 text-left font-semibold">ListingAI</th>
                  <th className="px-4 py-3 text-left font-semibold">Epique.ai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="px-4 py-3">Fair housing scanner</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Included</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                </tr>
                <tr className="bg-muted/60">
                  <td className="px-4 py-3">Address autofill</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Included</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-muted-foreground">Limited</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">MLS-tuned tone</td>
                  <td className="px-4 py-3 text-green-700 font-medium">9 presets</td>
                  <td className="px-4 py-3 text-muted-foreground">Generic</td>
                  <td className="px-4 py-3 text-muted-foreground">Generic+</td>
                  <td className="px-4 py-3 text-muted-foreground">Marketing</td>
                </tr>
                <tr className="bg-muted/60">
                  <td className="px-4 py-3">Marketing kit (10 formats)</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Included</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-muted-foreground">Some</td>
                  <td className="px-4 py-3 text-muted-foreground">Some</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">No prompt engineering needed</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Just fill in specs</td>
                  <td className="px-4 py-3 text-red-500">Requires prompts</td>
                  <td className="px-4 py-3 text-green-700">Guided</td>
                  <td className="px-4 py-3 text-green-700">Guided</td>
                </tr>
                <tr className="bg-muted/60">
                  <td className="px-4 py-3">Compliance review on output</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Auto on every output</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Native Spanish output</td>
                  <td className="px-4 py-3 text-green-700 font-medium">EN + ES</td>
                  <td className="px-4 py-3 text-muted-foreground">Manual prompting</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                </tr>
                <tr className="bg-muted/40">
                  <td className="px-4 py-3">Pricing</td>
                  <td className="px-4 py-3 font-medium text-green-700">Free trial / from $29/mo</td>
                  <td className="px-4 py-3">$20/mo</td>
                  <td className="px-4 py-3">Subscription</td>
                  <td className="px-4 py-3">Subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            All trademarks belong to their respective owners. ListEze is not affiliated with any listed companies.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Simple pricing</h2>
          <p className="mt-2 text-muted-foreground">Start free. Upgrade when you need more.</p>
          <div className="mt-8">
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-3 text-base font-semibold shadow">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo section */}
      <section id="demo" className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">See it in action</h2>
          <p className="mt-2 text-muted-foreground">
            Try the interactive demo in the hero above, or watch a walkthrough.
          </p>
          {/* TODO(real-data): replace with Todd's Loom recording */}
          <div className="mt-4 aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Home className="w-12 h-12 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Demo video coming soon</p>
              <p className="text-sm text-muted-foreground mt-1">Try the live demo above</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — hidden until real ones available */}
      {/* TODO(real-data): replace with named agent testimonials with full names, brokerages, and headshots */}

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">Frequently asked questions</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <Card className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Is the copy MLS-compliant?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every output is scanned for Fair Housing Act violations with flagged terms highlighted and one-click fixable. Always review for your local board&apos;s rules before posting.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Do you store my property data?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your listings are stored in your account so you can access history and regenerate. We never share your data with third parties.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Refund policy?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                30-day money-back guarantee if it doesn&apos;t save you time. Contact support@listeze.com.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">What formats are included?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                MLS descriptions (3 variants), Instagram captions, Facebook posts, email blasts, flyer copy, door knock scripts, cold call scripts, and coming soon teasers.
              </p>
            </Card>
            <Card className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Can I generate listings in Spanish?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yes. Toggle to Espa&ntilde;ol on the generator page and get native Spanish descriptions — written by AI as a Spanish-speaking real estate copywriter, not machine-translated. Fair housing terms are scanned in Spanish too.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Ready to write listings in 30 seconds?</h2>
          <p className="mt-2 text-white/90">3 free generations, no credit card required.</p>
          <Link href="/login">
            <Button className="mt-6 bg-white hover:bg-slate-100 text-blue-700 rounded-2xl px-6 py-3 text-base font-semibold shadow">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">ListEze MLS Generator</span>
            </div>
            <nav className="text-sm text-muted-foreground flex items-center gap-4">
              <Link href="/pricing" className="hover:text-blue-700">Pricing</Link>
              <Link href="/fair-housing-checker" className="hover:text-blue-700">Fair Housing</Link>
              <a href="#faq" className="hover:text-blue-700">FAQ</a>
              <Link href="/privacy" className="hover:text-blue-700">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-700">Terms</Link>
            </nav>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              MLS is a registered trademark. ListEze is not affiliated with or endorsed by MLS systems or Realtor associations.
            </p>
            <p className="text-xs text-muted-foreground">
              support@listeze.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
