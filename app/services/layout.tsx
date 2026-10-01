import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "Кузовной ремонт и восстановление геометрии в Омске",
  description:
    "Кузовной ремонт и восстановление геометрии в Омске: стапельные работы, ремонт силовых элементов, контроль геометрии и размеров кузова.",
  alternates: {
    canonical: "https://www.reactivator55.ru/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PagesHeader />
      {children}
    </>
  );
}

