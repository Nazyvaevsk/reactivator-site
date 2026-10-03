import type { NextConfig } from "next";

const metadata = ["./private/body-dimensions/access-index.json"];
const isVercel = process.env.VERCEL === "1";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ...(isVercel ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] : []),
      ] },
      { source: "/:path((?!body-dimensions/issue$).*)", headers: [
        { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
      ] },
      { source: "/body-dimensions/issue", headers: [
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Frame-Options", value: "DENY" },
      ] },
      { source: "/hero.jpg", headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ] },
      { source: "/hero-mobile.jpg", headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ] },
      { source: "/hero-car-overlay.webp", headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ] },
      { source: "/logo.png", headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ] },
      { source: "/api/:path*", headers: [
        { key: "Cache-Control", value: "private, no-store" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      ] },
      { source: "/:path*.svg", headers: [
        { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; sandbox; frame-ancestors 'none'" },
      ] },
      { source: "/api/body-dimensions/sheet", headers: [
        { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; sandbox; frame-ancestors 'none'" },
        { key: "X-Frame-Options", value: "DENY" },
      ] },
      {
        source: "/body-dimensions/access",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  outputFileTracingIncludes: {
    "/api/send-telegram": metadata,
    "/body-dimensions/issue": metadata,
    "/body-dimensions/access": metadata,
    "/api/body-dimensions/sheet": metadata,
    "/api/body-dimensions/download": metadata,
  },
  outputFileTracingExcludes: {
    "/*": ["./private/**/*.svg"],
  },
};

export default nextConfig;
