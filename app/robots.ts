import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Public pages are meant to be found; the staff CRM is not. Crawlers already
 * get redirected away from staff routes, but say it explicitly so client records
 * and the walkthrough's sample data never surface in search results.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/contacts",
          "/referrals",
          "/reports",
          "/partnership",
          "/lenders",
          "/content",
          "/dpa-finder",
          "/classes",
          "/demo",
          "/learn/profile",
          "/learn/certificate",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
