// v1.9 — Programmatic SEO: city pages
import { SeoPageTemplate } from "@/components/landing/seo-page-template";
import cities from "@/data/cities.json";
import states from "@/data/states.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    title: `MLS Description Generator for ${city.name}, ${city.state} — ListEze`,
    description: `Generate professional, Fair Housing compliant MLS listing descriptions for properties in ${city.name}, ${city.state}. 3 free generations, no card required.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const stateData = states.find((s) => s.abbr === city.state);
  const relatedCities = cities
    .filter((c) => c.state === city.state && c.slug !== slug)
    .slice(0, 6)
    .map((c) => ({ label: c.name, href: `/mls-description-generator/${c.slug}` }));

  const stateLink = stateData
    ? [{ label: `All ${stateData.name} listings`, href: `/real-estate-listing-writer/${stateData.slug}` }]
    : [];

  return (
    <SeoPageTemplate
      title={`MLS Description Generator for ${city.name}, ${city.state}`}
      h1={`MLS Description Generator for ${city.name}, ${city.state}`}
      intro={`Writing MLS descriptions for ${city.name} properties? ListEze generates professional, compliance-scanned listing descriptions in seconds. Enter the address, auto-fill property specs, choose from 9 tone presets, and get 3 polished variants — each reviewed for Fair Housing Act compliance.`}
      secondParagraph={`Whether you're listing a starter home near downtown ${city.name} or a luxury estate in the suburbs, ListEze adapts to your property type and market. Our AI is trained on thousands of MLS descriptions and understands the language that sells in ${city.state}.`}
      faqs={[
        { q: `Does ListEze work for ${city.name} MLS boards?`, a: `Yes. ListEze generates professional descriptions compatible with any MLS platform. Always review output for your specific board's character limits and rules.` },
        { q: `Is the output Fair Housing compliant?`, a: `Every description is automatically scanned for Fair Housing Act violations. Flagged terms are highlighted with one-click fix.` },
        { q: `How much does it cost?`, a: `Start with 3 free generations, no card required. Paid plans start at $29/mo for unlimited generations.` },
      ]}
      relatedLinks={[...stateLink, ...relatedCities]}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ListEze MLS Description Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: `MLS listing description generator for ${city.name}, ${city.state}`,
      }}
    />
  );
}
