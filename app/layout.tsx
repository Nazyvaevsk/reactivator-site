import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApplicationFormProvider from "./ApplicationFormProvider";
import YandexMetrika from "./YandexMetrika";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.reactivator55.ru"),

  title: {
    default: "Кузовной ремонт после ДТП в Омске — Реактиватор",
    template: "%s | Реактиватор",
  },

  description:
    "Кузовной ремонт после ДТП в Омске: восстановление геометрии кузова, стапельные работы, контроль размеров и ремонт силовых элементов.",

  alternates: {
    canonical: "https://www.reactivator55.ru",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://www.reactivator55.ru",
    siteName: "Реактиватор",
    title: "Кузовной ремонт после ДТП в Омске — Реактиватор",
    description:
      "Кузовной ремонт после ДТП в Омске: восстановление геометрии кузова, стапельные работы, контроль размеров и ремонт силовых элементов.",
    images: [
      {
        url: "/hero.jpg",
        alt: "Реактиватор — восстановление геометрии кузова",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Кузовной ремонт после ДТП в Омске — Реактиватор",
    description:
      "Кузовной ремонт после ДТП в Омске: восстановление геометрии кузова, стапельные работы и контроль размеров.",
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ApplicationFormProvider>{children}</ApplicationFormProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}


