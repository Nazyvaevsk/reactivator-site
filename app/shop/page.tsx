import type { Metadata } from "next";
import Link from "next/link";
import PagesHeader from "@/app/PagesHeader";
import { shopLaunchTitle, shopLaunchDescription, shopLaunchStatus } from "@/components/shop/launch-copy";

export const metadata: Metadata = {
  title: "Магазин — скоро открытие",
  description: shopLaunchDescription,
  alternates: { canonical: "/shop" },
  robots: { index: false, follow: true },
  openGraph: {
    title: shopLaunchTitle,
    description: shopLaunchDescription,
    url: "/shop",
  },
};

// The original catalog is preserved in components/shop/ShopCatalog.tsx.
export default function ShopPage() {
  return (
    <div id="shop-page" className="min-h-screen bg-black text-white">
      <PagesHeader />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-28 md:px-8 md:pt-36">
        <nav aria-label="Хлебные крошки" className="flex items-center gap-3 text-sm text-zinc-400">
          <Link href="/" className="transition-colors hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-orange-500">Главная</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-200">Магазин</span>
        </nav>
        <section aria-labelledby="shop-title" className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 to-black px-6 py-10 md:mt-12 md:px-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Reactivator / Магазин</p>
          <div aria-hidden="true" className="mt-6 h-px w-16 bg-orange-500" />
          <h1 id="shop-title" className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">{shopLaunchTitle}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">{shopLaunchDescription}</p>
          <p className="mt-8 text-sm font-semibold text-orange-500">{shopLaunchStatus}</p>
          <Link href="/" className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition-colors hover:border-orange-500/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"><span aria-hidden="true">←</span> На главную</Link>
        </section>
      </main>
    </div>
  );
}
