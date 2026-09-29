import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Локальные кузовные работы в Омске",
  description:
    "Локальные кузовные работы в Омске после ДТП: восстановление отдельных элементов кузова, повреждённых зон и подготовка кузова к дальнейшей сборке.",
  alternates: {
    canonical: "https://reactivator55.ru/services/lokalnye-kuzovnye-raboty",
  },
};

export default function LocalBodyRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
