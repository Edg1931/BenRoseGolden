"use client";

import Link from "next/link";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { useLang } from "@/components/i18n/lang-provider";
import { t } from "@/lib/i18n/public";

/** Translated homepage body. Numbers come from the program dataset (server). */
export interface LiveSession {
  date: string;
  time: string;
  format: "in-person" | "virtual";
  location?: string;
  registerUrl: string;
}

export function WelcomeContent({
  programCount,
  maxAssistance,
  edRequired,
  sessions = [],
}: {
  programCount: number;
  maxAssistance: number;
  edRequired: number;
  sessions?: LiveSession[];
}) {
  const { lang } = useLang();
  const locale = lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US";
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const sessionDate = (iso: string) => {
    const d = new Date(`${iso}T12:00:00Z`);
    return {
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(d),
      day: new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" }).format(d),
      month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(d),
    };
  };

  const stats = [
    { value: `${programCount}+`, label: t(lang, "statPrograms") },
    { value: money.format(maxAssistance), label: t(lang, "statHelp") },
    { value: `${edRequired}`, label: t(lang, "statEdRequired") },
    { value: "1908", label: t(lang, "stat1908") },
  ];
  const steps = [
    { n: "1", icon: "📖", title: t(lang, "step1Title"), body: t(lang, "step1Body") },
    { n: "2", icon: "🎓", title: t(lang, "step2Title"), body: t(lang, "step2Body") },
    { n: "3", icon: "🏡", title: t(lang, "step3Title"), body: t(lang, "step3Body") },
  ];
  const benefits = [
    { icon: "🎓", title: t(lang, "benefit1Title"), body: t(lang, "benefit1Body") },
    { icon: "🛟", title: t(lang, "benefit2Title"), body: t(lang, "benefit2Body") },
    { icon: "📈", title: t(lang, "benefit3Title"), body: t(lang, "benefit3Body") },
    { icon: "🤝", title: t(lang, "benefit4Title"), body: t(lang, "benefit4Body") },
  ];
  const tracks = [
    { icon: "🏡", title: t(lang, "track1Title"), body: t(lang, "track1Body") },
    { icon: "⚠️", title: t(lang, "track2Title"), body: t(lang, "track2Body") },
    { icon: "💳", title: t(lang, "track3Title"), body: t(lang, "track3Body") },
  ];
  const formats =
    lang === "es"
      ? ["Clases presenciales", "Audiolibros", "Pódcast interactivo", "Coach de IA", "Guías PDF", "Letra grande"]
      : lang === "ar"
        ? ["دروس حضورية", "كتب صوتية", "بودكاست تفاعلي", "مدرّب ذكاء اصطناعي", "أدلة PDF", "طباعة كبيرة"]
        : ["In-person classes", "Audiobooks", "Interactive podcast", "AI coach", "PDF guides", "Large print"];
  const langs = ["English", "Español", "العربية", "Soomaali", "नेपाली", "Français", "Kiswahili", "中文"];

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-plum via-brand-plum to-brand-rose text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              {t(lang, "heroKicker")}
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">{t(lang, "heroTitle")}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">{t(lang, "heroSub")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/learn" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-plum shadow-sm hover:bg-white/90">
                {t(lang, "heroCtaStart")}
              </Link>
              <Link href="/assistance" className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                {t(lang, "heroCtaSee")}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/15 px-3 py-1">{t(lang, "heroChip1")}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{t(lang, "heroChip2")}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{t(lang, "heroChip3")}</span>
            </div>
          </div>
          <div className="lg:pl-8">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto -mt-12 max-w-6xl px-6">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-5 text-center">
              <div className="font-serif text-3xl font-bold text-brand-rose">{s.value}</div>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">{t(lang, "stepsTitle")}</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-white p-6 shadow-sm">
              <span className="absolute -top-4 start-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-rose font-serif font-bold text-white">
                {s.n}
              </span>
              <div className="mt-2 text-3xl">{s.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/learn" className="inline-block rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum">
            {t(lang, "beginCta")}
          </Link>
        </div>
      </section>

      {/* Live classes — in person or virtual */}
      {sessions.length > 0 && (
        <section className="bg-brand-blush/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">{t(lang, "liveTitle")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">{t(lang, "liveBody")}</p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-4">
              {sessions.map((sess) => {
                const d = sessionDate(sess.date);
                return (
                  <a
                    key={sess.date + sess.format}
                    href={sess.registerUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-5 rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-brand-rose hover:shadow-md"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">{d.weekday}</div>
                      <div className="font-serif text-3xl font-bold leading-none text-brand-plum">{d.day}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-brand-rose">{t(lang, "liveClassTitle")}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sess.format === "in-person" ? "bg-brand-gold/15 text-brand-goldink" : "bg-brand-blush text-brand-roseink"}`}>
                          {sess.format === "in-person" ? `📍 ${t(lang, "liveInPerson")}` : `💻 ${t(lang, "liveVirtual")}`}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{t(lang, "liveFree")}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {d.month} · {sess.time}
                        {sess.location ? ` · ${sess.location}` : ""}
                      </p>
                    </div>
                    <span className="hidden shrink-0 text-sm font-semibold text-brand-rose sm:block">{t(lang, "liveRegister")}</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <a
                href={sessions[0]?.registerUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-medium text-brand-rose hover:underline"
              >
                {t(lang, "liveSeeAll")}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">{t(lang, "benefitsTitle")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-brand-cream p-5">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">{t(lang, "tracksTitle")}</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {tracks.map((tr) => (
            <div key={tr.title} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="text-3xl">{tr.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{tr.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tr.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-plum">{t(lang, "a11yTitle")}</h2>
              <p className="mt-3 text-muted-foreground">{t(lang, "a11yBody")}</p>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(lang, "formatsLabel")}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formats.map((f) => <span key={f} className="rounded-full bg-brand-gold/10 px-3 py-1 text-sm text-brand-goldink">{f}</span>)}
                </div>
              </div>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(lang, "languagesLabel")}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {langs.map((l) => <span key={l} className="rounded-full bg-brand-blush px-3 py-1 text-sm text-brand-roseink">{l}</span>)}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-blush to-brand-gold/10 p-8">
              <h3 className="font-serif text-xl font-bold text-brand-plum">{t(lang, "a11yCardTitle")}</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-plum/90">
                <li className="flex gap-2"><span aria-hidden>🎧</span><span>{t(lang, "a11yCard1")}</span></li>
                <li className="flex gap-2"><span aria-hidden>💬</span><span>{t(lang, "a11yCard2")}</span></li>
                <li className="flex gap-2"><span aria-hidden>📝</span><span>{t(lang, "a11yCard3")}</span></li>
                <li className="flex gap-2"><span aria-hidden>🎓</span><span>{t(lang, "a11yCard4")}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="assistance" className="bg-brand-plum text-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-3xl font-bold">{t(lang, "ctaTitle")}</h2>
          <p className="mt-2 text-white/80">{t(lang, "ctaBody")}</p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
