import Link from "next/link";

export default function PagesHeader() {
  return (
    <header className="absolute left-0 top-0 z-50 w-full border-b border-white/10 bg-black/20 text-white backdrop-blur-[2px]">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-6 md:px-0">
        <Link
          href="/"
          className="text-[25px] font-black tracking-tight"
        >
          <span className="text-orange-500">R</span>ЕАКТИВАТОР
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/services"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Услуги
          </Link>

          <Link
            href="/technology"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Технология
          </Link>

          <Link
            href="/works"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Примеры работ
          </Link>

          <Link
            href="/about"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            О нас
          </Link>

          <Link
            href="/contacts"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Контакты
          </Link>
        </nav>

        <Link
          href="/contacts"
          className="rounded-[18px] bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
        >
          Записаться
        </Link>
      </div>
    </header>
  );
}
