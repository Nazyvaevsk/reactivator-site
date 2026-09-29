import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "Примеры восстановления кузова после ДТП",
  description:
    "Реальные примеры восстановления геометрии кузова после серьёзных ДТП в Омске. Фото автомобилей до ремонта, в процессе и после восстановления.",
  alternates: {
    canonical: "https://www.reactivator55.ru/works",
  },
};

export default function PageLayout({
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

