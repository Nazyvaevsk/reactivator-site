"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "Услуги" },
  { href: "/technology", label: "Технология" },
  { href: "/works", label: "Примеры работ" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

export default function NavigationLinks() {
  const pathname = usePathname();

  return links.map(({ href, label }) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`relative whitespace-nowrap text-sm font-semibold transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-orange-500 after:transition-opacity after:duration-200 hover:text-orange-400 hover:after:opacity-100 focus-visible:text-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${active ? "text-orange-500 after:opacity-100" : "text-white after:opacity-0"}`}
      >
        {label}
      </Link>
    );
  });
}
