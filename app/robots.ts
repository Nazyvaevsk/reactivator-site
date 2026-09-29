import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://reactivator55.ru/sitemap.xml",
    host: "https://reactivator55.ru",
  };
}
