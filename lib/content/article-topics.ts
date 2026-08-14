/**
 * Newsletter article topic areas — the audiences Benjamin Rose serves.
 * Kept SDK-free so client components can import the chips without pulling the
 * Anthropic SDK into the browser bundle.
 */

export const ARTICLE_TOPICS = [
  "cleveland-homebuying",
  "first-time-buyer",
  "credit-repair",
  "fha-counseling",
  "assistance-programs",
  "seniors-families",
] as const;
export type ArticleTopic = (typeof ARTICLE_TOPICS)[number];

export const ARTICLE_TOPIC_LABELS: Record<ArticleTopic, string> = {
  "cleveland-homebuying": "Homebuying in Cleveland",
  "first-time-buyer": "First-time buyers",
  "credit-repair": "Credit repair",
  "fha-counseling": "FHA & housing counseling",
  "assistance-programs": "Assistance programs",
  "seniors-families": "Seniors & families",
};

