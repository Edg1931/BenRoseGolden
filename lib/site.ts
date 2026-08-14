/**
 * The public origin, for absolute URLs in the sitemap and metadata.
 * Vercel supplies VERCEL_PROJECT_PRODUCTION_URL; override with SITE_URL.
 */
export function siteUrl(): string {
  const explicit = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
