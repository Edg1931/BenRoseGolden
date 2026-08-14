"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { SocialCard } from "@/lib/content/social";

/**
 * Social flyer kit: previews each derived 1080×1080 card and downloads it as a
 * PNG entirely client-side — the card's inline-styled XHTML is wrapped in an
 * SVG foreignObject, drawn to a canvas, and saved. No services, no uploads.
 */
export function SocialKit({ cards, campaignTitle }: { cards: SocialCard[]; campaignTitle: string }) {
  const [note, setNote] = useState<string | null>(null);

  async function download(card: SocialCard) {
    setNote(null);
    try {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><foreignObject width="100%" height="100%">${card.html}</foreignObject></svg>`;
      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not rasterize the flyer."));
      });
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      await loaded;

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable in this browser.");
      ctx.drawImage(img, 0, 0, 1080, 1080);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${card.id}.png`;
      a.click();
    } catch (e) {
      setNote(
        e instanceof Error
          ? `${e.message} Try Chrome or Edge if the download fails.`
          : "Download failed.",
      );
    }
  }

  if (cards.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">📱 Social kit</h2>
          <p className="text-xs text-muted-foreground">
            Square flyers generated from this issue — download as PNG for Instagram or Facebook.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.id} className="space-y-2">
            <div
              className="relative overflow-hidden rounded-lg border border-border"
              style={{ aspectRatio: "1 / 1" }}
            >
              {/* Scale the 1080px card down into its box. */}
              <div className="absolute left-0 top-0 h-[1080px] w-[1080px] origin-top-left" style={{ transform: "scale(var(--s, 0.22))" }}>
                <ScaledCard html={card.html} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <button
                onClick={() => download(card)}
                className="rounded-md border border-input px-2.5 py-1 text-xs font-medium hover:bg-muted"
              >
                ⬇ PNG
              </button>
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-2 text-xs text-amber-700">{note}</p>}
    </Card>
  );
}

/** Renders the card XHTML and scales it to fill the parent square. */
function ScaledCard({ html }: { html: string }) {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        const box = el.parentElement?.parentElement;
        if (!box) return;
        const fit = () => {
          const s = box.clientWidth / 1080;
          el.parentElement!.style.setProperty("--s", String(s));
        };
        fit();
        // Track container resizes so the preview stays crisp on layout changes.
        const ro = new ResizeObserver(fit);
        ro.observe(box);
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
