import type { Review } from "./config";

/**
 * Live Google reviews via the Places API. Activates only when both
 * GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are set; otherwise returns null so
 * callers fall back to curated reviews. Server-only (uses the secret key).
 *
 * Find the Place ID at https://developers.google.com/maps/documentation/places/web-service/place-id
 */
export function isGoogleReviewsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);
}

export interface GoogleReviewsResult {
  rating: number | null;
  total: number | null;
  reviews: Review[];
}

export async function fetchGoogleReviews(): Promise<GoogleReviewsResult | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=rating,user_ratings_total,reviews&reviews_sort=newest&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 86_400 } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        rating?: number;
        user_ratings_total?: number;
        reviews?: { author_name: string; rating: number; text: string; relative_time_description?: string }[];
      };
    };
    const r = data.result;
    if (!r) return null;
    const reviews: Review[] = (r.reviews ?? [])
      .filter((rv) => rv.text?.trim())
      .slice(0, 6)
      .map((rv) => ({
        author: rv.author_name,
        platform: "google" as const,
        rating: rv.rating,
        text: rv.text,
        date: rv.relative_time_description,
      }));
    return { rating: r.rating ?? null, total: r.user_ratings_total ?? null, reviews };
  } catch {
    return null;
  }
}
