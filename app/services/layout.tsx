import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Восстановление геометрии кузова после ДТП в Омске",
  description:
    "Восстановление геометрии кузова после ДТП в Омске: стапельные работы, ремонт силовых элементов, контроль геометрии и размеров кузова.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
