import Image from "next/image";
import type { ShopProduct } from "@/types/shop";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

const availabilityLabels: Record<ShopProduct["availability"], string> = {
  "in-stock": "В наличии",
  "on-request": "Под заказ",
  "out-of-stock": "Нет в наличии",
};

export default function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/15 bg-zinc-950">
      <div className="relative aspect-[4/3] border-b border-white/10 bg-zinc-900">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-contain p-5"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-xs font-semibold text-zinc-400">
          {availabilityLabels[product.availability]}
        </p>
        <h3 className="mt-3 text-xl font-bold leading-tight text-white">{product.name}</h3>
        <p className="mb-6 mt-3 text-sm leading-relaxed text-zinc-400">{product.description}</p>
        <p className="mt-auto border-t border-white/10 pt-4 text-2xl font-bold tabular-nums text-white">
          {priceFormatter.format(product.price)}
        </p>
      </div>
    </article>
  );
}
