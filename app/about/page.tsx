export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Реактиватор · Омск
        </p>

        <h1 className="mt-8 max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Восстанавливаем кузов
          <br />
          по измерениям
        </h1>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Реактиватор специализируется на восстановлении геометрии кузова
          после серьёзных ДТП и контроле размеров автомобиля на каждом этапе
          ремонта.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">01</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Работаем по измерениям
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Определяем положение контрольных точек, выявляем отклонения
              геометрии и контролируем результат восстановления.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">02</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Сложные повреждения
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Работаем с последствиями серьёзных ДТП, перекосами кузова и
              повреждениями силовых элементов.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">03</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Контроль результата
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              После выполнения работ повторно проверяем контрольные точки и
              размеры кузова.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">04</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Омск
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Работаем в Омске. Адрес и время посещения согласовываем заранее.
            </p>
          </article>
        </div>

        <div className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-8 md:p-10">
          <h2 className="text-3xl font-semibold">
            Есть повреждения после ДТП?
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">
            Отправьте фотографии автомобиля. Предварительно оценим ситуацию
            и подскажем, что потребуется для восстановления.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-orange-500 px-7 py-4 font-semibold text-white hover:bg-orange-400"
          >
            Отправить фото повреждений
          </a>
        </div>
      </section>
    </main>
  );
}
