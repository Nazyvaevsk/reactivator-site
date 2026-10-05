import type { Metadata } from "next";
﻿import AccessViewer from "./AccessViewer";
import { verifyBodyAccess } from "@/lib/bodyAccess";
import { getBodyDimensionsGroup } from "@/lib/bodyDimensionsData";

export const metadata: Metadata = {
  title: "Временный доступ к комплекту",
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
};

type Props = {
  searchParams: Promise<{
    group?: string;
    exp?: string;
    sig?: string;
  }>;
};

export default async function BodyDimensionsAccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const groupId = params.group ?? "";
  const exp = params.exp ?? "";
  const sig = params.sig ?? "";

  if (!verifyBodyAccess(groupId, exp, sig)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Реактиватор
          </div>

          <h1 className="mt-4 text-3xl font-black">
            Доступ закрыт
          </h1>

          <p className="mt-3 text-zinc-400">
            Ссылка недействительна или срок доступа закончился.
          </p>
        </div>
      </main>
    );
  }

  const group = getBodyDimensionsGroup(groupId);

  if (!group) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">
            Комплект не найден
          </h1>
        </div>
      </main>
    );
  }

  const sheets = group.sheets
    .map((item) => item.assetKey.split(/[\\/]/).pop())
    .filter((item): item is string => Boolean(item));

  return (
    <AccessViewer
      group={group.groupId}
      exp={exp}
      sig={sig}
      sheets={sheets}
      make={group.make}
      model={group.model}
      year={String(group.year)}
      variant={group.variant ?? ""}
    />
  );
}
