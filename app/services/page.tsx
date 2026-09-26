export default function ServicesPage() {
  const services = [
    {
      number: "01",
      title: "Восстановление геометрии кузова",
      text: "Восстанавливаем кузов после серьёзных ДТП, устраняем перекосы и возвращаем контрольные точки к заводским параметрам.",
    },
    {
      number: "02",
      title: "Кузовной ремонт после ДТП",
      text: "Работаем с повреждениями силовых элементов кузова и подготавливаем автомобиль к дальнейшему ремонту.",
    },
    {
      number: "03",
      title: "Контроль геометрии и размеров",
      text: "Проверяем контрольные точки и симметрию кузова, чтобы результат ремонта можно было проверить измерениями.",
    },
    {
      number: "04",
      title: "Локальные кузовные работы",
      text: "Выполняем отдельные кузовные работы в зависимости от характера повреждений и состояния автомобиля.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Реактиватор · Омск
        </p>

        <h1 className="mt-8 max-w-6xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Услуги по
          <br />
          восстановлению кузова
        </h1>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Восстанавливаем геометрию кузова после ДТП, устраняем перекосы и
          контролируем размеры автомобиля на каждом этапе ремонта.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.number}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10"
            >
              <div className="text-3xl font-medium text-orange-500">
                {service.number}
              </div>

              <h2 className="mt-8 text-2xl font-semibold">
                {service.title}
              </h2>

              <p className="mt-5 leading-relaxed text-zinc-400">
                {service.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-8 md:p-10">
          <h2 className="text-3xl font-semibold">
            Не знаете, насколько серьёзное повреждение?
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">
            Отправьте фотографии автомобиля. Предварительно оценим повреждения
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
