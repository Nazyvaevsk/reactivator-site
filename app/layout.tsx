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
    default: "Реактиватор — восстановление геометрии кузова в Омске",
    template: "%s | Реактиватор",
  },

  description:
    "Восстановление геометрии кузова после ДТП в Омске. Стапельные работы, контроль размеров и ремонт силовых элементов кузова.",

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
    title: "Реактиватор — восстановление геометрии кузова в Омске",
    description:
      "Восстановление геометрии кузова после ДТП в Омске. Стапельные работы, контроль размеров и ремонт силовых элементов кузова.",
    images: [
      {
        url: "/hero.jpg",
        alt: "Реактиватор — восстановление геометрии кузова",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Реактиватор — восстановление геометрии кузова в Омске",
    description:
      "Восстановление геометрии кузова после ДТП в Омске.",
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


