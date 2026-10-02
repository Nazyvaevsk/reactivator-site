"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApplicationForm } from "../../ApplicationFormProvider";

type Sheet = {
  sheet: number;
  cardId: string;
  sourceType: string;
  sourcePage: number;
};

type GroupData = {
  schemaVersion: number;
  groupId: string;
  make: string;
  model: string;
  year: string;
  variant: string;
  sourceFileCount: number;
  sheetCount: number;
  sheets: Sheet[];
};

export default function BodyDimensionGroupPage() {
  const openForm = useApplicationForm();
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId.toLowerCase();

  const [data, setData] = useState<GroupData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/body-dimensions/groups/${groupId}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((json: GroupData) => setData(json))
      .catch(() => setError("Карта автомобиля не найдена."));
  }, [groupId]);

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
                {data.make} {data.model}{" "}
                <span className="text-orange-500">{data.year}</span>
              </h1>

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
        {error && (
          <div className="rounded-[22px] border border-red-500/30 bg-red-950/20 p-6 text-red-300">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="text-zinc-400">
            Загрузка карты...
          </div>
        )}

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
                  className="group relative block overflow-hidden rounded-[22px] border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-0.5 hover:border-orange-500/60"
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

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Открыть превью
                    </div>

                    <span className="text-xl text-orange-500 transition group-hover:translate-x-1">
                      →
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

