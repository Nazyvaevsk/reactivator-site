"use client";

import { useEffect, useState } from "react";

export default function TechnologyPage() {
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

  const steps = [
    {
      number: "01",
      title: "Диагностика",
      text: "Определяем состояние кузова, выявляем перекосы и повреждённые элементы силовой структуры.",
    },
    {
      number: "02",
      title: "Измерение",
      text: "Сравниваем контрольные точки и размеры кузова с заданными параметрами.",
    },
    {
      number: "03",
      title: "Восстановление",
      text: "Выполняем вытяжку и восстановление геометрии с постоянным контролем положения кузова.",
    },
    {
      number: "04",
      title: "Финальный контроль",
      text: "Повторно проверяем контрольные точки и размеры после завершения основных работ.",
    },
  ];

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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,0.45) 32%, transparent 65%), linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 pt-32 md:px-10 md:pt-32">
          <div className="max-w-[900px]">
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Технология восстановления
              <br />
              <span className="text-orange-500">геометрии кузова</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Работаем не «на глаз», а по измерениям. Определяем исходную
              геометрию, фиксируем отклонения и контролируем результат после
              ремонта.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="relative overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950/90 transition-colors duration-200 hover:border-orange-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/15" />

                <div className="relative px-6 py-5 md:px-7">
                  <div className="text-3xl font-medium leading-none text-orange-500">
                    {step.number}
                  </div>

                  <h2 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
                    {step.title}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[22px] border border-orange-500/60 bg-[#170900]">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('/case4.jpg')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-[#170900]/80" />

            <div className="relative px-7 py-6 md:px-9">
              <h2 className="text-2xl font-bold md:text-3xl">
                Главное — результат, который можно измерить
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                Контроль геометрии позволяет понимать, что именно изменилось после
                ремонта, и не оставлять скрытые перекосы без внимания.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
