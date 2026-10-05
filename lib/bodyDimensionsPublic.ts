import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { PublicBodyGroup } from "./bodyDimensionsSeo";

type Catalog = {
  brands: { models: { years: { groups: { slug: string }[] }[] }[] }[];
};

// Use only the existing public catalog, never the private access index.
const directory = path.join(process.cwd(), "public", "body-dimensions");
let cachedSlugs: Set<string> | undefined;
function getSlugs() {
  if (cachedSlugs) return cachedSlugs;
  const catalog: Catalog = JSON.parse(fs.readFileSync(path.join(directory, "body-dimensions-index.json"), "utf8"));
  return cachedSlugs = new Set(catalog.brands.flatMap(brand => brand.models.flatMap(model =>
    model.years.flatMap(year => year.groups.map(group => group.slug.toLowerCase())))));
}

export const getPublicBodyGroup = cache((id: string): PublicBodyGroup | null => {
  const slug = id.toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(slug) || !getSlugs().has(slug)) return null;
  // Missing or malformed catalog files must fail the build, not silently omit URLs.
  const group: PublicBodyGroup = JSON.parse(fs.readFileSync(path.join(directory, "groups", slug + ".json"), "utf8"));
  if (group.groupId.toLowerCase() !== slug || group.sheetCount !== group.sheets.length ||
      new Set(group.sheets.map(sheet => sheet.sheet)).size !== group.sheets.length ||
      group.sheets.some(sheet => !Number.isSafeInteger(sheet.sheet) || sheet.sheet < 1)) {
    throw new Error("Invalid public body group: " + slug);
  }
  return group;
});

export function getPublicBodyGroups(): PublicBodyGroup[] {
  return Array.from(getSlugs(), slug => getPublicBodyGroup(slug)!);
}
