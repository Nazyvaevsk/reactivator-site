import type { Metadata } from "next";
import PagesHeader from "../PagesHeader";

export const metadata: Metadata = {
  title: "Контакты и кузовной ремонт в Омске",
  description:
    "Реактиватор в Омске — восстановление геометрии кузова после ДТП, стапельные работы и ремонт силовых элементов. Отправьте фотографии автомобиля для предварительной оценки.",
  alternates: {
    canonical: "https://reactivator55.ru/contacts",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Реактиватор",
  url: "https://reactivator55.ru",
  description:
    "Восстановление геометрии кузова после ДТП, стапельные работы и ремонт силовых элементов кузова в Омске.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Омск",
    addressRegion: "Омская область",
    addressCountry: "RU",
  },
  areaServed: {
    "@type": "City",
    name: "Омск",
  },
  image: "https://reactivator55.ru/hero.jpg",
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <PagesHeader />
      {children}
    </>
  );
}
