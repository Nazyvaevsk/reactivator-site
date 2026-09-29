import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проверка геометрии кузова в Омске",
  description:
    "Проверка и контроль геометрии кузова в Омске после ДТП: контрольные точки, размеры кузова, симметрия и положение силовых элементов.",
  alternates: {
    canonical: "https://www.reactivator55.ru/services/kontrol-geometrii",
  },
};

export default function GeometryControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

