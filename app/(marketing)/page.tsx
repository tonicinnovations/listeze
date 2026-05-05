// v1.2 — Landing page (updated CTAs, removed countdown timer)
import { Home, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { LandingDemo } from "@/components/landing/demo";
import { ContactFormDialog } from "@/components/landing/contact-form-dialog";
import { LifetimeCounter } from "@/components/landing/lifetime-counter";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
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
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-extrabold tracking-tight">
                ListEze MLS Generator
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-blue-700">
                Features
              </a>
              <a href="#how" className="hover:text-blue-700">
                How it works
              </a>
              <a href="#compare" className="hover:text-blue-700">
                Compare
              </a>
              <a href="#pricing" className="hover:text-blue-700">
                Pricing
              </a>
              <a href="#faq" className="hover:text-blue-700">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="#demo"
                className="hidden sm:inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-white"
              >
                Live Demo
              </a>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                AI for Real Estate
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
                Write <span className="text-blue-600">MLS listings</span> in 30
                seconds.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Just enter an address and watch AI auto-fill property specs, then
                generate 2-3 polished, MLS-ready descriptions. Save 45+ minutes
                per listing.
              </p>
              <ul className="mt-6 space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>Smart address lookup auto-fills property specs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>Multiple variations + one-click copy</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>Free trial — 3 generations, no card required</span>
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
              <p className="mt-3 text-xs text-slate-500">
                3 free generations, no credit card required.
              </p>
            </div>

            {/* Demo Widget */}
            <LandingDemo />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Trusted by busy agents and small brokerages
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div>
              <h2 className="text-3xl font-extrabold">
                Built for MLS speed and polish
              </h2>
              <p className="mt-3 text-slate-600">
                ListEze MLS Generator focuses on one job: crafting professional,
                MLS-ready copy fast. No bloated marketing suite — just the words
                you need, now.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-blue-700">
                  MLS-tuned tone
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Outputs read like a seasoned real estate copywriter wrote them
                  — compliant, inviting, and specific.
                </p>
              </Card>
              <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-blue-700">
                  2-3 variations
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Choose the style that fits the property and your brand voice.
                </p>
              </Card>
              <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-blue-700">
                  One-click copy & export
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Copy to clipboard or export to .docx for quick MLS paste.
                </p>
              </Card>
              <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-blue-700">
                  Lifetime license
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Pay once. Use forever. No subscriptions or usage caps.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <div className="text-xs font-semibold text-slate-500">Step 1</div>
              <h3 className="mt-1 font-semibold">Enter details</h3>
              <p className="mt-2 text-sm text-slate-600">
                Beds, baths, square footage, key features, neighborhood
                highlights.
              </p>
            </Card>
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <div className="text-xs font-semibold text-slate-500">Step 2</div>
              <h3 className="mt-1 font-semibold">Generate</h3>
              <p className="mt-2 text-sm text-slate-600">
                AI crafts 2-3 polished variations tuned for MLS tone and
                clarity.
              </p>
            </Card>
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <div className="text-xs font-semibold text-slate-500">Step 3</div>
              <h3 className="mt-1 font-semibold">Copy & paste</h3>
              <p className="mt-2 text-sm text-slate-600">
                Copy to clipboard or export to .docx and paste into your MLS
                workflow.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">How we compare</h2>
          <p className="mt-2 text-slate-600">
            ListEze MLS Generator is laser-focused on MLS descriptions. No
            bloat, no subscription.
          </p>
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    ListEze MLS Generator
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    ListingAI
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Epique.ai
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    HAR.com Tool
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Generic Free Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">Focus</td>
                  <td className="px-4 py-3">MLS descriptions only</td>
                  <td className="px-4 py-3">Full suite</td>
                  <td className="px-4 py-3">Full marketing</td>
                  <td className="px-4 py-3">Member-only</td>
                  <td className="px-4 py-3">Generic text</td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="px-4 py-3">Ease of use</td>
                  <td className="px-4 py-3">Super simple</td>
                  <td className="px-4 py-3">Moderate</td>
                  <td className="px-4 py-3">Complex</td>
                  <td className="px-4 py-3">Easy (restricted)</td>
                  <td className="px-4 py-3">Easy</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Tone / polish</td>
                  <td className="px-4 py-3">MLS-tuned</td>
                  <td className="px-4 py-3">Generic+</td>
                  <td className="px-4 py-3">Marketing tone</td>
                  <td className="px-4 py-3">Professional</td>
                  <td className="px-4 py-3">Generic</td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="px-4 py-3">Pricing</td>
                  <td className="px-4 py-3 font-medium text-green-700">
                    Free trial / from $29/mo
                  </td>
                  <td className="px-4 py-3">Subscription</td>
                  <td className="px-4 py-3">Subscription</td>
                  <td className="px-4 py-3">Included with membership</td>
                  <td className="px-4 py-3">Free (limited)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            All trademarks belong to their respective owners. ListEze MLS
            Generator is not affiliated with MLS systems or Realtor associations.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Simple pricing</h2>
          <p className="mt-2 text-slate-600">
            Start free. Upgrade when you need more.
          </p>
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
      <section id="demo" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold">See it in action</h2>
              <p className="mt-2 text-slate-600">
                Try the interactive demo above to see how ListEze MLS Generator
                creates professional listings instantly.
              </p>
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-slate-600">
                <div className="text-center">
                  <Home className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                  <p>Interactive demo available above</p>
                </div>
              </div>
            </div>
            <Card className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
              <h3 className="font-semibold">What agents are saying</h3>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                {/* TODO(real-data): replace with named agent testimonials */}
                <blockquote className="rounded-2xl bg-white p-4 border border-slate-200">
                  &ldquo;This saved me nearly an hour per listing. Worth it on
                  day one.&rdquo; — Sarah M.
                </blockquote>
                <blockquote className="rounded-2xl bg-white p-4 border border-slate-200">
                  &ldquo;Clean output, MLS-ready, no fluff. Copied and pasted
                  as-is.&rdquo; — John K.
                </blockquote>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">
            Frequently asked questions
          </h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <h3 className="font-semibold">Is the copy MLS-compliant?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Outputs are tuned for professional MLS tone. Always review for
                your local board&apos;s rules before posting.
              </p>
            </Card>
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <h3 className="font-semibold">Do you store my inputs?</h3>
              <p className="mt-2 text-sm text-slate-600">
                No. Only non-sensitive usage logs are collected to improve
                quality. Your property details remain private.
              </p>
            </Card>
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <h3 className="font-semibold">Refund policy?</h3>
              <p className="mt-2 text-sm text-slate-600">
                30-day money-back guarantee if it doesn&apos;t save you time.
              </p>
            </Card>
            <Card className="rounded-3xl bg-white border border-slate-200 p-6">
              <h3 className="font-semibold">Team licenses?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Email us for brokerage pricing at support@listeze.com.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">
            Ready to write listings in 30 seconds?
          </h2>
          <p className="mt-2 text-white/90">
            3 free generations, no credit card required.
          </p>
          <Link href="/login">
            <Button className="mt-6 bg-white hover:bg-slate-100 text-blue-700 rounded-2xl px-6 py-3 text-base font-semibold shadow">
              Start Free Trial
            </Button>
          </Link>
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
              <a href="#pricing" className="hover:text-blue-700">
                Pricing
              </a>
              <a href="#faq" className="hover:text-blue-700">
                FAQ
              </a>
              <Link href="/privacy" className="hover:text-blue-700">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-blue-700">
                Terms
              </Link>
            </nav>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            MLS is a registered trademark of multiple listing services and/or
            their affiliates. ListEze MLS Generator is not affiliated with or
            endorsed by MLS systems or Realtor associations.
          </p>
        </div>
      </footer>
    </div>
  );
}
