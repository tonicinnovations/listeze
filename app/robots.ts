// v1.0 — Dynamic robots.txt
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/settings/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://listeze.com"}/sitemap.xml`,
  };
}
