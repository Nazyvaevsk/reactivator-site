import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublicBodyGroup } from "@/lib/bodyDimensionsPublic";
import { bodyGroupPath, bodySeo } from "@/lib/bodyDimensionsSeo";
import BodyDimensionGroup from "./BodyDimensionGroup";

type Props = { params: Promise<{ groupId: string; }> };

async function resolve({ params }: Props) {
  const values = await params;
  const group = getPublicBodyGroup(values.groupId);
  if (!group) notFound();
  const canonicalPath = bodyGroupPath(group);
  if ("/body-dimensions/" + values.groupId !== canonicalPath) permanentRedirect(canonicalPath);
  return { group };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { group } = await resolve(props);
  const seo = bodySeo(group);
  return {
    title: { absolute: seo.heading + " | Реактиватор" },
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: { title: seo.heading, description: seo.description, url: seo.canonical },
    twitter: { title: seo.heading, description: seo.description },
  };
}

export default async function Page(props: Props) {
  const { group } = await resolve(props);
  return <BodyDimensionGroup data={group} />;
}
