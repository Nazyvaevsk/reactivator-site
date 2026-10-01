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
      text: "Устраняем перекосы после ДТП и возвращаем контрольные точки к правильным размерам.",
      when: ["машину тянет", "не выставляется развал", "колесо ушло"],
    },
    {
      number: "02",
      href: "/services/stapelnye-raboty",
      title: "Стапельные работы после ДТП",
      text: "Вытягиваем и восстанавливаем смещённые силовые элементы кузова на стапеле.",
      when: ["сильный удар", "кузов повело", "смещены силовые элементы"],
    },
    {
      number: "03",
      href: "/services/kontrol-geometrii",
      title: "Контроль геометрии и размеров",
      text: "Проверяем контрольные точки, диагонали и положение элементов кузова до и после ремонта.",
      when: ["сомнения после ДТП", "неровные зазоры", "нужен финальный контроль"],
    },
    {
      number: "04",
      href: "/services/lokalnye-kuzovnye-raboty",
      title: "Локальные кузовные работы",
      text: "Выполняем отдельные кузовные работы, когда повреждение не требует восстановления всей геометрии.",
      when: ["локальное повреждение", "проём", "отдельный элемент кузова"],
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
              После ДТП важно понять
              <br />
              <span className="text-orange-500">не только что помято, а что сместилось</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Восстанавливаем геометрию и силовую структуру кузова после ДТП.
              Проверяем размеры, устраняем перекосы и возвращаем элементы
              в правильное положение.
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
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 text-white opacity-[0.68]"
                >
                  <svg
                    viewBox="0 0 620 220"
                    fill="none"
                    className="absolute right-[-30px] top-0 h-full w-[78%]"
                  >
                    <g stroke="currentColor" strokeWidth="0.7">
  <path d="M20 20H600M20 45H600M20 70H600M20 95H600M20 120H600M20 145H600M20 170H600M20 195H600" opacity="0.28" />
  <path d="M40 10V210M70 10V210M100 10V210M130 10V210M160 10V210M190 10V210M220 10V210M250 10V210M280 10V210M310 10V210M340 10V210M370 10V210M400 10V210M430 10V210M460 10V210M490 10V210M520 10V210M550 10V210M580 10V210" opacity="0.28" />
                      <path d="M35 35H585M35 70H585M35 105H585M35 140H585M35 175H585" opacity="0.28" />
                      <path d="M75 15V205M130 15V205M185 15V205M240 15V205M295 15V205M350 15V205M405 15V205M460 15V205M515 15V205" opacity="0.28" />

                      {service.number === "01" && (
                        <>
                          <path d="M120 55H480V165H120Z" strokeDasharray="5 6" />
                          <path d="M120 55L480 165M480 55L120 165" />
                          <path d="M165 72L430 72L455 110L430 148H165L140 110Z" />
                          <path d="M95 110H505M300 30V190" strokeDasharray="9 5 2 5" />
                          <circle cx="165" cy="72" r="5" />
                          <circle cx="430" cy="72" r="5" />
                          <circle cx="455" cy="110" r="5" />
                          <circle cx="430" cy="148" r="5" />
                          <circle cx="165" cy="148" r="5" />
                          <circle cx="140" cy="110" r="5" />
                        </>
                      )}

                      {service.number === "02" && (
                        <>
                          <path d="M105 55H500V165H105Z" strokeDasharray="4 7" />
                          <path d="M145 75H460M145 110H460M145 145H460" />
                          <path d="M145 75L460 145M460 75L145 145" strokeDasharray="7 5" />
                          <path d="M95 110H510" strokeDasharray="12 5" />
                          <circle cx="145" cy="75" r="6" />
                          <circle cx="460" cy="75" r="6" />
                          <circle cx="460" cy="145" r="6" />
                          <circle cx="145" cy="145" r="6" />
                        </>
                      )}

                      {service.number === "03" && (
                        <>
                          <path d="M115 55H485V165H115Z" />
                          <path d="M115 55L485 165M485 55L115 165" strokeDasharray="5 6" />
                          <path d="M75 110H525M300 30V190" strokeDasharray="10 5 2 5" />
                          <path d="M115 185H485M115 178V192M485 178V192" />
                          <path d="M115 45V25M485 45V25M115 32H485" />
                          <circle cx="115" cy="55" r="5" />
                          <circle cx="485" cy="55" r="5" />
                          <circle cx="115" cy="165" r="5" />
                          <circle cx="485" cy="165" r="5" />
                        </>
                      )}

                      {service.number === "04" && (
                        <>
                          <path d="M130 55H470V165H130Z" strokeDasharray="5 6" />
                          <path d="M170 75H430V145H170Z" />
                          <path d="M170 75L430 145M430 75L170 145" opacity="0.7" />
                          <path d="M105 110H495" strokeDasharray="9 5 2 5" />
                          <path d="M170 55V35M430 55V35M170 43H430" />
                          <circle cx="170" cy="75" r="5" />
                          <circle cx="430" cy="75" r="5" />
                          <circle cx="430" cy="145" r="5" />
                          <circle cx="170" cy="145" r="5" />
                        </>
                      )}
                    </g>

                    <g stroke="#f97316" strokeWidth="1.2">
                      <circle cx="300" cy="104" r="9" />
                      <path d="M288 104H312M300 92V116" />
                    </g>

                    <g fill="currentColor" fontFamily="monospace" fontSize="10">
                      <text x="120" y="24">
                        {service.number === "01"
                          ? "ΔX / ΔY / ΔZ"
                          : service.number === "02"
                            ? "СИЛОВЫЕ ТОЧКИ"
                            : service.number === "03"
                              ? "L1 / L2 / ДИАГОНАЛИ"
                              : "ЗАЗОР / ПОЛОЖЕНИЕ"}
                      </text>
                      <text x="405" y="196">мм</text>
                    </g>
                  </svg>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />

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

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-zinc-950/90 px-6 py-6 md:px-7">
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 text-5xl font-bold text-orange-500/10"
              >
                01
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                Наша специализация
              </p>

              <h2 className="mt-3 max-w-xl text-xl font-bold leading-tight md:text-2xl">
                Геометрия и силовой кузовной ремонт
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
                Геометрию, стапельные работы, вытяжку и восстановление силовых
                элементов выполняем сами и контролируем результат по размерам.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[22px] border border-orange-500/20 bg-[#100d0b]/90 px-6 py-6 md:px-7">
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 text-5xl font-bold text-orange-500/10"
              >
                02
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                Если нужна окраска
              </p>

              <h2 className="mt-3 max-w-xl text-xl font-bold leading-tight md:text-2xl">
                Мы не держим малярку ради галочки
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
                Наша специализация — геометрия и силовой кузовной ремонт.
                Окраску подключаем отдельно у проверенного специалиста
                после осмотра автомобиля.
              </p>
            </div>
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




































