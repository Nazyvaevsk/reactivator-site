"use client";

import { useState, useEffect } from "react";
import { useApplicationForm } from "./ApplicationFormProvider";
import PagesHeader from "./PagesHeader";
import NavigationLinks from "./NavigationLinks";

export default function Home() {
  const openForm = useApplicationForm();

  const [heroViewport, setHeroViewport] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const baseDpr = window.devicePixelRatio || 1;

    const syncHeroViewport = () => {
      const currentDpr = window.devicePixelRatio || baseDpr;

      // При browser zoom innerWidth/innerHeight меняются,
      // а devicePixelRatio меняется в противоположную сторону.
      // Их произведение сохраняет реальный размер окна.
      const zoomRatio = currentDpr / baseDpr;

      setHeroViewport({
        width: Math.round(window.innerWidth * zoomRatio),
        height: Math.round(window.innerHeight * zoomRatio),
      });
    };

    syncHeroViewport();

    window.addEventListener("resize", syncHeroViewport);

    return () => {
      window.removeEventListener("resize", syncHeroViewport);
    };
  }, []);

  return (
    <main className="overflow-x-clip bg-black text-white">

      {/* HERO */}

      <section
        className="relative mx-auto overflow-hidden max-lg:max-w-full"
        style={
          heroViewport
            ? {
                width: `${heroViewport.width}px`,
                minHeight: heroViewport.width < 768 ? `${heroViewport.height}px` : `${heroViewport.height}px`,
              }
            : {
                width: "100vw",
                minHeight: "100vh",
              }
        }
      >

        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="md:hidden"><PagesHeader /></div>
        <header className="absolute inset-x-0 top-0 z-20 max-md:hidden">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-5 md:py-4">
            <div aria-hidden="true" className="w-[250px] shrink min-w-0 md:w-[185px] lg:w-[210px]" />

            <nav className="hidden items-center gap-10 md:flex md:gap-3 lg:gap-8">
              <NavigationLinks />
            </nav>

            <button
              type="button"
              onClick={openForm}
              className="rounded-2xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 md:px-5.5 md:py-2.5"
            >
              Записаться
            </button>
          </div>
        </header>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 max-md:hidden">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-6 py-5 sm:px-10 lg:px-16 md:gap-2.5 md:px-10 md:py-4">
            <div className="text-[22px] font-black uppercase leading-none tracking-tight text-white md:text-[18px]">
              <span className="text-orange-500">R</span>ЕАКТИВАТОР
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">
              ОМСК
            </span>
          </div>
        </div>

        <div className="relative z-10 flex min-h-[inherit] items-center">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-16 md:px-10 md:pb-8 md:pt-22.5 max-md:px-4 max-md:pt-28 max-md:pb-10">
<h1 className="max-w-[780px] text-[clamp(2rem,4.7vw,4.25rem)] md:text-[clamp(1.75rem,3.95vw,3.57rem)] font-bold leading-[1.04] tracking-[-0.035em]">
              <span className="block text-white">Восстановление</span>
              <span className="block text-orange-500">геометрии кузова</span>
              <span className="block text-white">после ДТП</span>
            </h1>

            <div className="pointer-events-none mx-auto mt-4 mb-1 w-[72%] md:hidden">
              <img
                src="/hero-car-overlay.png"
                alt=""
                className="h-auto w-full opacity-75 drop-shadow-[0_0_18px_rgba(255,106,0,0.10)]"
              />
            </div>

            <p className="mb-6 mt-5 max-w-[540px] md:max-w-[480px] text-base leading-relaxed text-zinc-200 md:text-[17px] md:mb-5 md:mt-4">
              Сложные ДТП, перекосы кузова и восстановление силовой геометрии с контролем размеров.
            </p>

            <button
              type="button"
              onClick={openForm}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm sm:gap-4 sm:px-7 sm:text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)] max-md:gap-2 max-md:px-3 max-md:min-h-14 max-md:text-base max-md:[&>svg]:shrink-0 sm:w-auto md:gap-3 md:px-5.5 md:py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500 md:h-8 md:w-8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-6 w-6">
                  <path d="M4 8h3l1.5-2h7L17 8h3v10H4V8Z" />
                  <circle cx="12" cy="13" r="3.2" />
                </svg>
              </span>

              <span>Отправить фото повреждений</span>

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-orange-500 transition-colors group-hover:text-white">
                <path d="M5 12h13" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>

            <p className="mt-3 max-w-[380px] text-xs leading-relaxed text-zinc-400 sm:text-sm md:mt-2.5 max-md:text-sm">
              Предварительно посмотрим повреждения по фото
            </p>

          </div>

          <div className="pointer-events-none absolute right-[-5%] top-[51%] w-[60%] -translate-y-1/2 sm:right-[-2%] sm:top-[44%] sm:w-[50%] lg:right-[3%] lg:top-1/2 lg:w-[50%] max-md:hidden">
            <img
              src="/hero-car-overlay.png"
              alt=""
              className="h-auto w-full opacity-75 drop-shadow-[0_0_18px_rgba(255,106,0,0.10)]"
            />
          </div>

        </div>

      </section>

    </main>
  );
}

