"use client";

import { useApplicationForm } from "../ApplicationFormProvider";
import PhotoGuide from "./PhotoGuide";

export default function ContactsPage() {
  const openForm = useApplicationForm();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-26 md:px-8 md:pb-12 md:pt-25.5">
        <header className="rounded-[22px] border border-white/15 bg-zinc-950 px-5 py-5 md:px-7 md:py-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Реактиватор · Омск
          </p>
          <h1 className="mt-3 text-[clamp(1.875rem,4vw,3rem)] font-bold leading-tight tracking-tight">
            Связаться с Реактиватором
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-300 md:text-lg">
            Оценим предварительную стоимость кузовных работ по фотографиям.
          </p>
        </header>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
          <article className="rounded-[22px] border border-white/15 bg-zinc-950 px-5 py-5 md:px-7 md:py-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Контакты</p>
            <h2 className="mt-3 text-2xl font-bold">Омск</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Адрес</dt>
                <dd className="mt-1 text-base font-semibold">ул. 3-я Молодёжная, 81/2</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Телефон</dt>
                <dd>
                  <a href="tel:+79994547470" className="inline-flex min-h-11 items-center text-base font-semibold transition-colors hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
                    +7 999 454-74-70
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-white/10 pt-4 text-sm leading-relaxed text-zinc-300">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Режим посещения</h3>
              <p className="mt-2 flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                Посещение мастерской — по предварительной договорённости.
              </p>
              <p className="mt-3"><span className="font-semibold text-white">Время для связи:</span> ежедневно с 10:00 до 19:00.</p>
            </div>
          </article>

          <article className="rounded-[22px] border border-orange-500/60 bg-gradient-to-br from-[#1a0900] to-zinc-950 px-5 py-5 md:px-7 md:py-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Оценка по фото</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight">Покажите повреждения автомобиля</h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-300">
              Пришлите фото с нескольких ракурсов — рассчитаем предварительную стоимость работ.
            </p>
              <button
                type="button"
                onClick={openForm}
                className="group mt-5 flex w-full items-center justify-center gap-4 rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_18px_rgba(255,106,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.8)] md:mt-5 md:gap-3 md:px-5.5 md:py-3 max-md:px-5 max-lg:w-full max-lg:min-h-14 max-lg:gap-2 max-lg:px-3 max-lg:[&>span:first-child]:shrink-0 max-lg:[&>svg]:shrink-0"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors group-hover:bg-white group-hover:text-orange-500 md:h-8 md:w-8">
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
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Заявку с фотографиями можно отправить через сайт в любое время.
            </p>
          </article>
        </div>

        <PhotoGuide />
      </div>
    </main>
  );
}
