import {
  AGGREGATE,
  FEATURED_REVIEWS,
  PLATFORM_META,
  REVIEW_LINKS,
  type Review,
  type ReviewPlatform,
} from "@/lib/reviews/config";
import { fetchGoogleReviews } from "@/lib/reviews/google";

/** Render N filled stars out of 5. */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-brand-goldink">
      {"★".repeat(full)}
      <span className="text-brand-goldink/30">{"★".repeat(Math.max(0, 5 - full))}</span>
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const meta = PLATFORM_META[review.platform];
  return (
    <figure className="flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <span className="text-xs text-muted-foreground" title={meta.label}>
          {meta.icon} {meta.label}
        </span>
      </div>
      <blockquote className="mt-3 flex-1 text-sm text-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-sm font-medium text-brand-plum">
        — {review.author}
        {review.date && <span className="ml-1 font-normal text-muted-foreground">· {review.date}</span>}
      </figcaption>
    </figure>
  );
}

/** "Leave a review" / "Read reviews" buttons for each platform. */
function PlatformButtons() {
  const platforms = Object.keys(REVIEW_LINKS) as ReviewPlatform[];
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {platforms.map((p) => {
        const meta = PLATFORM_META[p];
        return (
          <a
            key={p}
            href={REVIEW_LINKS[p].write}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:border-brand-rose hover:text-brand-rose"
          >
            <span aria-hidden>{meta.icon}</span>
            Review us on {meta.label}
          </a>
        );
      })}
    </div>
  );
}

/**
 * Reviews section for the marketing site. Server component: pulls live Google
 * reviews when a Places API key is configured, otherwise falls back to curated
 * featured reviews. Always shows the "leave a review" platform buttons so people
 * can post to Google, Facebook, or Zillow even before any reviews exist.
 *
 * @param variant "full" for the standalone /reviews page (more reviews, heading),
 *                "compact" for an embedded teaser on the welcome page.
 */
export async function ReviewsSection({ variant = "full" }: { variant?: "full" | "compact" }) {
  const live = await fetchGoogleReviews();

  // Prefer live Google reviews; fall back to curated featured ones.
  const reviews: Review[] = live?.reviews?.length ? live.reviews : FEATURED_REVIEWS;
  const shown = variant === "compact" ? reviews.slice(0, 3) : reviews.slice(0, 6);

  const rating = live?.rating ?? AGGREGATE?.rating ?? null;
  const total = live?.total ?? AGGREGATE?.count ?? null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-brand-plum">What people are saying</h2>
        {rating != null ? (
          <p className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
            <Stars rating={rating} />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            {total != null && <span>· {total} reviews</span>}
          </p>
        ) : (
          <p className="mt-2 text-muted-foreground">
            We&apos;d love your feedback — share your experience on Google, Facebook, or Zillow.
          </p>
        )}
      </div>

      {shown.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r, i) => (
            <ReviewCard key={`${r.author}-${i}`} review={r} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <PlatformButtons />
      </div>
    </section>
  );
}
