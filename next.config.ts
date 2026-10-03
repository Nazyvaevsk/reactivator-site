import type { NextConfig } from "next";

const metadata = ["./private/body-dimensions/access-index.json"];
const nextConfig: NextConfig = {
  async headers() {
    return [
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
