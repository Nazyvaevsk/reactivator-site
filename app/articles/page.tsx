import type { Metadata } from "next";
import KnowledgeHero from "./KnowledgeHero";
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
  return <main>
    <KnowledgeHero />
    <section aria-label="Материалы базы знаний" className="mx-auto max-w-[1280px] px-4 pb-20 pt-5 md:px-8">
      <KnowledgeList posts={posts} />
    </section>
  </main>;
}
