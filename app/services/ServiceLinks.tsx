"use client";

import Link from "next/link";

const links = [
  {
    href: "/services/geometriya-kuzova",
    title: "Восстановление геометрии кузова",
  },
  {
    href: "/services/stapelnye-raboty",
    title: "Стапельные работы",
  },
  {
    href: "/services/kontrol-geometrii",
    title: "Контроль геометрии и размеров",
  },
  {
    href: "/services/lokalnye-kuzovnye-raboty",
    title: "Локальные кузовные работы",
  },
  {
    href: "/works",
    title: "Примеры реальных работ",
  },
];

export default function ServiceLinks({
  current,
}: {
  current?: string;
}) {
  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <div className="mb-6">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
          Реактиватор
        </div>

        <h2 className="mt-3 text-3xl font-bold">
          Другие услуги и примеры работ
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {links
          .filter((link) => link.href !== current)
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex min-h-[92px] items-center justify-between rounded-[20px] border border-white/10 bg-zinc-950 px-5 py-4 transition-all duration-200 hover:border-orange-500/60 hover:bg-zinc-900"
            >
              <span className="max-w-[80%] font-bold leading-snug text-zinc-200 transition-colors group-hover:text-white">
                {link.title}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-orange-500 transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                →
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
