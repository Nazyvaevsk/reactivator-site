import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Access, issue and API responses carry noindex. Keep them crawlable
      // so crawlers can read that directive instead of retaining URL-only entries.
    },
    sitemap: "https://www.reactivator55.ru/sitemap.xml",
    host: "https://www.reactivator55.ru",
  };
}

