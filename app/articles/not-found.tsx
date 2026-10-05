import Link from "next/link";
export default function NotFound() { return <main className="mx-auto max-w-3xl px-4 pb-20 pt-36"><h1 className="text-3xl font-bold">Материал не найден</h1><p className="mt-5 text-zinc-400">Возможно, адрес изменился или материал ещё не опубликован.</p><Link href="/articles" className="mt-6 inline-block text-orange-400">Открыть базу знаний →</Link></main>; }
