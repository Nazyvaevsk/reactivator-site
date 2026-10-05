"use client";
import { useState } from "react";
import Link from "next/link";
type Card = { title: string; description: string; date: string; displayDate: string; slug: string; type: "article" | "news" };
export default function KnowledgeList({ posts }: { posts: Card[] }) {
  const [filter, setFilter] = useState("all");
  const visible = posts.filter(post => filter === "all" || post.type === filter);
  return <>
    <div className="mb-8 flex flex-wrap gap-3" role="group" aria-label="Тип материала">
      {[["all", "Все"], ["article", "Статьи"], ["news", "Новости"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={"min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 " + (filter === value ? "border-orange-500 bg-orange-500 text-black" : "border-white/15 bg-zinc-950 text-zinc-300 hover:border-orange-500/60")}>{label}</button>)}
    </div>
    <p className="mb-5 text-sm text-zinc-400" aria-live="polite">Материалов: {visible.length}</p>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(post => <article key={post.slug} className="flex flex-col rounded-[24px] border border-white/10 bg-zinc-950 p-6 transition hover:border-orange-500/50">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs"><span className="font-bold uppercase tracking-wider text-orange-500">{post.type === "article" ? "Статья" : "Новость"}</span><time dateTime={post.date} className="text-zinc-400">{post.displayDate}</time></div>
      <h2 className="mt-5 text-xl font-bold leading-snug"><Link href={"/articles/" + post.slug} className="hover:text-orange-400 focus-visible:outline-orange-500">{post.title}</Link></h2>
      <p className="mb-6 mt-4 text-sm leading-7 text-zinc-400">{post.description}</p>
      <Link href={"/articles/" + post.slug} aria-label={"Читать: " + post.title} className="mt-auto text-sm font-semibold text-orange-400 hover:text-orange-300">Читать материал →</Link>
    </article>)}</div>
    {visible.length === 0 && <p className="py-10 text-zinc-400">В этом разделе пока нет публикаций.</p>}
  </>;
}
