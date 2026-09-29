import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Восстановление геометрии кузова в Омске",
  description:
    "Восстановление геометрии кузова после ДТП в Омске. Стапельные работы, устранение перекосов, восстановление положения силовых элементов и контроль размеров.",
  alternates: {
    canonical: "https://www.reactivator55.ru/services/geometriya-kuzova",
  },
};

export default function GeometryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

