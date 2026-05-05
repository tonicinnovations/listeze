// v1.9 — Programmatic SEO: state pages
import { SeoPageTemplate } from "@/components/landing/seo-page-template";
import states from "@/data/states.json";
import cities from "@/data/cities.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 604800;

export async function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = states.find((s) => s.slug === slug);
  if (!state) return {};
  return {
    title: `Real Estate Listing Writer for ${state.name} — ListEze`,
    description: `Generate professional MLS descriptions for ${state.name} properties. Fair Housing compliant, 9 tone presets, 10 output formats.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = states.find((s) => s.slug === slug);
  if (!state) notFound();

  const stateCities = cities
    .filter((c) => c.state === state.abbr)
    .map((c) => ({ label: c.name, href: `/mls-description-generator/${c.slug}` }));

  return (
    <SeoPageTemplate
      title={`Real Estate Listing Writer for ${state.name}`}
      h1={`Real Estate Listing Writer for ${state.name}`}
      intro={`ListEze helps ${state.name} real estate agents write professional MLS listing descriptions in seconds. Auto-fill property specs from any address in ${state.abbr}, choose your tone preset, and generate 3 compliance-scanned variants instantly.`}
      secondParagraph={`From ${state.name}'s urban condos to rural acreage, ListEze adapts to every property type. Every output is scanned for Fair Housing Act violations — the only MLS description tool that includes built-in compliance review.`}
      faqs={[
        { q: `Does ListEze know ${state.name} real estate language?`, a: `Yes. Our AI is trained on thousands of MLS descriptions and adapts output to regional conventions and terminology.` },
        { q: `Can I use ListEze for commercial properties in ${state.name}?`, a: `ListEze is optimized for residential MLS descriptions. Commercial property support is planned for a future release.` },
        { q: `How does the Fair Housing scanner work?`, a: `Every description is scanned against 45+ flagged terms from HUD guidance and NAR Code of Ethics, plus an AI context scan for subtle issues.` },
      ]}
      relatedLinks={stateCities}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ListEze MLS Description Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: `Real estate listing writer for ${state.name}`,
      }}
    />
  );
}
