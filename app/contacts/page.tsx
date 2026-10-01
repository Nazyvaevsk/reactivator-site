"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

export default function ContactsPage() {
  const openForm = useApplicationForm();

  const [pageViewport, setPageViewport] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const baseDpr = window.devicePixelRatio || 1;

    const syncPageViewport = () => {
      const currentDpr = window.devicePixelRatio || baseDpr;
      const zoomRatio = currentDpr / baseDpr;

      setPageViewport({
        width: Math.round(window.innerWidth * zoomRatio),
        height: Math.round(window.innerHeight * zoomRatio),
      });
    };

    syncPageViewport();
    window.addEventListener("resize", syncPageViewport);

    return () => {
      window.removeEventListener("resize", syncPageViewport);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <section
        className="relative mx-auto overflow-hidden bg-black"
        style={{
          width: pageViewport ? `${pageViewport.width}px` : "100vw",
          minHeight: pageViewport
            ? `${Math.round(pageViewport.width * 0.5625)}px`
            : "56.25vw",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center top",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.18) 78%), linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 48%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 pt-32 md:px-10">
          <div className="max-w-[900px]">
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-orange-500">
              Реактиватор · Омск
            </div>

            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Связаться
              <br />
              <span className="text-orange-500">с Реактиватором</span>
            </h1>

            <p className="mt-6 max-w-[720px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Пришлите фотографии повреждений. Посмотрим характер повреждений,
              сориентируем по ситуации и договоримся о дальнейших действиях.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-[0.85fr_1.15fr]">
            <article className="relative overflow-hidden rounded-[22px] border border-white/15 bg-black/90 px-7 py-7">
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Мастерская
              </div>

              <h2 className="mt-3 text-3xl font-bold">
                Омск
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                    Адрес
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    ул. 3-я Молодёжная, 81/2
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                    Телефон
                  </div>
                  <a
                    href="tel:+79994547470"
                    className="mt-1 inline-block text-lg font-semibold text-white transition-colors hover:text-orange-500"
                  >
                    +7 999 454-74-70
                  </a>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(255,106,0,0.9)]" />
                Посещение по предварительной договорённости
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[22px] border border-orange-500/60 bg-gradient-to-br from-[#1a0900]/95 via-black/95 to-black px-7 py-7 md:px-9">
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Быстрый способ начать
              </div>

              <h2 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                Покажите повреждения автомобиля
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
                Отправьте несколько фотографий с разных ракурсов. По ним
                предварительно поймём характер повреждений и скажем, имеет ли
                смысл приезжать на осмотр.
              </p>

              <button
                type="button"
                onClick={openForm}
                className="group mt-6 inline-flex items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="h-6 w-6"
                  >
                    <path d="M4 8h3l1.5-2h7L17 8h3v10H4V8Z" />
                    <circle cx="12" cy="13" r="3.2" />
                  </svg>
                </span>

                <span>Отправить фото повреждений</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-orange-500 transition-colors group-hover:text-white"
                >
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </article>
          </div>

          <div className="mt-3 grid gap-3 rounded-[22px] border border-white/10 bg-black/80 px-7 py-6 md:grid-cols-4 md:px-9">
            {[
              ["01", "Отправляете фото"],
              ["02", "Смотрим повреждения"],
              ["03", "Договариваемся об осмотре"],
              ["04", "Определяем дальнейшие работы"],
            ].map(([number, text]) => (
              <div key={number} className="flex items-start gap-4">
                <span className="text-lg font-medium text-orange-500">{number}</span>
                <span className="text-sm leading-relaxed text-zinc-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}