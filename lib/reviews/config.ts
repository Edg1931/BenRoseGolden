/**
 * Reviews configuration. Where customers read & leave reviews (Google, Facebook,
 * Zillow), an optional aggregate rating, and curated/featured testimonials.
 *
 * All destination URLs are overridable via NEXT_PUBLIC_* env vars so staff can
 * point them at the real Benjamin Rose / Golden Group profiles without a code
 * change. Live Google reviews are fetched separately (lib/reviews/google.ts)
 * when a Places API key is configured.
 */

export type ReviewPlatform = "google" | "facebook" | "zillow";

export interface ReviewLinks {
  /** Page where visitors READ existing reviews. */
  read: string;
  /** Deep link to WRITE a new review. */
  write: string;
}

const env = (k: string, fallback: string) =>
  (process.env[k as keyof NodeJS.ProcessEnv] as string | undefined) || fallback;

/** Read/write links per platform (env-overridable). Replace fallbacks with the
 *  org's real profile URLs, or set the matching NEXT_PUBLIC_*_REVIEW_URL vars. */
export const REVIEW_LINKS: Record<ReviewPlatform, ReviewLinks> = {
  google: {
    read: env("NEXT_PUBLIC_GOOGLE_REVIEWS_URL", "https://www.google.com/search?q=Benjamin+Rose+Institute+on+Aging+reviews"),
    write: env("NEXT_PUBLIC_GOOGLE_WRITE_REVIEW_URL", "https://www.google.com/search?q=Benjamin+Rose+Institute+on+Aging+reviews"),
  },
  facebook: {
    read: env("NEXT_PUBLIC_FACEBOOK_REVIEWS_URL", "https://www.facebook.com/BenRose1908/reviews"),
    write: env("NEXT_PUBLIC_FACEBOOK_REVIEWS_URL", "https://www.facebook.com/BenRose1908/reviews"),
  },
  zillow: {
    read: env("NEXT_PUBLIC_ZILLOW_REVIEWS_URL", "https://www.zillow.com/lender-profile/"),
    write: env("NEXT_PUBLIC_ZILLOW_REVIEWS_URL", "https://www.zillow.com/lender-profile/"),
  },
};

export const PLATFORM_META: Record<ReviewPlatform, { label: string; icon: string }> = {
  google: { label: "Google", icon: "🔵" },
  facebook: { label: "Facebook", icon: "📘" },
  zillow: { label: "Zillow", icon: "🏠" },
};

export interface Review {
  author: string;
  platform: ReviewPlatform;
  rating: number; // 1–5
  text: string;
  /** Optional ISO date or display string. */
  date?: string;
}

/**
 * Curated/featured reviews shown when live fetching isn't configured. Keep these
 * REAL — add genuine testimonials the org has permission to display. Empty by
 * default so nothing fake is ever shown; the platform buttons still appear.
 */
export const FEATURED_REVIEWS: Review[] = [];

/** Optional manually-maintained aggregate, shown when set (and no live data). */
export const AGGREGATE: { rating: number; count: number } | null = null;
