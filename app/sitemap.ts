import type { MetadataRoute } from "next";
import { loadAllPrograms } from "@/lib/programs/sources";
import { COURSE_DAYS } from "@/lib/learn/course";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Families look for down-payment help on Google before they ever hear of
 * Benjamin Rose. Every public program page is its own answer to a search like
 * "down payment assistance Cuyahoga County", so they all belong in the sitemap.
 *
 * Staff routes are deliberately absent — see app/robots.ts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: `${base}/welcome`, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/assistance`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/learn`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/learn/start`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/resources`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/partners`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${base}/reviews`, changeFrequency: "monthly", priority: 0.5 },
    ] satisfies MetadataRoute.Sitemap
  ).map((p) => ({ ...p, lastModified: now }));

  const classPages: MetadataRoute.Sitemap = COURSE_DAYS.map((d) => ({
    url: `${base}/learn/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let programPages: MetadataRoute.Sitemap = [];
  try {
    const programs = await loadAllPrograms();
    programPages = programs.map((p) => ({
      url: `${base}/assistance/${p.id}`,
      lastModified: p.lastVerified ? new Date(p.lastVerified) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // A sitemap missing a few entries beats a sitemap that fails to build.
  }

  return [...staticPages, ...classPages, ...programPages];
}
