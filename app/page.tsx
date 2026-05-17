export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* HERO */}

      <section className="relative min-h-screen overflow-hidden">

        <>
  {/* DESKTOP */}
  <img
    src="/hero.jpg"
    alt=""
    className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
  />

  {/* MOBILE */}
  <img
    src="/hero-mobile.jpg"
    alt=""
    className="absolute inset-0 block h-full w-full object-cover object-center md:hidden"
  />
</>
    

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full items-end">

          <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:pb-24">

            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-zinc-300">
              Омск
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-none md:text-8xl">
              Реактиватор
            </h1>

            <p className="mb-5 max-w-4xl text-2xl text-zinc-100 md:text-5xl">
              Восстановление геометрии кузова после ДТП
            </p>

            <p className="mb-10 max-w-2xl text-base leading-relaxed text-zinc-200 md:text-lg">
              Сложные ДТП, перекосы кузова, нарушение силовой структуры,
              восстановление геометрии и контроль размеров.
            </p>

            <div>

              <button className="w-full rounded-2xl bg-white px-8 py-5 text-lg text-black transition hover:bg-zinc-300 sm:w-auto">
                Отправить фото повреждений
              </button>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                Предварительная оценка повреждений и стоимости восстановления по фото
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CASES */}

      <section className="bg-black px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Реальные случаи
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Геометрия кузова
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case1.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case2.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case3.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case4.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

          </div>

        </div>

      </section>

      {/* SERVICES */}

      <section className="border-t border-zinc-900 bg-zinc-950 px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12">

            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
              Услуги
            </p>

            <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Геометрия кузова и восстановление после ДТП
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Восстановление геометрии кузова
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Стапельные работы
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Восстановление после ДТП
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Правка лонжеронов
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Устранение перекоса кузова
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-7 transition hover:border-zinc-600">
              <p className="text-xl font-medium">
                Восстановление проёмов
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CONTACTS */}

      <section className="bg-black px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
            Контакты
          </p>

          <h2 className="mb-16 text-4xl font-bold md:text-6xl">
            Реактиватор
          </h2>

          <div className="space-y-6 text-lg text-zinc-300">

            <a
              href="https://2gis.ru/omsk/geo/70000001105268013"
              target="_blank"
              className="block transition hover:text-white"
            >
              📍 Омск, 3-я Молодежная 81/2
            </a>

            <a
              href="https://t.me/reaktivator_IA"
              target="_blank"
              className="block transition hover:text-white"
            >
              ✈️ Telegram — @reaktivator_IA
            </a>

            <a
              href="https://wa.me/79994547470"
              target="_blank"
              className="block transition hover:text-white"
            >
              💬 WhatsApp — 89994547470
            </a>

            <a
              href="tel:+79994547470"
              className="block transition hover:text-white"
            >
              📞 Телефон — 89994547470
            </a>

            <a
              href="https://2gis.ru/omsk/geo/70000001105268013"
              target="_blank"
              className="block transition hover:text-white"
            >
              🗺️ Открыть в 2ГИС
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}