// v1.9 — Programmatic SEO: property type pages
import { SeoPageTemplate } from "@/components/landing/seo-page-template";
import propertyTypes from "@/data/property-types.json";
import cities from "@/data/cities.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 604800;

export async function generateStaticParams() {
  return propertyTypes.map((p) => ({ propertyType: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ propertyType: string }> }): Promise<Metadata> {
  const { propertyType: slug } = await params;
  const pt = propertyTypes.find((p) => p.slug === slug);
  if (!pt) return {};
  return {
    title: `${pt.name} Listing Description Generator — ListEze`,
    description: pt.description,
  };
}

export default async function PropertyTypePage({ params }: { params: Promise<{ propertyType: string }> }) {
  const { propertyType: slug } = await params;
  const pt = propertyTypes.find((p) => p.slug === slug);
  if (!pt) notFound();

  const topCities = cities.slice(0, 8).map((c) => ({
    label: `${pt.name} in ${c.name}`,
    href: `/mls-description-generator/${c.slug}`,
  }));

  return (
    <SeoPageTemplate
      title={`${pt.name} Listing Description Generator`}
      h1={`${pt.name} Listing Description Generator`}
      intro={pt.description}
      secondParagraph={`ListEze understands what makes a great ${pt.name.toLowerCase()} listing. Our AI highlights the features that matter most to ${pt.name.toLowerCase()} buyers — from layout and amenities to location and value proposition. Every description is Fair Housing compliant.`}
      faqs={[
        { q: `Can ListEze write ${pt.name.toLowerCase()} descriptions?`, a: `Yes. ListEze has tone presets and prompt engineering specifically tuned for ${pt.name.toLowerCase()} properties. Just select the right tone and our AI handles the rest.` },
        { q: `How many descriptions do I get per listing?`, a: `3 unique variants per generation, each with a headline and hook. Choose the one that fits your brand voice.` },
        { q: `Is the free trial enough to test with a ${pt.name.toLowerCase()}?`, a: `Yes. You get 3 free generations with no credit card required — enough to see the quality on a real listing.` },
      ]}
      relatedLinks={topCities}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ListEze MLS Description Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: `${pt.name} listing description generator`,
      }}
    />
  );
}
