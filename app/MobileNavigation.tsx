"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { number: "01", href: "/", label: "Главная" },
  { number: "02", href: "/services", label: "Услуги" },
  { number: "03", href: "/technology", label: "Технология" },
  { number: "04", href: "/works", label: "Примеры работ" },
  { number: "05", href: "/about", label: "О нас" },
  { number: "06", href: "/contacts", label: "Контакты" },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggle.current?.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  return (
    <div ref={root} className="md:hidden">
      <button
        ref={toggle}
        type="button"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/80 text-white transition hover:border-orange-500/50 focus-visible:outline-2 focus-visible:outline-orange-500"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path d={isOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <nav
        id={menuId}
        aria-label="Мобильная навигация"
        hidden={!isOpen}
        className="absolute inset-x-4 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950 to-black px-5 pb-5 pt-5 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
      >
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Reactivator / Navigation
          </div>
          <div className="mt-3 h-px w-16 bg-orange-500" />
        </div>

        <div className="divide-y divide-white/[0.07]">
          {menuItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex min-h-14 items-center gap-4 py-3 focus-visible:outline-2 focus-visible:outline-orange-500"
              >
                <span
                  className={`w-6 text-xs font-bold ${
                    active ? "text-orange-500" : "text-zinc-600"
                  }`}
                >
                  {item.number}
                </span>

                <span
                  className={`text-[17px] font-semibold transition ${
                    active
                      ? "text-orange-500"
                      : "text-white group-hover:text-orange-400"
                  }`}
                >
                  {item.label}
                </span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,106,0,0.9)]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Правильно и надёжно
        </div>
      </nav>
    </div>
  );
}