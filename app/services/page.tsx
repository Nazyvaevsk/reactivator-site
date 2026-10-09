"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      title: "Восстановление геометрии кузова",
      text: "Устраняем перекосы после ДТП и возвращаем контрольные точки к правильным размерам.",
      when: ["машину тянет", "не выставляется развал", "колесо ушло"],
    },
    {
      number: "02",
      title: "Стапельные работы после ДТП",
      text: "Вытягиваем и восстанавливаем смещённые силовые элементы кузова на стапеле.",
      when: ["сильный удар", "кузов повело", "смещены силовые элементы"],
    },
    {
      number: "03",
      title: "Контроль геометрии и размеров",
      text: "Проверяем контрольные точки, диагонали и положение элементов кузова до и после ремонта.",
      when: ["сомнения после ДТП", "неровные зазоры", "нужен финальный контроль"],
    },
    {
      number: "04",
      title: "Локальные кузовные работы",
      text: "Выполняем отдельные кузовные работы, когда повреждение не требует восстановления всей геометрии.",
      when: ["локальное повреждение", "проём", "отдельный элемент кузова"],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section
        className="relative mx-auto overflow-hidden bg-black max-lg:max-w-full"
        style={{
          width: "100%",
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

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 pt-32 md:px-8 md:pt-25.5 md:pb-6.5 max-md:px-4 max-md:pt-26 max-md:pb-10">
          <div className="max-w-[900px]">
<h1 className="max-w-[900px] text-5xl font-bold leading-[0.95] tracking-tight md:text-[54px] max-md:text-[clamp(1.875rem,8vw,2.5rem)] max-md:leading-[1.08]">
              После ДТП важно понять
              <br />
              <span className="text-orange-500">не только что помято, а что сместилось</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-[17px] md:mt-5">
              Восстанавливаем геометрию и силовую структуру кузова после ДТП.
              Проверяем размеры, устраняем перекосы и возвращаем элементы
              в правильное положение.
            </p>

            <button type="button" onClick={openForm}
              className="group mt-6 inline-flex items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)] md:mt-5 md:gap-3 md:px-5.5 md:py-3 max-md:px-5 max-lg:w-full max-lg:min-h-14 max-lg:gap-2 max-lg:px-3 max-lg:[&>span:first-child]:shrink-0 max-lg:[&>svg]:shrink-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500 md:h-8 md:w-8">
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

          <div className="mt-3 grid gap-3 md:grid-cols-2 md:mt-2.5 md:gap-2.5">
            {services.map((service) => (
              <article
                key={service.number}
                className="relative h-[178px] max-md:h-auto max-md:min-h-0 md:h-auto md:min-h-[150px] overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950"
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

                <div className="relative flex h-full items-start justify-between max-md:pb-18 px-6 py-5 md:px-5.5 md:py-4 max-md:px-5">
                  <div className="max-w-[75%] max-md:max-w-full md:max-w-[calc(100%-2rem)]">
                    <div className="text-3xl font-medium leading-none text-orange-500 md:text-[25px]">
                      {service.number}
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-tight md:text-[20px] md:mt-3">
                      {service.title}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:mt-2.5 max-md:text-base">
                      {service.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3 flex justify-center md:mt-2.5">
            <Link
              href="/works"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-orange-500 bg-orange-500 px-6 py-3 text-center text-base font-bold text-black transition-colors duration-200 hover:border-orange-400 hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 max-md:w-full"
            >
              <span>Посмотреть реальные ремонты</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 shrink-0"
              >
                <path d="M5 12h13" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 md:mt-2.5 md:gap-2.5">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-zinc-950/90 px-6 py-6 md:px-5.5 md:py-5 max-md:px-5 max-md:py-5">
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 text-5xl font-bold text-orange-500/10 md:text-[40px] md:leading-[40px]"
              >
                01
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                Наша специализация
              </p>

              <h2 className="mt-3 max-w-xl text-xl font-bold leading-tight md:text-[20px] md:mt-2.5">
                Геометрия и силовой кузовной ремонт
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base md:mt-2.5 max-md:text-base">
                Геометрию, стапельные работы, вытяжку и восстановление силовых
                элементов выполняем сами и контролируем результат по размерам.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[22px] border border-orange-500/20 bg-[#100d0b]/90 px-6 py-6 md:px-5.5 md:py-5 max-md:px-5 max-md:py-5">
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 text-5xl font-bold text-orange-500/10 md:text-[40px] md:leading-[40px]"
              >
                02
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                Если нужна окраска
              </p>

              <h2 className="mt-3 max-w-xl text-xl font-bold leading-tight md:text-[20px] md:mt-2.5">
                Мы не держим малярку ради галочки
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base md:mt-2.5 max-md:text-base">
                Наша специализация — геометрия и силовой кузовной ремонт.
                Окраску подключаем отдельно у проверенного специалиста
                после осмотра автомобиля.
              </p>
            </div>
          </div>
          <div className="relative mt-3 overflow-hidden rounded-[22px] border border-orange-500/60 bg-[#170900] md:mt-2.5">
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

            <div className="relative flex items-center justify-between gap-8 max-lg:flex-col max-lg:items-stretch px-7 py-6 md:px-7 md:gap-6.5 md:py-5 max-md:px-5 max-md:py-5">
              <div className="flex items-center gap-6 md:gap-5">
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
                  <h2 className="text-2xl font-bold md:text-[25px] md:leading-[30px] max-md:text-[22px]">
                    Не знаете, с чего начать?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base md:mt-1.5 max-md:text-base">
                    Отправьте фотографии автомобиля. Предварительно оценим
                    повреждения и подскажем, какие работы могут потребоваться.
                  </p>
                </div>
              </div>

              <button type="button" onClick={openForm}
                className="group hidden max-md:flex shrink-0 items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)] md:flex md:gap-3 md:px-5.5 md:py-3 max-md:px-5 max-lg:w-full max-lg:min-h-14 max-lg:gap-2 max-lg:px-3 max-lg:[&>span:first-child]:shrink-0 max-lg:[&>svg]:shrink-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500 md:h-8 md:w-8">
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
      <CustomerReviews />
    </main>
  );
}

const customerReviews = [
  {
    name: "Алексей",
    text: "Очень ответственный и грамотный специалист. А самое главное делает всё на высшем уровне",
    reply: "Алексей, благодарю за высокую оценку и добрые слова! Рад был помочь разобраться в ситуации. Для меня важно не просто выполнить ремонт, а прежде всего правильно определить причину проблемы и предложить действительно необходимое решение. Удачи вам на дорогах!",
  },
  {
    name: "Andrej Lavrov",
    text: "Спасибо мастеру за работу. Работа выполнена на высоте, выполнена в обговоренный срок.",
    reply: "Спасибо за высокую оценку и доверие! Рад, что вы остались довольны результатом и сроками. Обращайтесь, если понадобится помощь с автомобилем. Удачи на дорогах!",
  },
  {
    name: "Виктория",
    text: "Без проблем устранили зазор дверей",
    reply: "Спасибо за отзыв и за доверие! 🤝 Рад, что смог помочь. Выставили зазоры дверей, заменили закисшие болты замков, всё сделали аккуратно и как положено. Самое приятное — когда клиент уезжает довольным результатом. Удачи на дорогах и пусть автомобиль радует только исправной работой! 🚙",
  },
];

function CustomerReviews() {
  return (
    <section aria-labelledby="customer-reviews-title" className="mx-auto max-w-[1440px] px-6 pb-10 md:px-8 max-md:px-4">
      <div className="rounded-[22px] border border-orange-500/20 bg-[#101010] p-5 md:p-7">
        <h2 id="customer-reviews-title" className="text-2xl font-bold md:text-3xl">
          Отзывы клиентов
        </h2>

        <div className="mt-5 w-fit rounded-2xl border border-orange-500/40 bg-[#18130f] px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">5,0</span>
            <span role="img" aria-label="5 из 5 звёзд" className="text-xl text-orange-500">★★★★★</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">39 оценок · Авито</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {customerReviews.map((review) => (
            <article key={review.name} className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900 p-5">
              <h3 className="text-lg font-bold">{review.name}</h3>
              <p className="mt-2 text-xl text-orange-500">
                <span role="img" aria-label="5 из 5 звёзд">★★★★★</span>
              </p>
              <blockquote className="mt-4 text-base leading-relaxed text-zinc-100">
                <p>{review.text}</p>
              </blockquote>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-orange-500">Ответ «Реактиватор | Евгений»</p>
                <p className="mt-2 text-base leading-relaxed text-zinc-300">{review.reply}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <a
            href="https://www.avito.ru/brands/i43690834/all/predlozheniya_uslug"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-base font-semibold text-orange-500 transition-colors hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
          >
            Все отзывы на Авито <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
