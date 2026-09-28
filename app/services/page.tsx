"use client";

import { useEffect, useState } from "react";

export default function ServicesPage() {
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
  const services = [
    {
      number: "01",
      title: "Восстановление геометрии кузова",
      text: "Устраняем перекосы после серьёзных ДТП, возвращаем контрольные точки к заводским параметрам.",
      image: "/case1.jpg",
    },
    {
      number: "02",
      title: "Кузовной ремонт после ДТП",
      text: "Работаем с повреждениями силовых элементов кузова и подготавливаем автомобиль к дальнейшему ремонту.",
      image: "/case2.jpg",
    },
    {
      number: "03",
      title: "Контроль геометрии и размеров",
      text: "Проверяем контрольные точки и симметрию кузова, чтобы результат ремонта можно было проверить измерениями.",
      image: "/case3.jpg",
    },
    {
      number: "04",
      title: "Локальные кузовные работы",
      text: "Выполняем отдельные кузовные работы в зависимости от характера повреждений и состояния автомобиля.",
      image: "/case4.jpg",
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
<h1 className="max-w-[900px] text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Услуги по
              <br />
              <span className="text-orange-500">восстановлению</span> кузова
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Восстанавливаем геометрию кузова после ДТП, устраняем перекосы
              и контролируем размеры автомобиля на каждом этапе ремонта.
            </p>

            <a
              href="/"
              className="group mt-6 inline-flex items-center gap-4 rounded-2xl bg-white px-6 py-4 font-semibold text-black shadow-[0_0_30px_rgba(255,105,0,0.22)] transition-all duration-200 hover:bg-orange-500 hover:text-white"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white transition-colors duration-200 group-hover:bg-white group-hover:text-orange-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7"
                >
                  <rect x="3" y="6" width="18" height="14" rx="3" />
                  <circle cx="12" cy="13" r="3.5" />
                  <path d="M8 6l1.5-2h5L16 6" />
                </svg>
              </span>

              <span>Отправить фото повреждений</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-orange-500 transition-colors duration-200 group-hover:text-white group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="group relative h-[178px] overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${service.image}')`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/15" />

                <div className="relative flex h-full items-start justify-between px-6 py-5 md:px-7">
                  <div className="max-w-[75%]">
                    <div className="text-3xl font-medium leading-none text-orange-500">
                      {service.number}
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
                      {service.title}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                      {service.text}
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-orange-500 transition-all duration-200 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[22px] border border-orange-500/60 bg-[#170900]">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "url('/case4.jpg')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
            />

            <div className="absolute inset-0 bg-[#170900]/80" />

            <div className="relative flex items-center justify-between gap-8 px-7 py-6 md:px-9">
              <div className="flex items-center gap-6">
                <div className="hidden text-orange-500 md:block">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-12 w-12"
                  >
                    <rect x="3" y="6" width="18" height="14" rx="3" />
                    <circle cx="12" cy="13" r="3.5" />
                    <path d="M8 6l1.5-2h5L16 6" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-2xl font-bold md:text-3xl">
                    Не знаете, с чего начать?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
                    Отправьте фотографии автомобиля. Предварительно оценим
                    повреждения и подскажем, какие работы могут потребоваться.
                  </p>
                </div>
              </div>

              <a
                href="/"
                className="group hidden shrink-0 items-center gap-4 rounded-2xl bg-white px-7 py-4 font-semibold text-black transition-all duration-200 hover:bg-orange-500 hover:text-white md:flex"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-7 w-7"
                  >
                    <rect x="3" y="6" width="18" height="14" rx="3" />
                    <circle cx="12" cy="13" r="3.5" />
                    <path d="M8 6l1.5-2h5L16 6" />
                  </svg>
                </span>

                <span>Отправить фото повреждений</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6 text-orange-500 transition-colors group-hover:text-white group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}









































