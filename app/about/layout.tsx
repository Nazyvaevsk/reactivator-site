import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "О мастерской",
  description:
    "Реактиватор — мастерская восстановления геометрии кузова после ДТП в Омске. Работа со сложными повреждениями кузова и контроль размеров.",
  alternates: {
    canonical: "https://www.reactivator55.ru/about",
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

