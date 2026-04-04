import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/auth/", "/api/", "/sentry-test/"],
      },
    ],
    sitemap: "https://suoops.com/sitemap.xml",
  };
}
