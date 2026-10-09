import Image from "next/image";
import styles from "./PhotoGuide.module.css";

const angles = [
  { title: "Спереди под углом", note: "≈ 45°", width: 304, height: 148 },
  { title: "Спереди", note: "прямо", width: 270, height: 148 },
  { title: "Спереди под углом", note: "≈ 45°", width: 298, height: 148 },
  { title: "Левая сторона", note: "≈ 90°", width: 336, height: 125 },
  { title: "Сзади", note: "прямо", width: 200, height: 125 },
  { title: "Правая сторона", note: "≈ 90°", width: 338, height: 125 },
  { title: "Сзади под углом", note: "≈ 45°", width: 305, height: 134 },
  { title: "Крыша под углом", note: "например, со ступеньки", width: 293, height: 133 },
];

const damageExamples = [
  { file: "overview", title: "Общий вид повреждения", height: 195 },
  { file: "closeup", title: "Крупный план", height: 195 },
  { file: "structure", title: "Важные элементы", height: 172 },
  { file: "extra", title: "Дополнительные ракурсы", height: 172 },
];

const steps = [
  { title: "Отправляете фотографии", text: "Общий вид автомобиля и подробные фото повреждений." },
  { title: "Изучаем повреждения и рассчитываем предварительную стоимость", text: "По фотографиям." },
  { title: "Согласовываем ремонт", text: "Обсуждаем стоимость, объём работ и удобное время." },
  { title: "Определяем дальнейшие работы", text: "Выполняем ремонт и контролируем кузов по заводским размерам." },
];

export default function PhotoGuide() {
  return (
    <section aria-labelledby="photo-guide-title" className="mt-4 rounded-[22px] border border-white/15 bg-zinc-950 p-4 md:p-7">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-500">Инструкция по фотографиям</p>
      <h2 id="photo-guide-title" className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
        Как сфотографировать автомобиль для оценки
      </h2>

      {/* The approved composition stays intact on wide screens. The same
          photographs and text are arranged separately below for narrow screens. */}
      <div className={`${styles.desktop} mt-5`}>
        <Image
          src="/images/contacts/photo-guide.webp"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          unoptimized
          className="h-auto w-full rounded-xl"
        />
      </div>

      {/* Keep the text available to screen readers alongside the desktop image. */}
      <div className={`${styles.details} mt-5`}>
        <h3 className="text-lg font-bold">Для предварительной оценки нужны фотографии автомобиля:</h3>
        <ol className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {angles.map((angle, index) => (
            <li key={index}>
              <Image
                src={`/images/contacts/angle-${index + 1}.webp`}
                alt=""
                width={angle.width}
                height={angle.height}
                unoptimized
                className="h-auto w-full rounded-xl"
              />
              <div className="mt-2 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-black">{index + 1}</span>
                <div><p className="font-semibold">{angle.title}</p><p className="text-sm text-zinc-400">({angle.note})</p></div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-xl border border-white/15 p-4 text-base leading-relaxed text-zinc-300">
          <strong className="text-white">Крыша — под углом, как на примере.</strong>{" "}
          Достаточно сделать фото сверху под углом со своего роста или со ступеньки.
        </p>

        <h3 className="mt-7 text-lg font-bold text-orange-500">Примеры подробных фото повреждений</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {damageExamples.map((example) => (
            <figure key={example.file}>
              <Image src={`/images/contacts/damage-${example.file}.webp`} alt="" width={256} height={example.height} unoptimized className="h-auto w-full rounded-xl" />
              <figcaption className="mt-2 font-semibold">{example.title}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-orange-500/30 bg-orange-950/20 p-4 leading-relaxed">
          <p className="font-semibold">Также сделайте крупные фотографии всех повреждений с разных ракурсов.</p>
          <p className="mt-2 text-sm text-zinc-400">Чем больше информативных фотографий, тем точнее мы сможем предварительно оценить стоимость работ.</p>
        </div>

        <h3 className="mt-7 text-lg font-bold text-orange-500">Как мы работаем</h3>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-xl border border-white/10 p-4">
              <span className="text-2xl font-bold text-orange-500">0{index + 1}</span>
              <div><h4 className="font-semibold">{step.title}</h4><p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
