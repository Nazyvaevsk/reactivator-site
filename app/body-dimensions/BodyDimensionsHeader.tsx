"use client";

import { usePathname } from "next/navigation";
import PagesHeader from "../PagesHeader";

export default function BodyDimensionsHeader() {
  const pathname = usePathname();

  if (pathname === "/body-dimensions/access") {
    return null;
  }

  return <PagesHeader />;
}
