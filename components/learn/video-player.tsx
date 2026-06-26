"use client";

import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import type { LearnLang } from "@/lib/learn/content";

/**
 * Per-day "Watch" experience. When a day has a `video` set in the course
 * registry (lib/learn/course.ts) — a YouTube/Vimeo link or a self-hosted file
 * like "/videos/day-1.mp4" — it embeds it. Until then it shows a friendly
 * placeholder so the option is visible and a teaching video can be dropped in
 * with a one-line edit.
 */
function toEmbed(url: string): { kind: "iframe" | "file"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { kind: "file", src: url };
  return { kind: "iframe", src: url };
}

export function VideoPlayer({
  video,
  dayTitle,
  lang,
}: {
  video?: string;
  dayTitle?: string;
  lang: LearnLang;
}) {
  const t = (k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k;

  if (!video) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <div>
            <h2 className="font-semibold leading-tight">{t("videoTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("videoIntro")}</p>
          </div>
        </div>
        <div className="mt-4 flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 text-center">
          <span className="text-5xl opacity-40">▶</span>
          <p className="mt-3 px-6 font-medium text-muted-foreground">{t("videoComingSoon")}</p>
          {dayTitle && <p className="mt-1 px-6 text-sm text-muted-foreground">{dayTitle}</p>}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">{t("videoFallback")}</p>
      </Card>
    );
  }

  const embed = toEmbed(video);
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎬</span>
        <div>
          <h2 className="font-semibold leading-tight">{t("videoTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("videoIntro")}</p>
        </div>
      </div>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
        {embed.kind === "file" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={embed.src} controls className="h-full w-full" />
        ) : (
          <iframe
            src={embed.src}
            title={dayTitle ?? "Class video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Card>
  );
}
