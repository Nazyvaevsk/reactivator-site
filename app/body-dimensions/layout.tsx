import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "Кузовные размеры | Реактиватор",
  description:
    "База контрольных размеров кузова по маркам, моделям и годам выпуска.",
};

export default function BodyDimensionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PagesHeader />
      {children}
    </>
  );
}
