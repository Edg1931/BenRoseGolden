import type { Participant } from "@/lib/participants/schema";
import {
  CONTENT_FORMAT_LABELS,
  LANGUAGE_LABELS,
} from "@/lib/participants/curriculum";
import type { ContentItem } from "./schema";

/**
 * Pick the right learning asset for a participant. Ranks the content library by
 * how well each item matches their preferred LANGUAGE and FORMAT (the core
 * Benjamin Rose accessibility goal), plus the track/module in focus — so a
 * counselor's "Send content" action surfaces the best fit first.
 */

export interface RankedContent {
  item: ContentItem;
  score: number;
  reasons: string[];
}

export function rankContentForParticipant(
  p: Participant,
  content: ContentItem[],
  opts: { moduleId?: string } = {},
): RankedContent[] {
  return content
    .map((item) => {
      const reasons: string[] = [];
      let score = 0;

      if (item.language === p.preferredLanguage) {
        score += 5;
        reasons.push(`${LANGUAGE_LABELS[item.language]} (their language)`);
      } else if (item.language !== "en") {
        // A non-English asset in the wrong language is a poor fit.
        score -= 3;
      }

      if (p.preferredFormats.includes(item.format)) {
        score += 3;
        reasons.push(`${CONTENT_FORMAT_LABELS[item.format]} (preferred format)`);
      }

      if (item.track && p.tracks.includes(item.track)) {
        score += 2;
        reasons.push("matches their track");
      }

      if (opts.moduleId && item.moduleId === opts.moduleId) {
        score += 4;
        reasons.push("this module");
      }

      return { item, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

/** The participant's best contact channel for a content hand-off. */
export function preferredChannel(
  p: Participant,
): "email" | "sms" | "phone" | "mail" {
  if (p.contactChannels.includes("email") && p.email) return "email";
  for (const c of p.contactChannels) {
    if (c === "sms" || c === "phone" || c === "mail") return c;
  }
  return p.email ? "email" : "phone";
}
