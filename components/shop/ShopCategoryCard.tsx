import Link from "next/link";
import type { ShopCategory } from "@/types/shop";

export default function ShopCategoryCard({
  category,
  productCount,
  active = false,
}: {
  category: ShopCategory;
  productCount: number;
  active?: boolean;
}) {
  return (
    <Link
      href={`/shop?category=${category.id}#catalog`}
      aria-current={active ? "true" : undefined}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-zinc-950 p-5 transition-colors hover:border-orange-500/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 md:p-6 ${active ? "border-orange-500/60" : "border-white/15"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-32 w-40 text-zinc-700">
        <svg viewBox="0 0 160 128" fill="none" className="h-full w-full" stroke="currentColor">
          <path d="M0 32h160M0 64h160M0 96h160M32 0v128M64 0v128M96 0v128M128 0v128" opacity=".3" />
          {category.id === "body-tools" && <path d="m55 92 45-45m-6-20a20 20 0 0 0-17 29L44 89a8 8 0 0 0 11 11l33-33a20 20 0 0 0 29-17l-14 9-15-15 6-17Z" />}
          {category.id === "workshop" && <path d="M30 86h104v12H30zM42 86V42h14v44m52 0V42h14v44M56 52h52M42 98v12m80-12v12M70 52v20h24V52" />}
          {category.id === "pdr" && <path d="M35 96h70a18 18 0 0 0 0-36H86m-39 25V35h18v50M33 35h46M86 60v14" />}
          {category.id === "measuring" && <path d="M30 50h104v30H30zM45 50v15m15-15v8m15-8v15m15-15v8m15-8v15m15-15v8M30 94h104m-104-6v12m104-12v12" />}
        </svg>
      </div>
      <span className="relative text-3xl font-medium text-orange-500">{category.number}</span>
      <h3 className="relative mt-8 text-xl font-bold text-white">{category.name}</h3>
      <p className="relative mb-6 mt-3 text-sm leading-relaxed text-zinc-400">{category.description}</p>
      <div className="relative mt-auto flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-zinc-400">{productCount > 0 ? `Товаров: ${productCount}` : "Скоро"}</span>
        <span aria-hidden="true" className="text-xl text-orange-500 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
