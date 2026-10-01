"use client";

import { useEffect, useState } from "react";
import { useApplicationForm } from "../ApplicationFormProvider";

export default function WorksPage() {
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
        className="relative mx-auto overflow-hidden bg-black max-lg:max-w-full"
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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.88) 15%, rgba(0,0,0,0.5) 38%, transparent 70%), linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 42%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-13 md:pt-25.5 max-md:px-4 max-md:pt-26 max-md:pb-10">
          <div className="max-w-[900px]">
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-[54px] max-md:text-[clamp(1.875rem,8vw,2.5rem)] max-md:leading-[1.08]">
              Примеры <span className="text-orange-500">работ</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-[17px] md:mt-5">
              Реальные автомобили и реальные повреждения. Показываем состояние
              кузова до ремонта, процесс восстановления геометрии и результат.
            </p>
          </div>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80 md:mt-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden max-md:min-h-0 max-md:aspect-[4/3] lg:min-h-[520px]">
                <img
                  src="/works/sienta-2016-before.png"
                  alt="Toyota Sienta 2016 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] md:px-3 md:py-1.5">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-8 max-md:p-5">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Toyota Sienta · 2016
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[30px] md:mt-3 max-md:text-[26px] max-md:leading-tight">
                  Восстановление левой задней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300 md:mt-4">
                  После вылета с трассы автомобиль повис левой задней частью
                  кузова на крупном пне. Сильная деформация затронула боковину,
                  колёсную арку и внутреннюю часть кузова.
                </p>

                <div className="mt-7 grid gap-3 md:mt-5.5 md:gap-2.5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Деформирована левая задняя боковая часть кузова и силовая
                      структура повреждённой зоны.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Вернуть геометрию кузова, восстановить положение проёмов
                      и подготовить автомобиль к дальнейшей сборке.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-8 max-md:p-5">
              <div className="grid gap-5 lg:grid-cols-3 md:gap-4">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/sienta-2016-process.png"
                      alt="Toyota Sienta 2016 Замена повреждённой части кузова"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      Контрактная четверть
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Замена повреждённой части кузова
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    После восстановления геометрии использовали контрактную четверть кузова для замены сильно повреждённой левой задней части.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/sienta-2016-process1.png"
                      alt="Toyota Sienta 2016 на стапеле"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      На стапеле
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Восстановление геометрии
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Автомобиль разобрали до силовой структуры повреждённой зоны
                    и последовательно восстановили геометрию кузова на стапеле.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/sienta-2016-after.png"
                      alt="Toyota Sienta 2016 после восстановления кузова"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white md:px-3 md:py-1.5">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Результат
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Восстановлены форма задней части кузова, проёмы и положение
                    наружных элементов.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80 md:mt-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden max-md:min-h-0 max-md:aspect-[4/3] lg:min-h-[520px]">
                <img
                  src="/works/mercedes-w211-2003-before.png"
                  alt="Mercedes-Benz E320 W211 2003 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] md:px-3 md:py-1.5">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-8 max-md:p-5">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Mercedes-Benz E320 W211 · 2003
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[30px] md:mt-3 max-md:text-[26px] max-md:leading-tight">
                  Восстановление задней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300 md:mt-4">
                  После вылета с трассы автомобиль задней частью ударился в дерево.
                  Удар сильно деформировал заднюю часть кузова и затронул внутренние
                  силовые элементы.
                </p>

                <div className="mt-7 grid gap-3 md:mt-5.5 md:gap-2.5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Сильная деформация задней части кузова с повреждением наружных
                      и внутренних элементов.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Восстановить геометрию кузова и заменить сильно деформированные
                      элементы задней части.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-8 max-md:p-5">
              <div className="grid gap-5 lg:grid-cols-3 md:gap-4">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/mercedes-w211-2003-process.png"
                      alt="Mercedes-Benz E320 W211 2003 в процессе ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      В процессе
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Разборка задней части
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Повреждённую заднюю часть кузова разобрали до внутренних
                    силовых элементов для восстановления геометрии и замены
                    деформированных деталей.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/mercedes-w211-2003-after-1.png"
                      alt="Mercedes-Benz E320 W211 2003 после ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white md:px-3 md:py-1.5">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Восстановленный кузов
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Восстановлены форма задней части кузова, проёмы и положение
                    наружных элементов.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/mercedes-w211-2003-after-2.png"
                      alt="Mercedes-Benz E320 W211 2003 результат ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white md:px-3 md:py-1.5">
                      Результат
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Готовый автомобиль
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Задняя часть кузова восстановлена и автомобиль полностью
                    собран после кузовного ремонта.
                  </p>
                </div>
              </div>
            </div>          </article>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80 md:mt-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden max-md:min-h-0 max-md:aspect-[4/3] lg:min-h-[520px]">
                <img
                  src="/works/santafe-2009-before.png"
                  alt="Hyundai Santa Fe 2009 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] md:px-3 md:py-1.5">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-8 max-md:p-5">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Hyundai Santa Fe CM · 2009
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[30px] md:mt-3 max-md:text-[26px] max-md:leading-tight">
                  Восстановление передней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300 md:mt-4">
                  После фронтального ДТП со встречным автомобилем была серьёзно
                  повреждена передняя часть кузова. Удар затронул силовые элементы
                  передка и нарушил геометрию кузова.
                </p>

                <div className="mt-7 grid gap-3 md:mt-5.5 md:gap-2.5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Сильная деформация передней части кузова с повреждением
                      силовых элементов и навесных деталей.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300 md:mt-1.5">
                      Восстановить геометрию передней части, положение силовых
                      элементов и подготовить автомобиль к полной сборке.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-8 max-md:p-5">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-process-1.png"
                      alt="Hyundai Santa Fe 2009 разборка передней части"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      Разборка
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Доступ к силовой части
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Переднюю часть разобрали, чтобы получить доступ к повреждённым
                    силовым элементам и оценить объём восстановления.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-process-2.png"
                      alt="Hyundai Santa Fe 2009 восстановление силовых элементов"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      Восстановление
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Работа с передней частью
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Восстановили положение повреждённых элементов передка и
                    геометрию кузова.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-process-3.png"
                      alt="Hyundai Santa Fe 2009 подготовка к сборке"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold md:px-3 md:py-1.5">
                      Подготовка к сборке
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Контроль геометрии
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    После основных кузовных работ проверили положение передней
                    части и подготовили автомобиль к дальнейшей сборке.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-after-1.png"
                      alt="Hyundai Santa Fe 2009 после ремонта"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white md:px-3 md:py-1.5">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Восстановленный автомобиль
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Передняя часть собрана, восстановлено положение наружных
                    элементов и кузовные зазоры.
                  </p>
                </div>

                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-after-2.png"
                      alt="Hyundai Santa Fe 2009 итог ремонта"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white md:px-3 md:py-1.5">
                      Результат
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold md:mt-3 md:text-[17px] md:leading-[24px]">
                    Готовый кузов
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:mt-1.5 max-md:text-base">
                    Восстановлены геометрия передней части и внешний вид автомобиля.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <section className="mt-12 md:mt-9.5">
            <div className="mb-6 md:mb-5">
              <h2 className="text-3xl font-bold md:text-[30px] md:leading-[34px] max-md:text-[26px] max-md:leading-tight">
                Ещё <span className="text-orange-500">работы</span>
              </h2>

              <p className="mt-3 max-w-[760px] text-sm leading-relaxed text-zinc-400 md:text-base md:mt-2.5 max-md:text-base">
                Короткие примеры восстановления автомобилей с фотографиями до и после ремонта.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 md:gap-5">
              <article className="overflow-hidden rounded-[24px] border border-white/15 bg-black/80">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden border-r border-white/10">
                    <img
                      src="/works/honda-orthia-2000-before.png"
                      alt="Honda Orthia 2000 до ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold md:px-2.5">
                      До ремонта
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/works/honda-orthia-2000-after.png"
                      alt="Honda Orthia 2000 после ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white md:px-2.5">
                      После ремонта
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-5 max-md:p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Honda Orthia · 2000
                  </div>

                  <h3 className="mt-3 text-2xl font-bold md:mt-2.5 md:text-[20px] md:leading-[27px]">
                    Восстановление передней части кузова
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:mt-2.5 max-md:text-base">
                    Сильный фронтальный удар на трассе. Смещение стаканов передней
                    подвески и моторного щита. Восстановлена геометрия передней
                    части кузова и положение силовых элементов.
                  </p>
                </div>
              </article>

              <article className="overflow-hidden rounded-[24px] border border-white/15 bg-black/80">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden border-r border-white/10">
                    <img
                      src="/works/lada-granta-2016-before.png"
                      alt="Lada Granta 2016 до ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold md:px-2.5">
                      До ремонта
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/works/lada-granta-2016-after.png"
                      alt="Lada Granta 2016 после ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white md:px-2.5">
                      После ремонта
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-5 max-md:p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Lada Granta · 2016
                  </div>

                  <h3 className="mt-3 text-2xl font-bold md:mt-2.5 md:text-[20px] md:leading-[27px]">
                    Восстановление задней части кузова
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:mt-2.5 max-md:text-base">
                    Сильный удар в заднюю часть кузова. Восстановлена геометрия задней
                    части кузова, положение наружных элементов и кузовные зазоры.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section className="mt-12 overflow-hidden rounded-[28px] border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-zinc-950/95 to-black p-7 md:p-8 md:mt-9.5 max-md:p-5">
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:max-lg:flex-col md:max-lg:items-stretch md:gap-5.5">
              <div className="max-w-[760px]">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Оценка по фотографиям
                </div>

                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-[30px] md:mt-2.5 max-md:text-[26px] max-md:leading-tight">
                  Есть похожие повреждения?
                </h2>

                <p className="mt-4 text-base leading-relaxed text-zinc-300 md:text-[17px] md:mt-3">
                  Отправьте фотографии автомобиля. Предварительно оценим характер
                  повреждений, объём работ и подскажем, с чего начать.
                </p>
              </div>

              <button
                type="button"
                onClick={openForm}
                className="group inline-flex shrink-0 items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.75)] md:gap-3 md:px-5.5 md:py-3 max-md:px-5 max-lg:w-full max-lg:min-h-14 max-lg:gap-2 max-lg:px-3 max-lg:[&>span:first-child]:shrink-0 max-lg:[&>svg]:shrink-0"
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
          </section>
        </div>
      </section>
    </main>
  );
}






