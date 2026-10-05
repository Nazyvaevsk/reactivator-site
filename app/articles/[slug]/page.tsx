import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, formatPostDate } from "@/lib/knowledge";
import Markdown from "../Markdown";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return {
    title: post.title, description: post.description,
    alternates: { canonical: "/articles/" + post.slug },
    openGraph: { title: post.title, description: post.description, url: "/articles/" + post.slug, type: "article", publishedTime: post.date, tags: post.tags },
    twitter: { card: "summary", title: post.title, description: post.description },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 md:px-8 md:pt-36">
    <nav aria-label="Хлебные крошки" className="mb-8 flex flex-wrap gap-3 text-sm text-zinc-400"><Link href="/" className="hover:text-orange-400">Главная</Link><span>/</span><Link href="/articles" className="hover:text-orange-400">База знаний</Link></nav>
    <article>
      <div className="mb-5 flex flex-wrap gap-4 text-sm"><span className="font-semibold text-orange-500">{post.type === "article" ? "Статья" : "Новость Reactivator"}</span><time dateTime={post.date} className="text-zinc-400">{formatPostDate(post.date)}</time></div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">{post.title}</h1>
      <p className="mb-10 mt-6 border-b border-white/10 pb-8 text-lg leading-8 text-zinc-300">{post.description}</p>
      <Markdown body={post.body} />
    </article>
    <aside className="mt-12 rounded-3xl border border-orange-500/25 bg-zinc-950 p-6 md:p-8" aria-label="Полезные разделы">
      <h2 className="text-2xl font-bold">От теории к проверке</h2>
      <p className="mt-3 leading-7 text-zinc-400">Сопоставьте информацию с картой конкретного автомобиля, узнайте о диагностике или посмотрите примеры выполненных работ.</p>
      <div className="mt-6 flex flex-wrap gap-3">{[["/body-dimensions", "Карты кузовных размеров"], ["/services", "Услуги"], ["/works", "Примеры работ"]].map(([href, label]) => <Link key={href} href={href} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-orange-400 hover:border-orange-500 focus-visible:outline-orange-500">{label}</Link>)}</div>
    </aside>
    <Link href="/articles" className="mt-8 inline-block py-3 text-sm text-zinc-400 hover:text-orange-400">← Все материалы базы знаний</Link>
  </main>;
}
