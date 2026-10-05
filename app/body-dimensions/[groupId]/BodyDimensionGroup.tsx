"use client";

import Link from "next/link";
import { useApplicationForm } from "../../ApplicationFormProvider";

import { bodySeo, type PublicBodyGroup } from "@/lib/bodyDimensionsSeo";

export default function BodyDimensionGroup({ data }: { data: PublicBodyGroup }) {
  const openForm = useApplicationForm();
  const groupId = data.groupId.toLowerCase();
  const seo = bodySeo(data);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-zinc-950 to-black">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-32 md:px-8 max-md:px-4 max-md:pt-28">
          <Link
            href="/body-dimensions"
            className="text-sm font-semibold text-zinc-400 transition hover:text-orange-500"
          >
            ← К базе кузовных размеров
          </Link>

          {data && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                {data.groupId} · контрольные размеры
              </p>

              <h1 className="mt-4 text-5xl font-bold tracking-tight max-md:text-4xl">
                {seo.heading}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-400">{seo.description} Перед выбором комплекта сверьте год и вариант кузова со своим автомобилем.</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/10 px-4 py-2 text-zinc-300">
                  Кузов: <strong className="text-white">{data.variant || "—"}</strong>
                </span>

                <span className="rounded-full border border-white/10 px-4 py-2 text-zinc-300">
                  Листов: <strong className="text-white">{data.sheetCount}</strong>
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-5 rounded-[24px] border border-orange-500/30 bg-orange-500/5 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">
                    Готовый комплект кузовных размеров
                  </p>

                  <div className="mt-1 text-4xl font-black">
                    590 ₽
                  </div>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                    После подтверждения оплаты вы получите временную ссылку
                    на полный комплект с просмотром и скачиванием. Доступ — 24 часа.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openForm({
                      mode: "body-dimensions",
                      groupId: data.groupId,
                      description:
                        `Покупка кузовных размеров\n` +
                        `${data.make} ${data.model} ${data.year}` +
                        `${data.variant ? ` / ${data.variant}` : ""}\n` +
                        `Комплект: ${data.groupId}\n` +
                        `Цена: 590 ₽`,
                    })
                  }
                  className="shrink-0 rounded-2xl bg-orange-500 px-7 py-4 text-base font-bold text-black transition hover:bg-orange-400"
                >
                  Купить комплект
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-10 md:px-8 max-md:px-4">
        {data && (
          <>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                Технические листы
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {data.sheets.map((sheet) => (
                <Link
                  key={sheet.sheet}
                  href={`/body-dimensions/${groupId}/${sheet.sheet}`}
                  className="group relative block cursor-pointer overflow-hidden rounded-[22px] border border-orange-500/25 bg-zinc-950 p-6 transition hover:border-orange-500/70 hover:shadow-[0_0_24px_rgba(249,115,22,0.10)] focus-visible:border-orange-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                        Лист {String(sheet.sheet).padStart(2, "0")}
                      </p>

                      <h2 className="mt-3 text-xl font-bold transition group-hover:text-orange-500">
                        Схема контрольных размеров
                      </h2>

                      <p className="mt-2 text-sm text-zinc-500">
                        {sheet.sourceType} · страница {sheet.sourcePage}
                      </p>
                    </div>

                    <span className="rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-zinc-500">
                      {sheet.cardId}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-5">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 group-hover:text-orange-300 group-focus-visible:text-orange-300">
                      Открыть лист <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

