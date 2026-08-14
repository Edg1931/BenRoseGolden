import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import {
  ARTICLE_TOPICS,
  findArticles,
  type ArticleTopic,
} from "@/lib/content/articles";

export const maxDuration = 120;

/**
 * POST /api/content/articles — research current articles for the newsletter.
 * AI web search when configured; curated real links otherwise. Staff only.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const topics: ArticleTopic[] = Array.isArray(body?.topics)
      ? body.topics.filter((t: string): t is ArticleTopic =>
          (ARTICLE_TOPICS as readonly string[]).includes(t),
        )
      : [];
    const query = typeof body?.query === "string" ? body.query.slice(0, 200) : undefined;
    const result = await findArticles(topics, query);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Article search failed" },
      { status: 500 },
    );
  }
}
