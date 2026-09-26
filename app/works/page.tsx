export default function WorksPage() {
  const works = [
    {
      image: "/works/work-1.jpg",
      title: "Восстановление кузова после серьёзного ДТП",
      text: "Восстановление повреждённой передней части автомобиля и контроль геометрии кузова.",
    },
    {
      image: "/works/work-2.jpg",
      title: "Восстановление задней части кузова",
      text: "Работа с повреждениями задней части автомобиля и восстановление контрольных размеров.",
    },
    {
      image: "/works/work-3.jpg",
      title: "Контроль геометрии",
      text: "Проверка положения кузова и контрольных точек после выполнения ремонтных работ.",
    },
    {
      image: "/works/work-4.jpg",
      title: "Кузовные работы",
      text: "Восстановление отдельных элементов кузова в зависимости от характера повреждений.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Реактиватор · Омск
        </p>

        <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Примеры работ
        </h1>

        <p className="mt-10 max-w-4xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Реальные примеры восстановления кузова, геометрии и отдельных
          элементов после повреждений.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {works.map((work) => (
            <article
              key={work.title}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
            >
              <div className="aspect-[4/3] bg-zinc-900">
                <img
                  src={work.image}
                  alt={work.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-semibold">
                  {work.title}
                </h2>

                <p className="mt-4 leading-relaxed text-zinc-400">
                  {work.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
