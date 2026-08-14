import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentLearner } from "@/lib/learn/accounts";
import { buildTranscript, certificateId } from "@/lib/learn/transcript";
import { PrintButton } from "@/components/learn/print-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Certificate — Benjamin Rose Housing",
};

/**
 * The learner's Certificate of Completion for pre-purchase homebuyer education
 * — the document assistance programs ask to see. Print/save to PDF from the
 * browser; the learner shell hides its header and footer when printing.
 */
export default async function CertificatePage() {
  const learner = await getCurrentLearner();
  if (!learner) redirect("/learn/start");

  const t = buildTranscript(learner);
  if (!t.graduated) redirect("/learn/profile");

  const fullName = [learner.firstName, learner.lastName].filter(Boolean).join(" ");
  const hours = Math.round(t.minutesCompleted / 60);
  const id = certificateId(learner);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/learn/profile" className="text-sm text-muted-foreground hover:underline">
          ← Back to your profile
        </Link>
        <PrintButton />
      </div>

      {/* The certificate itself */}
      <article className="mt-6 border-[6px] border-double border-brand-gold bg-white px-8 py-12 text-center shadow-sm print:mt-0 print:border-4 print:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-rose">
          Benjamin Rose Housing
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">
          Certificate of Completion
        </h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
          Pre-Purchase Homebuyer Education
        </p>

        <p className="mt-8 text-sm text-muted-foreground">This certifies that</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{fullName}</p>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/90">
          has successfully completed all {t.totalDays} classes of the Benjamin Rose pre-purchase
          homebuyer education course, covering money management and credit, obtaining a mortgage and
          borrower rights, shopping for a home and inspections, and the closing process —
          approximately {hours} hours of instruction.
        </p>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-6 text-sm">
          <div className="border-t border-border pt-2">
            <div className="font-medium text-foreground">{formatDate(t.graduationDate!)}</div>
            <div className="text-xs text-muted-foreground">Date completed</div>
          </div>
          <div className="border-t border-border pt-2">
            <div className="font-mono font-medium text-foreground">{id}</div>
            <div className="text-xs text-muted-foreground">Certificate ID</div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Issued by Benjamin Rose Housing · Verify this certificate by contacting your housing
          counselor and quoting the certificate ID.
        </p>
      </article>

      <div className="mt-6 rounded-xl border border-border bg-white p-5 print:hidden">
        <h2 className="font-semibold text-brand-plum">What to do with this</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
          <li>• Save or print it — most down-payment-assistance programs ask for it by name.</li>
          <li>• Attach it to your assistance applications along with your income documents.</li>
          <li>
            •{" "}
            <Link href="/assistance" className="font-medium text-brand-rose hover:underline">
              See which programs it just unlocked for you →
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
