import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatPostDate } from "@/lib/knowledge";
import KnowledgeList from "./KnowledgeList";
const title = "База знаний о геометрии кузова";
const description = "Как проверяют кузов после ДТП, что означают контрольные точки и как читать карты размеров. Статьи и новости Reactivator.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/articles" },
  openGraph: { title, description, url: "/articles", type: "website" },
  twitter: { card: "summary", title, description },
};
export default function ArticlesPage() {
  const posts = getPosts().map(({ title, description, date, slug, type }) => ({ title, description, date, slug, type, displayDate: formatPostDate(date) }));
  return <main className="mx-auto max-w-[1280px] px-4 pb-20 pt-28 md:px-8 md:pt-36">
    <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-zinc-400"><Link href="/" className="hover:text-orange-400">Главная</Link><span className="mx-3">/</span><span aria-current="page">База знаний</span></nav>
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Reactivator / Знания и практика</p>
    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">База <span className="text-orange-500">знаний</span></h1>
    <p className="mb-10 mt-6 max-w-2xl text-base leading-8 text-zinc-300">Разбираемся в геометрии кузова, измерениях и ремонте после ДТП. Здесь же — новости технической базы Reactivator.</p>
    <KnowledgeList posts={posts} />
  </main>;
}
