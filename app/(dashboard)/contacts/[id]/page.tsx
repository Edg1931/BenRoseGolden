import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getParticipant } from "@/lib/participants/repository";
import { loadAllPrograms } from "@/lib/programs/sources";
import {
  matchedPrograms,
  phaseProgress,
  recommendations,
} from "@/lib/participants/eligibility";
import {
  CONTENT_FORMAT_LABELS,
  LANGUAGE_LABELS,
  MODULES,
  TRACK_LABELS,
  getModule,
} from "@/lib/participants/curriculum";
import { CREDIT_BAND_LABELS, STAGE_LABELS } from "@/lib/participants/schema";
import { assistanceTypeLabel } from "@/lib/programs/matching";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const p = await getParticipant(user, id);
  if (!p) notFound();

  const programs = await loadAllPrograms();
  const phases = phaseProgress(p);
  const matches = matchedPrograms(p, programs);
  const recs = recommendations(p, programs);
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const completedById = new Map(p.moduleProgress.map((m) => [m.moduleId, m]));

  const recTone = { high: "rose", medium: "gold", low: "muted" } as const;

  return (
    <div className="space-y-6">
      <Link href="/contacts" className="text-sm text-muted-foreground hover:underline">
        ← Back to clients
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
            <Badge variant={p.stage === "graduated" || p.stage === "referred" ? "success" : "gold"}>
              {STAGE_LABELS[p.stage]}
            </Badge>
            <Badge variant={p.org === "benjamin-rose" ? "rose" : "gold"}>
              {p.org === "benjamin-rose" ? "Benjamin Rose" : "ESOP"}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {p.email && <span>✉️ {p.email}</span>}
            {p.phone && <span>📞 {p.phone}</span>}
            {p.address?.city && <span>📍 {p.address.city}, {p.address.state ?? "OH"}</span>}
            <span>🗣️ {LANGUAGE_LABELS[p.preferredLanguage]}</span>
          </div>
          {p.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Next best actions */}
          {recs.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recommended next steps
              </h2>
              <div className="space-y-2">
                {recs.map((r, i) => (
                  <Card key={i} className="flex items-start gap-3 p-3">
                    <Badge variant={recTone[r.priority]}>{r.priority}</Badge>
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-sm text-muted-foreground">{r.detail}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum progress */}
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Program progress
            </h2>
            <div className="space-y-3">
              {phases.map((phase) => {
                const mods = MODULES.filter((m) => m.phase === phase.phaseId);
                return (
                  <Card key={phase.phaseId} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">{phase.name}</div>
                      <span className="text-xs text-muted-foreground">
                        {phase.completed}/{phase.total} modules
                      </span>
                    </div>
                    <ProgressBar
                      value={phase.percent}
                      tone={phase.percent === 100 ? "emerald" : "gold"}
                    />
                    <ul className="mt-3 space-y-1">
                      {mods.map((m) => {
                        const mp = completedById.get(m.id);
                        const done = mp?.status === "completed";
                        const inProg = mp?.status === "in-progress";
                        return (
                          <li key={m.id} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span>{done ? "✅" : inProg ? "🟡" : "⬜"}</span>
                              <span className={done ? "" : "text-muted-foreground"}>{m.name}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {mp?.score != null && <span className="mr-2">Score {mp.score}</span>}
                              {mp?.completedDate && formatDate(mp.completedDate)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Communications */}
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Communication history
            </h2>
            <Card className="p-4">
              {p.communications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No communications logged yet.</p>
              ) : (
                <ol className="space-y-3">
                  {[...p.communications]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((c) => (
                      <li key={c.id} className="border-l-2 border-border pl-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="muted">{c.channel}</Badge>
                          <span>{formatDate(c.date)}</span>
                          {c.byUser && <span>· {c.byUser}</span>}
                        </div>
                        {c.subject && <div className="text-sm font-medium">{c.subject}</div>}
                        {c.body && <div className="text-sm text-foreground/80">{c.body}</div>}
                      </li>
                    ))}
                </ol>
              )}
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eligibility snapshot */}
          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Eligibility snapshot</h3>
            <Row label="Household size" value={p.household.size ?? "—"} />
            <Row
              label="Annual income"
              value={p.household.annualIncome ? `$${p.household.annualIncome.toLocaleString()}` : "—"}
            />
            <Row label="% of AMI" value={p.household.amiPercent ? `${p.household.amiPercent}%` : "—"} />
            <Row label="Credit" value={CREDIT_BAND_LABELS[p.household.creditBand]} />
            <Row label="First-time buyer" value={p.household.firstTimeBuyer == null ? "—" : p.household.firstTimeBuyer ? "Yes" : "No"} />
            {p.tracks.length > 0 && (
              <div className="pt-1">
                <div className="text-xs text-muted-foreground">Needs</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.tracks.map((t) => <Badge key={t} variant="muted">{TRACK_LABELS[t]}</Badge>)}
                </div>
              </div>
            )}
          </Card>

          {/* Assistance they qualify for */}
          <Card className="space-y-3 p-4">
            <h3 className="text-sm font-semibold">Assistance they may qualify for</h3>
            {matches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No matches yet — add location, income, and credit to surface programs.
              </p>
            ) : (
              matches.slice(0, 4).map((m) => (
                <div key={m.program.id} className="rounded-md border border-border p-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{m.program.name}</span>
                    {m.unlockedByCertificate && <Badge variant="success">🎓 unlocked</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{assistanceTypeLabel(m.program)} · {m.program.amount}</div>
                  {m.reasons.length > 0 && (
                    <div className="mt-1 text-xs text-emerald-700">You qualify because {m.reasons.slice(0, 2).join(", and ")}.</div>
                  )}
                  <a href={m.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-blue-600 underline">
                    Program details
                  </a>
                </div>
              ))
            )}
          </Card>

          {/* Certificates */}
          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Certificates</h3>
            {p.certificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">None yet.</p>
            ) : (
              p.certificates.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>🎓 {c.name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(c.issuedDate)}</span>
                </div>
              ))
            )}
          </Card>

          {/* Delivery preferences */}
          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">How they want content</h3>
            <Row label="Language" value={LANGUAGE_LABELS[p.preferredLanguage]} />
            <div>
              <div className="text-xs text-muted-foreground">Preferred formats</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {p.preferredFormats.length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  p.preferredFormats.map((f) => <Badge key={f} variant="gold">{CONTENT_FORMAT_LABELS[f]}</Badge>)
                )}
              </div>
            </div>
          </Card>

          {/* Sharing / referral */}
          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Sharing & referral</h3>
            <Row label="Consent to share" value={p.consentToShare ? `Yes (${formatDate(p.consentDate)})` : "Not yet"} />
            <Row label="Referred to agent" value={p.referralId ? "Yes" : "No"} />
            {!p.consentToShare && (
              <p className="text-xs text-muted-foreground">
                Consent is required before contact info is shared with The Golden Group.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
