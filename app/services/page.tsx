"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

export default function ServicesPage() {
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
  const services = [
    {
      number: "01",
      href: "/services/geometriya-kuzova",
      title: "Восстановление геометрии кузова",
      text: "Устраняем перекосы после серьёзных ДТП, возвращаем контрольные точки к заводским параметрам.",
      image: "/case1.jpg",
    },
    {
      number: "02",
      href: "/services/stapelnye-raboty",
      title: "Кузовной ремонт после ДТП",
      text: "Работаем с повреждениями силовых элементов кузова и подготавливаем автомобиль к дальнейшему ремонту.",
      image: "/case2.jpg",
    },
    {
      number: "03",
      href: "/services/kontrol-geometrii",
      title: "Контроль геометрии и размеров",
      text: "Проверяем контрольные точки и симметрию кузова, чтобы результат ремонта можно было проверить измерениями.",
      image: "/case3.jpg",
    },
    {
      number: "04",
      href: "/services/lokalnye-kuzovnye-raboty",
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
              Восстановление
              <br />
              <span className="text-orange-500">геометрии кузова</span> после ДТП
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Восстанавливаем геометрию кузова после серьёзных ДТП в Омске:
              устраняем перекосы, восстанавливаем положение силовых элементов
              и контролируем размеры автомобиля на каждом этапе ремонта.
            </p>

            <button type="button" onClick={openForm}
              className="group mt-6 inline-flex items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500">
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
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                onClick={() => {
                  if (service.href) {
                    window.location.href = service.href;
                  }
                }}
                className={`group relative h-[178px] overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950 ${
                  service.href ? "cursor-pointer" : ""
                }`}
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

              <button type="button" onClick={openForm}
                className="group hidden shrink-0 items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)] md:flex"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}




































