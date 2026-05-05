// v1.9 — Programmatic SEO: brokerage tool pages
import { SeoPageTemplate } from "@/components/landing/seo-page-template";
import brokerages from "@/data/brokerages.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 604800;

export async function generateStaticParams() {
  return brokerages.map((b) => ({ brokerage: `${b.slug}-listing-tool` }));
}

export async function generateMetadata({ params }: { params: Promise<{ brokerage: string }> }): Promise<Metadata> {
  const { brokerage: rawSlug } = await params;
  const slug = rawSlug.replace(/-listing-tool$/, "");
  const brokerage = brokerages.find((b) => b.slug === slug);
  if (!brokerage) return {};
  return {
    title: `${brokerage.name} Listing Description Tool — ListEze`,
    description: `MLS description generator for ${brokerage.name} agents. Professional, Fair Housing compliant listing descriptions in seconds.`,
  };
}

export default async function BrokerageToolPage({ params }: { params: Promise<{ brokerage: string }> }) {
  const { brokerage: rawSlug } = await params;
  const slug = rawSlug.replace(/-listing-tool$/, "");
  const brokerage = brokerages.find((b) => b.slug === slug);
  if (!brokerage) notFound();

  const otherBrokerages = brokerages
    .filter((b) => b.slug !== slug)
    .slice(0, 6)
    .map((b) => ({ label: `${b.name} tool`, href: `/tools/${b.slug}-listing-tool` }));

  return (
    <SeoPageTemplate
      title={`${brokerage.name} Listing Description Tool`}
      h1={`MLS Listing Description Tool for ${brokerage.name} Agents`}
      intro={`${brokerage.name} agents: generate professional MLS listing descriptions in seconds with ListEze. Enter the address, auto-fill property specs, and get 3 polished, Fair Housing compliant variants. No prompt engineering required — just fill in the specs and generate.`}
      secondParagraph={`Whether you're a new ${brokerage.name} agent writing your first listing or a top producer looking to save time, ListEze helps you produce MLS-ready copy that sounds like a seasoned copywriter. Plus, every output is automatically scanned for Fair Housing Act compliance.`}
      faqs={[
        { q: `Is ListEze affiliated with ${brokerage.name}?`, a: `No. ListEze is an independent tool that works for agents at any brokerage. ${brokerage.name} is a trademark of its respective owner.` },
        { q: `Can I brand exports with my ${brokerage.name} logo?`, a: `Team and Brokerage plans include brand customization — upload your logo and set your primary color for branded exports.` },
        { q: `Does my broker need to approve ListEze?`, a: `ListEze is a personal productivity tool. Check your brokerage's policies, but most agents use listing tools independently.` },
      ]}
      relatedLinks={otherBrokerages}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ListEze MLS Description Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: `MLS listing description tool for ${brokerage.name} agents`,
      }}
    />
  );
}
