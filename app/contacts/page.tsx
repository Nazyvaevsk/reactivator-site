"use client";

import { useEffect, useState } from "react";

export default function ContactsPage() {
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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,0.45) 32%, transparent 65%), linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 pt-32 md:px-10 md:pt-32">
        <h1 className="max-w-[900px] text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
          <span className="text-orange-500">Контакты</span>
        </h1>

        <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
          Обсудим повреждения автомобиля, определим необходимый объём работ и
          договоримся о времени ремонта.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <article className="rounded-[22px] border border-white/15 bg-gradient-to-r from-black/95 to-zinc-950/90 px-6 py-5 transition-colors duration-200 hover:border-orange-500/50 md:px-7">
            <div className="text-3xl font-medium leading-none text-orange-500">01</div>

            <h2 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
              Омск
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              Работаем в Омске. Точный адрес и время посещения согласовываем
              заранее.
            </p>
          </article>

          <article className="rounded-[22px] border border-white/15 bg-gradient-to-r from-black/95 to-zinc-950/90 px-6 py-5 transition-colors duration-200 hover:border-orange-500/50 md:px-7">
            <div className="text-3xl font-medium leading-none text-orange-500">02</div>

            <h2 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
              Предварительная оценка
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              Можно отправить фотографии повреждений. По ним предварительно
              оценим ситуацию и подскажем, что потребуется для восстановления.
            </p>
          </article>
        </div>

        <div className="mt-3 rounded-[22px] border border-orange-500/60 bg-gradient-to-r from-[#170900] to-black/90 px-7 py-6 md:px-9">
          <h2 className="text-2xl font-bold md:text-3xl">
            Хотите узнать, что можно сделать с автомобилем?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
            Отправьте фотографии повреждений или свяжитесь с нами, чтобы
            обсудить автомобиль и дальнейшие действия.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)]"
          >
            Отправить фото повреждений
          </a>
        </div>
        </div>
      </section>
    </main>
  );
}
