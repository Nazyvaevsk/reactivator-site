"use client";

import Link from "next/link";
import ShopLaunchButton from "@/components/shop/ShopLaunchButton";
import { usePathname } from "next/navigation";

import { navigationLinks as links } from "@/lib/navigation";

export default function NavigationLinks({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return links.map(({ href, label }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    const className = mobile ? `flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-orange-500 ${active ? "bg-orange-500/10 text-orange-500" : "text-white"}` : `relative whitespace-nowrap text-sm md:text-xs lg:text-sm font-semibold transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-orange-500 after:transition-opacity after:duration-200 hover:text-orange-400 hover:after:opacity-100 focus-visible:text-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${active ? "text-orange-500 after:opacity-100" : "text-white after:opacity-0"}`;
    if (href === "/shop") {
      return <ShopLaunchButton key={href} className={className}>{label}</ShopLaunchButton>;
    }
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={className}
      >
        {label}
      </Link>
    );
  });
}

