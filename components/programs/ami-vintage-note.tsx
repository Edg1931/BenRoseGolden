import { AMI_SOURCE_URL, amiDataAge } from "@/lib/programs/ami";

/**
 * Says out loud which year's HUD income limits are deciding eligibility.
 *
 * Income limits are republished every year. A family told "your income is over
 * the limit" deserves to know the figure came from a snapshot, and staff need to
 * know when that snapshot is old enough to re-check before relying on it.
 */
export function AmiVintageNote({ now = new Date() }: { now?: Date }) {
  const age = amiDataAge(now);

  return (
    <p
      className={
        "rounded-md px-3 py-2 text-xs " +
        (age.stale
          ? "border border-brand-gold/40 bg-brand-gold/5 text-brand-goldink"
          : "text-muted-foreground")
      }
    >
      {age.stale ? "⚠ " : ""}
      Income limits are calculated from {age.label}
      {age.stale && (
        <>
          {" "}
          — about {age.yearsBehind} year{age.yearsBehind === 1 ? "" : "s"} behind the current
          publication
        </>
      )}
      . Treat the dollar figures as estimates and confirm against{" "}
      <a
        href={AMI_SOURCE_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="underline hover:no-underline"
      >
        HUD&apos;s current limits
      </a>{" "}
      before an eligibility decision.
    </p>
  );
}
