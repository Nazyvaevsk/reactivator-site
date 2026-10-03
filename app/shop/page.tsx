import type { Metadata } from "next";
import Link from "next/link";
import PagesHeader from "@/app/PagesHeader";
import ProductCard from "@/components/shop/ProductCard";
import ShopCategoryCard from "@/components/shop/ShopCategoryCard";
import { getShopCategories, getShopCategory, getShopProducts } from "@/lib/shop/catalog";

export const metadata: Metadata = {
  title: "Магазин",
  description: "Каталог PDR, кузовного инструмента, средств измерения и оснащения мастерской Reactivator.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Магазин | Реактиватор",
    description: "PDR, кузовной инструмент, измерение и оснащение мастерской.",
    url: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category: categoryId } = await searchParams;
  const category = typeof categoryId === "string" ? getShopCategory(categoryId) : undefined;
  const categories = getShopCategories();
  const products = getShopProducts(category?.id);

  return (
    <div id="shop-page" className="min-h-screen bg-black text-white">
      <PagesHeader />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-28 md:px-8 md:pt-36">
        <nav aria-label="Хлебные крошки" className="flex items-center gap-3 text-sm text-zinc-400">
          <Link href="/" className="transition-colors hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-orange-500">Главная</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-200">Магазин</span>
        </nav>

        <section aria-labelledby="shop-title" className="mt-8 border-b border-white/10 pb-10 md:mt-12 md:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Reactivator / Магазин</p>
          <h1 id="shop-title" className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">Инструмент и оснащение для кузовных работ</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            PDR, кузовной инструмент, измерение и оснащение мастерской.
            Всё для точной и последовательной работы.
          </p>
          <a href="#categories" className="mt-7 inline-flex min-h-12 items-center gap-6 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
            Перейти к каталогу <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section id="categories" aria-labelledby="categories-title" className="mt-10 scroll-mt-8">
          <h2 id="categories-title" className="text-2xl font-bold">Категории</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => (
              <ShopCategoryCard key={item.id} category={item} productCount={item.productCount} active={item.id === category?.id} />
            ))}
          </div>
        </section>

        <section id="catalog" aria-labelledby="catalog-title" className="mt-12 scroll-mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="catalog-title" className="text-2xl font-bold">{category?.name ?? "Все товары"}</h2>
            {category && <Link href="/shop#catalog" className="inline-flex min-h-11 items-center text-sm font-semibold text-orange-500 hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-orange-500">Все товары <span aria-hidden="true" className="ml-2">→</span></Link>}
          </div>
          {products.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-zinc-950 px-6 py-12 text-center md:py-16">
              <p className="text-xl font-bold">Товары скоро появятся</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
                Здесь появятся товары с фотографиями, описаниями и ценами.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
