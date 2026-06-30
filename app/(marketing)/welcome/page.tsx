import seed from "@/data/programs.seed.json";
import { WelcomeContent } from "@/components/marketing/welcome-content";

export const metadata = {
  title: "Benjamin Rose Housing — Free help to buy, keep, and afford your home",
  description:
    "Free HUD-approved homebuyer education, foreclosure prevention, and credit coaching in Ohio — in your language and the format that works for you.",
};

/** Live numbers from the curated Ohio assistance dataset, so the page's proof
 *  points stay current as the dataset grows. */
interface SeedProgram {
  requiresHomebuyerEd?: boolean;
  amountStructured?: { maxDollar?: number | null } | null;
}
const programs = (seed as unknown as { programs: SeedProgram[] }).programs;
const PROGRAM_COUNT = programs.length;
const MAX_ASSISTANCE = programs.reduce((mx, p) => {
  const v = p.amountStructured?.maxDollar;
  return typeof v === "number" && v > mx && v < 300000 ? v : mx;
}, 0);
const ED_REQUIRED = programs.filter((p) => p.requiresHomebuyerEd).length;

export default function WelcomePage() {
  return (
    <WelcomeContent
      programCount={PROGRAM_COUNT}
      maxAssistance={MAX_ASSISTANCE}
      edRequired={ED_REQUIRED}
    />
  );
}
