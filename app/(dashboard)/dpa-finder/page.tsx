import { loadAllPrograms } from "@/lib/programs/sources";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSISTANCE_TYPE_LABELS } from "@/lib/programs/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { RefreshPanel } from "@/components/programs/refresh-panel";

export const dynamic = "force-dynamic";

/**
 * Placeholder for Module 2. The schema, curated seed, source adapters, and
 * matching engine are built (lib/programs/*). This page currently lists the
 * curated programs to prove the data pipeline; the buyer questionnaire +
 * ranked "you qualify because…" results are the next milestone.
 */
export default async function DpaFinderPage() {
  const [programs, user] = await Promise.all([loadAllPrograms(), getCurrentUser()]);
  const canManage = isGoldenSide(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Down Payment Assistance &amp; Grant Finder
        </h1>
        <p className="text-sm text-muted-foreground">
          Curated Ohio program database ({programs.length} sample records).
          Buyer questionnaire and ranked matches are the next milestone.
        </p>
      </div>

      {canManage && <RefreshPanel />}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <Card key={p.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight">{p.name}</h3>
              <Badge variant="muted">{p.level}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{p.provider}</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="gold">
                {ASSISTANCE_TYPE_LABELS[p.assistanceType]}
              </Badge>
              {p.requiresHomebuyerEd === true && (
                <Badge variant="success">🎓 Education unlocks</Badge>
              )}
              {p.requiresHomebuyerEd === "verify" && (
                <Badge variant="muted">🎓 Education (verify)</Badge>
              )}
            </div>
            <p className="text-sm">{p.amount}</p>
            <p className="text-xs text-muted-foreground">
              {p.geography.statewide
                ? "Statewide"
                : [...(p.geography.counties ?? []), ...(p.geography.cities ?? [])].join(
                    ", ",
                  )}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
