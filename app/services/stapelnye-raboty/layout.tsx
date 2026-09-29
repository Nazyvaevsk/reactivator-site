import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Стапельные работы в Омске",
  description:
    "Стапельные работы в Омске после серьёзных ДТП: восстановление геометрии кузова, устранение перекосов и восстановление положения силовых элементов.",
  alternates: {
    canonical: "https://reactivator55.ru/services/stapelnye-raboty",
  },
};

export default function StapelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
