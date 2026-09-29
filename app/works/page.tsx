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
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.88) 15%, rgba(0,0,0,0.5) 38%, transparent 70%), linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 42%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-16 pt-32 md:px-10">
          <div className="max-w-[900px]">
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Примеры <span className="text-orange-500">работ</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Реальные автомобили и реальные повреждения. Показываем состояние
              кузова до ремонта, процесс восстановления геометрии и результат.
            </p>
          </div>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden lg:min-h-[520px]">
                <img
                  src="/works/sienta-2016-before.png"
                  alt="Toyota Sienta 2016 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Toyota Sienta · 2016
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                  Восстановление левой задней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300">
                  После вылета с трассы автомобиль повис левой задней частью
                  кузова на крупном пне. Сильная деформация затронула боковину,
                  колёсную арку и внутреннюю часть кузова.
                </p>

                <div className="mt-7 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Деформирована левая задняя боковая часть кузова и силовая
                      структура повреждённой зоны.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Вернуть геометрию кузова, восстановить положение проёмов
                      и подготовить автомобиль к дальнейшей сборке.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-10">
              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/sienta-2016-process.png"
                      alt="Toyota Sienta 2016 Замена повреждённой части кузова"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      Контрактная четверть
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Замена повреждённой части кузова
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      На стапеле
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Восстановление геометрии
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Результат
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Восстановлены форма задней части кузова, проёмы и положение
                    наружных элементов.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden lg:min-h-[520px]">
                <img
                  src="/works/mercedes-w211-2003-before.png"
                  alt="Mercedes-Benz E320 W211 2003 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Mercedes-Benz E320 W211 · 2003
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                  Восстановление задней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300">
                  После вылета с трассы автомобиль задней частью ударился в дерево.
                  Удар сильно деформировал заднюю часть кузова и затронул внутренние
                  силовые элементы.
                </p>

                <div className="mt-7 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Сильная деформация задней части кузова с повреждением наружных
                      и внутренних элементов.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Восстановить геометрию кузова и заменить сильно деформированные
                      элементы задней части.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-10">
              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/mercedes-w211-2003-process.png"
                      alt="Mercedes-Benz E320 W211 2003 в процессе ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      В процессе
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Разборка задней части
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Восстановленный кузов
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                      Результат
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Готовый автомобиль
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Задняя часть кузова восстановлена и автомобиль полностью
                    собран после кузовного ремонта.
                  </p>
                </div>
              </div>
            </div>          </article>

          <article className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/80">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[380px] overflow-hidden lg:min-h-[520px]">
                <img
                  src="/works/santafe-2009-before.png"
                  alt="Hyundai Santa Fe 2009 до ремонта"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]">
                  До ремонта
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  Hyundai Santa Fe CM · 2009
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                  Восстановление передней части кузова
                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-300">
                  После фронтального ДТП со встречным автомобилем была серьёзно
                  повреждена передняя часть кузова. Удар затронул силовые элементы
                  передка и нарушил геометрию кузова.
                </p>

                <div className="mt-7 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Повреждение
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Сильная деформация передней части кузова с повреждением
                      силовых элементов и навесных деталей.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                      Задача
                    </div>

                    <p className="mt-2 leading-relaxed text-zinc-300">
                      Восстановить геометрию передней части, положение силовых
                      элементов и подготовить автомобиль к полной сборке.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 md:p-10">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                    <img
                      src="/works/santafe-2009-process-1.png"
                      alt="Hyundai Santa Fe 2009 разборка передней части"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      Разборка
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Доступ к силовой части
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      Восстановление
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Работа с передней частью
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/75 px-4 py-2 text-sm font-bold">
                      Подготовка к сборке
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Контроль геометрии
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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
                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                      После ремонта
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Восстановленный автомобиль
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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
                    <div className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                      Результат
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Готовый кузов
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Восстановлены геометрия передней части и внешний вид автомобиля.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ещё <span className="text-orange-500">работы</span>
              </h2>

              <p className="mt-3 max-w-[760px] text-sm leading-relaxed text-zinc-400 md:text-base">
                Короткие примеры восстановления автомобилей с фотографиями до и после ремонта.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[24px] border border-white/15 bg-black/80">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden border-r border-white/10">
                    <img
                      src="/works/honda-orthia-2000-before.png"
                      alt="Honda Orthia 2000 до ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold">
                      До ремонта
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/works/honda-orthia-2000-after.png"
                      alt="Honda Orthia 2000 после ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white">
                      После ремонта
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Honda Orthia · 2000
                  </div>

                  <h3 className="mt-3 text-2xl font-bold">
                    Восстановление передней части кузова
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
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

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold">
                      До ремонта
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/works/lada-granta-2016-after.png"
                      alt="Lada Granta 2016 после ремонта"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white">
                      После ремонта
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Lada Granta · 2016
                  </div>

                  <h3 className="mt-3 text-2xl font-bold">
                    Восстановление задней части кузова
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    Сильный удар в заднюю часть кузова. Восстановлена геометрия задней
                    части кузова, положение наружных элементов и кузовные зазоры.
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}





