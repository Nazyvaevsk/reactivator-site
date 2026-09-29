"use client";

import Link from "next/link";
import { useApplicationForm } from "../../ApplicationFormProvider";

export default function StapelPage() {
  const openForm = useApplicationForm();

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-32 md:px-10 md:pb-20">
          <div className="max-w-[900px]">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Реактиватор · Омск
            </div>

            <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-[64px]">
              Стапельные
              <br />
              <span className="text-orange-500">работы после ДТП</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Восстанавливаем геометрию кузова после серьёзных повреждений:
              устраняем перекосы, возвращаем силовые элементы в необходимое
              положение и контролируем размеры в процессе ремонта.
            </p>

            <button
              type="button"
              onClick={openForm}
              className="mt-7 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black transition hover:bg-orange-500 hover:text-white"
            >
              Отправить фото повреждений
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-14 md:px-10">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[24px] border border-white/10 bg-zinc-950 p-7">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              01
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Фиксация автомобиля
            </h2>

            <p className="mt-3 leading-relaxed text-zinc-400">
              Автомобиль фиксируется на стапеле, чтобы при вытяжке кузова
              контролировать направление и результат воздействия.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-zinc-950 p-7">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              02
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Восстановление силовой части
            </h2>

            <p className="mt-3 leading-relaxed text-zinc-400">
              Работаем с деформацией лонжеронов, стаканов, проёмов и других
              элементов, влияющих на геометрию кузова.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-zinc-950 p-7">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              03
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Контроль размеров
            </h2>

            <p className="mt-3 leading-relaxed text-zinc-400">
              Положение кузова проверяется в процессе ремонта, чтобы результат
              определялся не только внешним видом автомобиля.
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-7 md:p-9">
            <h2 className="text-3xl font-bold">
              Когда нужны стапельные работы
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-300">
              Стапель применяется при серьёзных ДТП, когда повреждение затрагивает
              геометрию кузова: появляются перекосы, смещаются силовые элементы,
              нарушается положение проёмов или контрольных точек.
            </p>

            <p className="mt-4 leading-relaxed text-zinc-400">
              Последовательность ремонта зависит от направления удара и характера
              деформации. Сначала определяется повреждённая зона, затем кузов
              восстанавливается поэтапно с контролем положения элементов.
            </p>
          </div>

          <div className="rounded-[28px] border border-orange-500/30 bg-orange-500/[0.07] p-7 md:p-9">
            <h2 className="text-3xl font-bold">
              Нужно оценить повреждения?
            </h2>

            <p className="mt-4 leading-relaxed text-zinc-300">
              Отправьте фотографии автомобиля. Предварительно посмотрим характер
              повреждений и подскажем, какие работы могут потребоваться.
            </p>

            <button
              type="button"
              onClick={openForm}
              className="mt-6 w-full rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:bg-orange-400"
            >
              Отправить фото
            </button>

            <Link
              href="/works"
              className="mt-3 block text-center text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              Посмотреть реальные работы →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
