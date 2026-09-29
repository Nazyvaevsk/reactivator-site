"use client";

import Link from "next/link";
import ServiceLinks from "../ServiceLinks";
import { useApplicationForm } from "../../ApplicationFormProvider";

export default function GeometryControlPage() {
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
              Контроль
              <br />
              <span className="text-orange-500">геометрии кузова</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Проверяем положение контрольных точек, симметрию и размеры кузова
              после ДТП и в процессе восстановления.
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
              Контрольные точки
            </h2>
            <p className="mt-3 leading-relaxed text-zinc-400">
              Проверяем положение основных точек кузова и выявляем смещения,
              которые могли появиться после удара.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-zinc-950 p-7">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              02
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              Симметрия кузова
            </h2>
            <p className="mt-3 leading-relaxed text-zinc-400">
              Сравниваем положение элементов относительно оси кузова и между
              противоположными контрольными точками.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-zinc-950 p-7">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              03
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              Контроль после ремонта
            </h2>
            <p className="mt-3 leading-relaxed text-zinc-400">
              После основных вытяжек повторно проверяем геометрию, чтобы оценивать
              результат не только по внешнему виду автомобиля.
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-7 md:p-9">
            <h2 className="text-3xl font-bold">
              Зачем проверять геометрию
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-300">
              После серьёзного ДТП кузов может выглядеть относительно ровным,
              но отдельные силовые элементы или контрольные точки могут оставаться
              смещёнными.
            </p>

            <p className="mt-4 leading-relaxed text-zinc-400">
              Измерения помогают определить характер деформации до ремонта и
              контролировать результат во время восстановления кузова.
            </p>
          </div>

          <div className="rounded-[28px] border border-orange-500/30 bg-orange-500/[0.07] p-7 md:p-9">
            <h2 className="text-3xl font-bold">
              Есть сомнения после ДТП?
            </h2>

            <p className="mt-4 leading-relaxed text-zinc-300">
              Отправьте фотографии автомобиля. Предварительно посмотрим характер
              повреждений и подскажем, нужна ли проверка геометрии.
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

        <ServiceLinks current="/services/kontrol-geometrii" />
      </section>
    </main>
  );
}

