import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "Технология восстановления геометрии кузова",
  description:
    "Как выполняется восстановление геометрии кузова после ДТП: стапельные работы, контроль размеров и восстановление положения силовых элементов кузова.",
  alternates: {
    canonical: "https://reactivator55.ru/technology",
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
