"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const COUNTER_ID = 113174477;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export default function YandexMetrika() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const isPrivateAccess = pathname === "/body-dimensions/access";

  useEffect(() => {
    if (isPrivateAccess) return;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    window.ym?.(COUNTER_ID, "hit", window.location.href);
  }, [pathname, isPrivateAccess]);

  if (isPrivateAccess) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j=0;j<document.scripts.length;j++){
              if(document.scripts[j].src===r){return;}
            }
            k=e.createElement(t);
            a=e.getElementsByTagName(t)[0];
            k.async=1;
            k.src=r;
            a.parentNode.insertBefore(k,a);
          })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=113174477','ym');

          ym(${COUNTER_ID}, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true
          });
        `}
      </Script>

      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
