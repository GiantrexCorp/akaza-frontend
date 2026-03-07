import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "www.barcelo.com",
      },
      {
        protocol: "https",
        hostname: "as1.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "as2.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "www.deeproperties.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "photos.hotelbeds.com",
      },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
});
