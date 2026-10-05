import type { MetadataRoute } from "next";
import { getPublicBodyGroups } from "@/lib/bodyDimensionsPublic";
import { BODY_SITE_URL, bodyGroupPath } from "@/lib/bodyDimensionsSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BODY_SITE_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/geometriya-kuzova`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services/stapelnye-raboty`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/kontrol-geometrii`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/lokalnye-kuzovnye-raboty`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/technology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: baseUrl + "/body-dimensions" },
    ...getPublicBodyGroups().flatMap(group => [
      { url: baseUrl + bodyGroupPath(group) },
      ...group.sheets.map(sheet => ({ url: baseUrl + bodyGroupPath(group, sheet.sheet) })),
    ]),
  ];
}





