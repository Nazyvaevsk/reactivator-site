"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

export default function AboutPage() {
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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.90) 18%, rgba(0,0,0,0.56) 48%, rgba(0,0,0,0.14) 78%), linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.34) 50%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-32 md:px-10">
          <div className="max-w-[900px]">
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-orange-500">
              Реактиватор · Омск
            </div>

            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Восстанавливаем кузов
              <br />
              <span className="text-orange-500">по измерениям</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Наша задача — не просто выправить повреждённый металл,
              а вернуть кузов в правильное положение и проверить результат
              по контрольным размерам.
            </p>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div className="max-w-[760px]">
              <div className="h-px w-20 bg-orange-500" />

              <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
                Работаем там, где важна
                <br />
                <span className="text-orange-500">геометрия, а не косметика</span>
              </h2>

              <p className="mt-5 text-base leading-relaxed text-zinc-300 md:text-lg">
                После серьёзного ДТП повреждение может быть не только видимым.
                Меняются диагонали, положение контрольных точек и силовых
                элементов. Поэтому восстановление начинаем с понимания,
                что именно сместилось.
              </p>

              <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">
                В процессе ремонта контролируем положение кузова и повторно
                проверяем его после завершения работ. Для нас результат —
                это не только внешний вид автомобиля, но и правильная
                геометрия конструкции.
              </p>
            </div>

            <div className="space-y-7 border-l border-white/15 pl-7 md:pl-9">
              <div>
                <div className="text-3xl font-bold text-orange-500">
                  10+ лет
                </div>
                <div className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Практического опыта
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
                  Опыт кузовного ремонта и восстановления автомобилей после ДТП.
                </p>
              </div>

              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Собственная разработка
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  Координатная измерительная система
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
                  Разрабатываем собственную систему для цифрового контроля геометрии кузова и положения контрольных точек.
                </p>
              </div>

              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  REACTIVATOR AI
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  Автоматический анализ повреждений
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
                  Создаём анализатор, который помогает связывать повреждённые элементы, геометрию кузова и последовательность восстановления.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-7 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-bold md:text-2xl">
                Есть повреждения после ДТП?
              </div>
              <p className="mt-1 text-sm text-zinc-400 md:text-base">
                Отправьте фотографии — предварительно посмотрим характер повреждений.
              </p>
            </div>

            <button
              type="button"
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)]"
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
          </div>
        </div>
      </section>
    </main>
  );
}