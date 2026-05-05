// v1.9 — Dynamic sitemap with programmatic SEO pages
import type { MetadataRoute } from "next";
import cities from "@/data/cities.json";
import states from "@/data/states.json";
import propertyTypes from "@/data/property-types.json";
import brokerages from "@/data/brokerages.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://listeze.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/fair-housing-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${baseUrl}/mls-description-generator/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${baseUrl}/real-estate-listing-writer/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const propertyTypePages: MetadataRoute.Sitemap = propertyTypes.map((p) => ({
    url: `${baseUrl}/listing-description-for/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const brokeragePages: MetadataRoute.Sitemap = brokerages.map((b) => ({
    url: `${baseUrl}/tools/${b.slug}-listing-tool`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...cityPages, ...statePages, ...propertyTypePages, ...brokeragePages];
}
