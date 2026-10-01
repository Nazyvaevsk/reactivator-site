"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

export default function TechnologyPage() {
  const openForm = useApplicationForm();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const faqs = [
    {
      question: "Почему после ДТП машину тянет в сторону?",
      answer:
        "Причина не всегда в сход-развале. После удара могут сместиться элементы подвески, подрамник или точки их крепления к кузову. Если регулировкой проблема не устраняется, нужно проверять геометрию кузова и сравнивать положение контрольных точек.",
    },
    {
      question: "Почему после ДТП не выставляется развал?",
      answer:
        "Если регулировок уже не хватает, значит колесо физически стоит не там, где должно. Причиной может быть погнутый рычаг, стойка, поворотный кулак, смещённый подрамник или деформация кузова в местах крепления подвески. Пока не найдена причина отклонения, один сход-развал проблему не решит.",
    },
    {
      question: "Что значит, если колесо после удара ушло назад или вперёд?",
      answer:
        "Это один из признаков изменения геометрии подвески или кузова. Может измениться положение рычагов, подрамника или точек их крепления, из-за чего колесо смещается относительно арки и второго колеса. Здесь важно не просто «выставить колесо», а определить, что именно после удара изменило своё положение.",
    },
    {
      question: "Почему после ДТП двери стали плохо закрываться и изменились зазоры?",
      answer:
        "Иногда причина только в самой двери, петлях или навесных деталях. Но после серьёзного удара может изменить форму дверной проём, стойка, порог или соседние силовые элементы кузова. Поэтому неровный зазор — это не всегда косметика: сначала нужно понять, куда ушла конструкция.",
    },
    {
      question: "Всегда ли после сильного ДТП нужен стапель?",
      answer:
        "Нет. Стапель нужен не из-за самого факта ДТП, а когда силовые элементы или контрольные точки кузова смещены и их необходимо вернуть в правильное положение управляемой вытяжкой. Если геометрия не нарушена, ставить автомобиль на стапель ради самого стапеля нет смысла.",
    },
    {
      question: "Можно ли восстановить геометрию кузова после сильного удара?",
      answer:
        "Во многих случаях — да. Но сначала нужно оценить, какие элементы деформированы, где находятся отклонения и что разумнее восстановить, а что заменить. Смысл ремонта не в том, чтобы любой ценой вытянуть старый металл, а в том, чтобы вернуть силовую структуру и контрольные размеры в правильное положение.",
    },
    {
      question: "Как вообще проверяется геометрия кузова?",
      answer:
        "Проверяются контрольные точки, диагонали, расстояния и взаимное положение элементов кузова. Фактические размеры сравниваются между собой и с контрольными значениями, после чего становится понятно, где находится смещение. После вытяжки измерения выполняются повторно — результат должен подтверждаться не только ровными зазорами, но и размерами.",
    },
    {
      question: "Если после ремонта машина едет нормально, зачем ещё что-то измерять?",
      answer:
        "Потому что автомобиль может ехать относительно нормально даже при небольшом остаточном смещении кузова. Оно способно проявиться позже: проблемами со сход-развалом, неравномерным износом шин, разными зазорами или положением колёс. Поэтому финальный контроль нужен, чтобы убедиться, что ремонт закончился не тогда, когда «стало похоже», а когда геометрия действительно восстановлена.",
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

                    <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
            {symptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center gap-2 text-sm font-medium text-zinc-300"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {symptom}
              </div>
            ))}
          </div>

          <div className="relative mt-10">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[27px] top-0 hidden w-px bg-gradient-to-b from-orange-500 via-orange-500/40 to-white/10 md:block"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block"
            >
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.05) 12%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.72) 58%, rgba(0,0,0,1) 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.05) 12%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.72) 58%, rgba(0,0,0,1) 100%)",
                }}
              >
                <img
                  src="/technology-blueprint-overlay.png"
                  alt=""
                  className="absolute inset-y-0 right-0 h-full w-full object-contain object-right opacity-95"
                />
              </div>
            </div>

            <div className="space-y-0">
              {steps.map((step, index) => (
                <section
                  key={step.number}
                  className="relative grid gap-4 border-b border-white/10 py-5 md:grid-cols-[72px_minmax(0,1fr)] md:items-center md:gap-7"
                >
                  <div className="relative z-10 flex items-center gap-3 md:block">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/50 bg-black text-sm font-bold tracking-[0.14em] text-orange-500 shadow-[0_0_20px_rgba(255,106,0,0.10)]">
                      {step.number}
                    </div>
                  </div>

                  <div className="max-w-[620px]"><h2 className="text-2xl font-bold leading-tight tracking-[-0.025em] md:text-[30px]">
                      {step.title}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:text-base">
                      {step.text}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-5 border-y border-white/10 py-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[820px]">
              <h2 className="text-xl font-bold tracking-[-0.02em] md:text-2xl">
                Перекос кузова нужно найти и устранить
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
                Важно не просто вытянуть металл, а понять причину отклонения,
                вернуть кузов к правильным размерам и подтвердить результат измерениями.
              </p>
            </div>

            <button
              type="button"
              onClick={openForm}
              className="shrink-0 rounded-2xl bg-orange-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,106,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-orange-400 sm:text-base"
            >
              Отправить фото повреждений
            </button>
          </div>

          <section className="mt-10 md:mt-14">
            <div className="max-w-[900px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                Вопросы и ответы
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.025em] sm:text-3xl md:text-[40px]">
                Частые вопросы после ДТП
              </h2>

              <p className="mt-4 max-w-[720px] text-sm leading-relaxed text-zinc-400 md:text-base">
                О симптомах, скрытых перекосах и восстановлении геометрии после удара.
              </p>
            </div>

            <div className="mt-7 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <article
                    key={faq.question}
                    className={`overflow-hidden rounded-[20px] border transition-colors duration-200 ${
                      isOpen
                        ? "border-orange-500/40 bg-[#100d0b]/95"
                        : "border-white/10 bg-zinc-950/80 hover:border-white/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-base font-semibold leading-snug text-white sm:text-lg">
                        {faq.question}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xl leading-none transition-all duration-200 ${
                          isOpen
                            ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                            : "border-white/10 bg-white/[0.03] text-zinc-400"
                        }`}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      id={`faq-answer-${index}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 pr-16 text-sm leading-relaxed text-zinc-300 sm:px-6 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
