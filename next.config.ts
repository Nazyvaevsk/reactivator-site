import type { NextConfig } from "next";

const metadata = ["./private/body-dimensions/access-index.json"];
const nextConfig: NextConfig = {
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
