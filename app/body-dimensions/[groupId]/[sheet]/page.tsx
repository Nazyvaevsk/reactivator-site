import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublicBodyGroup } from "@/lib/bodyDimensionsPublic";
import { bodyGroupPath, bodySeo } from "@/lib/bodyDimensionsSeo";
import BodyDimensionSheet from "./BodyDimensionSheet";

type Props = { params: Promise<{ groupId: string; sheet: string; }> };

async function resolve({ params }: Props) {
  const values = await params;
  const group = getPublicBodyGroup(values.groupId);
  if (!group) notFound();
  const sheetNumber = Number(values.sheet);
  if (!/^\d+$/.test(values.sheet) || !group.sheets.some(sheet => sheet.sheet === sheetNumber)) notFound();
  const canonicalPath = bodyGroupPath(group, sheetNumber);
  if ("/body-dimensions/" + values.groupId + "/" + values.sheet !== canonicalPath) permanentRedirect(canonicalPath);
  return { group, sheetNumber };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { group, sheetNumber } = await resolve(props);
  const seo = bodySeo(group, sheetNumber);
  return {
    title: { absolute: seo.heading + " | Реактиватор" },
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: { title: seo.heading, description: seo.description, url: seo.canonical },
    twitter: { title: seo.heading, description: seo.description },
  };
}

export default async function Page(props: Props) {
  const { group, sheetNumber } = await resolve(props);
  return <BodyDimensionSheet key={group.groupId + ":" + sheetNumber} data={group} sheetNumber={sheetNumber} />;
}
