"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

// Decorative measurement geometry, not readings from an actual vehicle.
function MeasurementDrawing({ variant }: { variant: number }) {
  const offset = variant === 1 ? 14 : 0;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 360 220"
      fill="none"
      className="pointer-events-none absolute right-0 top-0 h-full w-[75%] text-white opacity-[0.112] sm:w-[65%]"
    >
      <g stroke="currentColor" strokeWidth="0.7">
        {[40, 80, 120, 160, 200, 240, 280, 320].map((x) => (
          <path key={`x${x}`} d={`M${x} 0V220`} opacity="0.45" />
        ))}
        {[30, 70, 110, 150, 190].map((y) => (
          <path key={`y${y}`} d={`M0 ${y}H360`} opacity="0.45" />
        ))}
        <path d="M95 57H285V163H95Z M95 57L285 163 M285 57L95 163" strokeDasharray="4 5" />
        <path d={`M${110 + offset} 70L270 70L285 150L95 150Z`} strokeWidth="1.4" />
        <path d="M140 78L232 78L248 92V130L232 142H140L124 130V92Z M156 78L146 96V124L156 142 M216 78L226 96V124L216 142 M146 96H226 M146 124H226" opacity="0.65" />
        <path d="M70 110H300 M190 48V172" strokeDasharray="8 4 2 4" opacity="0.65" />
        {variant === 1 && <path d="M255 70A24 24 0 0 1 270 94" />}
        <path d="M95 176V197 M285 176V197 M95 187H285 M100 182L90 192 M290 182L280 192 M302 57H325 M302 163H325 M315 57V163 M310 62L320 52 M310 168L320 158" />
        {[[110 + offset, 70], [270, 70], [285, 150], [95, 150]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" />
            <path d={`M${x - 9} ${y}H${x + 9} M${x} ${y - 9}V${y + 9}`} />
          </g>
        ))}
        {variant === 2 && <path d="M45 110H85 M45 110L53 104 M45 110L53 116 M295 110H335 M335 110L327 104 M335 110L327 116" />}
      </g>
      <g stroke="#f97316" strokeWidth="1">
        <path d="M184 110H196 M190 104V116" />
        <path d="M95 187H111 M315 57V73" />
      </g>
      <g fill="currentColor" fontFamily="monospace" fontSize="11">
        <text x="98" y="39">{["ΔX / ΔY / ΔZ", "Развал / кастер", "L1 / L2", "Δ до / Δ после"][variant]}</text>
        <text x="180" y="207">L, мм</text>
        <text x="324" y="115">H</text>
        {variant === 1 && <text x="281" y="90">°</text>}
      </g>
    </svg>
  );
}

export default function TechnologyPage() {
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

  const steps = [
    {
      number: "01",
      title: "Проверяем, куда ушла геометрия",
      text: "Измеряем контрольные точки, размеры кузова и отклонения после удара.",
    },
    {
      number: "02",
      title: "Находим скрытый перекос",
      text: "Смотрим, почему машину тянет, не выставляется развал и уходят зазоры.",
    },
    {
      number: "03",
      title: "Восстанавливаем кузов на стапеле",
      text: "Возвращаем силовые элементы и кузов в правильное положение по размерам.",
    },
    {
      number: "04",
      title: "Подтверждаем результат измерениями",
      text: "После ремонта повторно проверяем геометрию, чтобы не осталось скрытых проблем.",
    },
  ];

  const symptoms = [
    "Развал не выставляется",
    "Двери закрываются с усилием",
    "Колесо ушло назад или вперёд",
    "После удара кузов повело",
    "Резину начало подъедать",
    "Автомобиль перестал ехать прямо",
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
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.5)), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4) 45%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-12 pt-28 sm:px-6 md:px-10 md:pb-16 md:pt-32">
          <div className="max-w-[1100px]">
            <h1 className="text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em]">
              <span className="block">После ДТП машину тянет,</span>
              <span className="block text-orange-500">руль криво и зазоры ушли?</span>
            </h1>

            <p className="mt-6 max-w-[680px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Значит проблема может быть не только в навесных деталях. Возможно,
              нарушена геометрия кузова — и это нужно проверить по измерениям.
            </p>
          </div>

          <ul aria-label="Признаки возможного нарушения геометрии" className="mt-7 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {symptoms.map((symptom) => (
              <li key={symptom} className="flex items-start gap-2.5 rounded-xl border border-orange-500/25 bg-zinc-950/80 px-3 py-3 text-[13px] font-medium leading-snug text-zinc-200 backdrop-blur-sm sm:px-4">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-500" />
                {symptom}
              </li>
            ))}
          </ul>

          <div className="mt-7 grid gap-3 md:grid-cols-2 md:gap-4">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className="relative isolate overflow-hidden rounded-[22px] border border-white/10 bg-zinc-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-colors duration-200 hover:border-orange-500/35"
              >
                <MeasurementDrawing variant={index} />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

                <div className="relative px-5 py-6 sm:px-7 sm:py-7">
                  <div className="flex items-center gap-3 text-sm font-semibold leading-none tracking-[0.16em] text-orange-500 tabular-nums">
                    {step.number}
                    <span aria-hidden="true" className="h-px w-8 bg-orange-500/40" />
                  </div>

                  <h2 className="mt-5 max-w-[460px] text-[22px] font-bold leading-[1.2] tracking-[-0.025em] lg:text-[26px]">
                    {step.title}
                  </h2>

                  <p className="mt-3 max-w-[460px] text-sm leading-relaxed text-zinc-300 md:text-base">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[22px] border border-orange-500/25 bg-[#100d0b]/95">
            <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-8 top-6 hidden w-44 border-x border-white/[0.06] lg:block">
              <div className="absolute inset-x-[-8px] top-1/2 border-t border-white/10" />
              <div className="absolute inset-x-0 top-1/2 -mt-1 flex justify-between text-white/10">
                <span className="h-2 border-l" />
                <span className="h-2 border-l" />
              </div>
            </div>

            <div className="relative px-5 py-6 sm:px-7 md:py-8">
              <h2 className="max-w-[900px] text-xl font-bold leading-tight tracking-[-0.025em] md:text-[28px]">
                Перекос кузова нужно найти и устранить
              </h2>

              <p className="mt-3 max-w-[840px] text-sm leading-relaxed text-zinc-300 md:text-base">
                Нарушенная геометрия влияет на управляемость, износ резины,
                зазоры и положение колёс. Важно не просто вытянуть металл,
                а вернуть кузов к правильным размерам и устранить сам перекос.
              </p>
              <button
                type="button"
                onClick={openForm}
                className="mt-6 w-full rounded-2xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 sm:w-auto sm:text-base"
              >
                Отправить фото повреждений
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
