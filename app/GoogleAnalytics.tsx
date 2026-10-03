"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = "G-JE35JG8S9M";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  if (pathname === "/body-dimensions/access") return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
