export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Реактиватор · Омск
        </p>

        <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Контакты
        </h1>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Обсудим повреждения автомобиля, определим необходимый объём работ и
          договоримся о времени ремонта.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">01</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Омск
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Работаем в Омске. Точный адрес и время посещения согласовываем
              заранее.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
            <div className="text-3xl font-medium text-orange-500">02</div>

            <h2 className="mt-8 text-2xl font-semibold">
              Предварительная оценка
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Можно отправить фотографии повреждений. По ним предварительно
              оценим ситуацию и подскажем, что потребуется для восстановления.
            </p>
          </article>
        </div>

        <div className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-8 md:p-10">
          <h2 className="text-3xl font-semibold">
            Хотите узнать, что можно сделать с автомобилем?
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">
            Отправьте фотографии повреждений или свяжитесь с нами, чтобы
            обсудить автомобиль и дальнейшие действия.
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
