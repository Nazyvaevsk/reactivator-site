"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Group = {
  id: string;
  slug: string;
  variant: string;
  sheetCount: number;
  data: string;
};

type Year = {
  year: string;
  slug: string;
  groupCount: number;
  groups: Group[];
};

type Model = {
  model: string;
  slug: string;
  yearCount: number;
  groupCount: number;
  years: Year[];
};

type Brand = {
  brand: string;
  slug: string;
  modelCount: number;
  groupCount: number;
  models: Model[];
};

type CatalogIndex = {
  schemaVersion: number;
  title: string;
  brandCount: number;
  groupCount: number;
  sheetCount: number;
  brands: Brand[];
};

export default function BodyDimensionsPage() {
  const [catalog, setCatalog] = useState<CatalogIndex | null>(null);
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [yearName, setYearName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/body-dimensions/body-dimensions-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить каталог");
        }

        return response.json();
      })
      .then((data: CatalogIndex) => {
        setCatalog(data);
      })
      .catch(() => {
        setError("Не удалось загрузить базу кузовных размеров.");
      });
  }, []);

  const selectedBrand = useMemo(
    () => catalog?.brands.find((item) => item.brand === brandName),
    [catalog, brandName],
  );

  const selectedModel = useMemo(
    () => selectedBrand?.models.find((item) => item.model === modelName),
    [selectedBrand, modelName],
  );

  const selectedYear = useMemo(
    () => selectedModel?.years.find((item) => item.year === yearName),
    [selectedModel, yearName],
  );

  function handleBrandChange(value: string) {
    setBrandName(value);
    setModelName("");
    setYearName("");
  }

  function handleModelChange(value: string) {
    setModelName(value);
    setYearName("");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 35%, rgba(249,115,22,0.14), transparent 32%), linear-gradient(to bottom, #111 0%, #050505 70%, #000 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-14 pt-32 md:px-8 md:pb-16 md:pt-32 max-md:px-4 max-md:pb-10 max-md:pt-28">
          <div className="max-w-[900px]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
              Техническая база REACTIVATOR
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-[58px] max-md:text-[clamp(2rem,10vw,2.8rem)] max-md:leading-[1.02]">
              Контрольные размеры
              <br />
              <span className="text-orange-500">кузовов автомобилей</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-400 md:text-[17px]">
              Выберите марку, модель и год выпуска автомобиля.
              База содержит схемы контрольных размеров и геометрии кузова.
            </p>

            {catalog && (
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <strong className="text-white">{catalog.brandCount}</strong>{" "}
                  марок
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <strong className="text-white">{catalog.groupCount}</strong>{" "}
                  автомобилей
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <strong className="text-white">{catalog.sheetCount}</strong>{" "}
                  технических листов
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-10 md:px-8 md:py-12 max-md:px-4">
        {error && (
          <div className="rounded-[22px] border border-red-500/30 bg-red-950/20 p-5 text-red-300">
            {error}
          </div>
        )}

        {!catalog && !error && (
          <div className="rounded-[22px] border border-white/10 bg-zinc-950 p-6 text-zinc-400">
            Загрузка каталога...
          </div>
        )}

        {catalog && (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  01 · Марка
                </span>

                <select
                  value={brandName}
                  onChange={(event) => handleBrandChange(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/15 bg-zinc-950 px-4 text-base font-semibold text-white outline-none transition focus:border-orange-500"
                >
                  <option value="">Выберите марку</option>

                  {catalog.brands.map((brand) => (
                    <option key={brand.brand} value={brand.brand}>
                      {brand.brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  02 · Модель
                </span>

                <select
                  value={modelName}
                  onChange={(event) => handleModelChange(event.target.value)}
                  disabled={!selectedBrand}
                  className="h-14 w-full rounded-2xl border border-white/15 bg-zinc-950 px-4 text-base font-semibold text-white outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <option value="">Выберите модель</option>

                  {selectedBrand?.models.map((model) => (
                    <option key={model.model} value={model.model}>
                      {model.model}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  03 · Год
                </span>

                <select
                  value={yearName}
                  onChange={(event) => setYearName(event.target.value)}
                  disabled={!selectedModel}
                  className="h-14 w-full rounded-2xl border border-white/15 bg-zinc-950 px-4 text-base font-semibold text-white outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <option value="">Выберите год</option>

                  {selectedModel?.years.map((year) => (
                    <option key={year.year} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {!brandName && (
              <div className="mt-8 rounded-[22px] border border-white/10 bg-zinc-950/70 px-6 py-7">
                <p className="text-sm text-zinc-400">
                  Начните с выбора марки автомобиля.
                </p>
              </div>
            )}

            {selectedBrand && !selectedModel && (
              <div className="mt-8 rounded-[22px] border border-white/10 bg-zinc-950/70 px-6 py-7">
                <p className="text-sm text-zinc-400">
                  В базе для{" "}
                  <strong className="text-white">{selectedBrand.brand}</strong>{" "}
                  доступно моделей:{" "}
                  <strong className="text-white">
                    {selectedBrand.modelCount}
                  </strong>
                  .
                </p>
              </div>
            )}

            {selectedModel && !selectedYear && (
              <div className="mt-8 rounded-[22px] border border-white/10 bg-zinc-950/70 px-6 py-7">
                <p className="text-sm text-zinc-400">
                  Для{" "}
                  <strong className="text-white">
                    {selectedBrand?.brand} {selectedModel.model}
                  </strong>{" "}
                  доступно годов выпуска:{" "}
                  <strong className="text-white">
                    {selectedModel.yearCount}
                  </strong>
                  .
                </p>
              </div>
            )}

            {selectedYear && (
              <div className="mt-9">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                      Найденные схемы
                    </p>

                    <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                      {selectedBrand?.brand} {selectedModel?.model}{" "}
                      {selectedYear.year}
                    </h2>
                  </div>

                  <div className="text-sm text-zinc-500">
                    Вариантов: {selectedYear.groupCount}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {selectedYear.groups.map((group) => (
                    <a
                      key={group.id}
                      href={`/body-dimensions/${group.id.toLowerCase()}`}
                      className="group relative block cursor-pointer overflow-hidden rounded-[22px] border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-0.5 hover:border-orange-500/60"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl"
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between gap-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                              {group.id}
                            </p>

                            <h3 className="mt-3 text-xl font-bold">
                              {group.variant || "Схема кузова"}
                            </h3>
                          </div>

                          <div className="shrink-0 rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-zinc-400">
                            {group.sheetCount}{" "}
                            {group.sheetCount === 1 ? "лист" : "листов"}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-zinc-500">
                          <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                          Карта подготовлена
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}



