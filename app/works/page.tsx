"use client";

import { useEffect, useState } from "react";

export default function WorksPage() {
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


  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const works = [
    {
      image: "/works/work-1.jpg",
      title: "Восстановление кузова после серьёзного ДТП",
      text: "Восстановление повреждённой передней части автомобиля и контроль геометрии кузова.",
    },
    {
      image: "/works/work-2.jpg",
      title: "Восстановление задней части кузова",
      text: "Работа с повреждениями задней части автомобиля и восстановление контрольных размеров.",
    },
    {
      image: "/works/work-3.jpg",
      title: "Контроль геометрии",
      text: "Проверка положения кузова и контрольных точек после выполнения ремонтных работ.",
    },
    {
      image: "/works/work-4.jpg",
      title: "Кузовные работы",
      text: "Восстановление отдельных элементов кузова в зависимости от характера повреждений.",
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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,0.45) 32%, transparent 65%), linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 pt-32 md:px-10 md:pt-32">
        <h1 className="max-w-[900px] text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
          Примеры <span className="text-orange-500">работ</span>
        </h1>

        <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
          Реальные примеры восстановления кузова, геометрии и отдельных
          элементов после повреждений.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {works.map((work) => (
            <article
              key={work.title}
              className="overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950/90 transition-colors duration-200 hover:border-orange-500/50"
            >
              <div className="aspect-[16/7] border-b border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                {!failedImages[work.image] && (
                <img
                  src={work.image}
                  onError={() => setFailedImages((previous) => ({ ...previous, [work.image]: true }))}
                  alt={work.title}
                  className="h-full w-full object-cover"
                />
                )}
              </div>

              <div className="px-6 py-5 md:px-7">
                <h2 className="text-xl font-bold leading-tight md:text-2xl">
                  {work.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {work.text}
                </p>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>
    </main>
  );
}
