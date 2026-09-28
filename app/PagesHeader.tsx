import Link from "next/link";

export default function PagesHeader() {
  return (
    <header className="absolute left-0 top-0 z-50 w-full border-b border-white/10 bg-black/20 text-white backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-baseline gap-3"><span className="text-2xl font-black tracking-tight"><span className="text-orange-500">R</span>ЕАКТИВАТОР</span><span className="text-[10px] font-medium uppercase tracking-[0.35em] text-orange-500">ОМСК</span></Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/services" className="text-sm text-zinc-300 hover:text-white">
            Услуги
          </Link>

          <Link href="/technology" className="text-sm text-zinc-300 hover:text-white">
            Технология
          </Link>

          <Link href="/works" className="text-sm text-zinc-300 hover:text-white">
            Примеры работ
          </Link>

          <Link href="/about" className="text-sm text-zinc-300 hover:text-white">
            О нас
          </Link>

          <Link href="/contacts" className="text-sm text-zinc-300 hover:text-white">
            Контакты
          </Link>
        </nav>

        <Link
          href="/"
          className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Записаться
        </Link>
      </div>
    </header>
  );
}


