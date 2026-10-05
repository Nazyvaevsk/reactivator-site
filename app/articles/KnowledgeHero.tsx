import Link from "next/link";
import styles from "./KnowledgeHero.module.css";

export default function KnowledgeHero() {
  return (
    <section className={styles.hero} aria-labelledby="knowledge-title">
      <div className={styles.content}>
        <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-zinc-400"><Link href="/" className="hover:text-orange-400">Главная</Link><span className="mx-3">/</span><span aria-current="page">База знаний</span></nav>
        <div className={styles.copy}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Reactivator / Знания и практика</p>
          <h1 id="knowledge-title" className="text-4xl font-bold tracking-tight md:text-6xl">База <span className="text-orange-500">знаний</span></h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300">Разбираемся в геометрии кузова, измерениях и ремонте после ДТП. Здесь же — новости технической базы Reactivator.</p>
        </div>
      </div>
    </section>
  );
}

