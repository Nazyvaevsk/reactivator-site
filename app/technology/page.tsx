export default function TechnologyPage() {
  const steps = [
    {
      number: "01",
      title: "Диагностика",
      text: "Определяем состояние кузова, выявляем перекосы и повреждённые элементы силовой структуры.",
    },
    {
      number: "02",
      title: "Измерение",
      text: "Сравниваем контрольные точки и размеры кузова с заданными параметрами.",
    },
    {
      number: "03",
      title: "Восстановление",
      text: "Выполняем вытяжку и восстановление геометрии с постоянным контролем положения кузова.",
    },
    {
      number: "04",
      title: "Финальный контроль",
      text: "Повторно проверяем контрольные точки и размеры после завершения основных работ.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Реактиватор · Омск
        </p>

        <h1 className="mt-8 max-w-6xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Технология восстановления
          <br />
          геометрии кузова
        </h1>

        <p className="mt-10 max-w-4xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Работаем не «на глаз», а по измерениям. Определяем исходную
          геометрию, фиксируем отклонения и контролируем результат после
          ремонта.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10"
            >
              <div className="text-3xl font-medium text-orange-500">
                {step.number}
              </div>

              <h2 className="mt-8 text-2xl font-semibold">
                {step.title}
              </h2>

              <p className="mt-5 leading-relaxed text-zinc-400">
                {step.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-8 md:p-10">
          <h2 className="text-3xl font-semibold">
            Главное — результат, который можно измерить
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-300">
            Контроль геометрии позволяет понимать, что именно изменилось после
            ремонта, и не оставлять скрытые перекосы без внимания.
          </p>
        </div>
      </section>
    </main>
  );
}
