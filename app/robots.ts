import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.reactivator55.ru/sitemap.xml",
    host: "https://www.reactivator55.ru",
  };
}

