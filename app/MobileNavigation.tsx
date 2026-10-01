"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import NavigationLinks from "./NavigationLinks";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
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
    const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
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
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/80 text-white focus-visible:outline-2 focus-visible:outline-orange-500"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d={isOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <nav
        id={menuId}
        aria-label="Мобильная навигация"
        hidden={!isOpen}
        className="absolute inset-x-4 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-zinc-950 p-3 shadow-2xl"
      >
        <Link href="/" onClick={() => setIsOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-orange-500">
          Главная
        </Link>
        <NavigationLinks mobile onNavigate={() => setIsOpen(false)} />
      </nav>
    </div>
  );
}
