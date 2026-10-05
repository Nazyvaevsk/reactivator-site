"use client";

import Link from "next/link";
import MobileNavigation from "./MobileNavigation";
import NavigationLinks from "./NavigationLinks";
import { useApplicationForm } from "./ApplicationFormProvider";

export default function PagesHeader() {
  const openForm = useApplicationForm();
  return (
    <header className="absolute left-0 top-0 z-50 w-full border-b border-white/10 bg-black/20 text-white backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-8 md:py-4 gap-3 max-md:px-4 max-md:py-3">
        <Link href="/" className="flex items-baseline gap-3 md:gap-2.5 max-md:min-w-0 max-md:flex-col max-md:items-start max-md:gap-0"><span className="text-2xl font-black tracking-tight md:text-[17px] md:leading-[27px] lg:text-[20px] max-md:text-[16px] max-md:leading-5"><span className="text-orange-500">R</span>ЕАКТИВАТОР</span><span className="text-[10px] font-medium uppercase tracking-[0.35em] text-orange-500 max-md:text-[9px] max-md:leading-3">ОМСК</span></Link>

        <nav className="hidden items-center gap-5 xl:flex">
          <NavigationLinks />
        </nav>

        <button type="button" onClick={openForm}
          className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400 md:px-4 md:py-2.5 lg:px-5 ml-auto xl:ml-0 max-md:min-h-11 max-md:shrink-0 max-md:px-3"
        >
          Записаться
        </button>
        <MobileNavigation />
      </div>
    </header>
  );
}


