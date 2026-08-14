import seed from "@/data/programs.seed.json";
import { loadAllPrograms } from "@/lib/programs/sources";
import { WelcomeContent } from "@/components/marketing/welcome-content";

export const metadata = {
  title: "Benjamin Rose Housing — Free help to buy, keep, and afford your home",
  description:
    "Free HUD-approved homebuyer education, foreclosure prevention, and credit coaching in Ohio — in your language and the format that works for you.",
};

// The stats band quotes the program database; refresh hourly so the page keeps
// pace as staff approve newly-researched programs, without going fully dynamic.
export const revalidate = 3600;

interface SeedProgram {
  requiresHomebuyerEd?: boolean | string;
  amountStructured?: { maxDollar?: number | null } | null;
}

/**
 * Proof points from the LIVE program database (Supabase + curated seed via
 * loadAllPrograms), so the front page never understates what staff have
 * approved. The static seed is the safety net if loading ever fails.
 */
async function programStats() {
  let programs: SeedProgram[];
  try {
    programs = (await loadAllPrograms()) as unknown as SeedProgram[];
  } catch {
    programs = (seed as unknown as { programs: SeedProgram[] }).programs;
  }
  const maxAssistance = programs.reduce((mx, p) => {
    const v = p.amountStructured?.maxDollar;
    return typeof v === "number" && v > mx && v < 300000 ? v : mx;
  }, 0);
  return {
    programCount: programs.length,
    maxAssistance,
    edRequired: programs.filter((p) => p.requiresHomebuyerEd === true).length,
  };
}

export default async function WelcomePage() {
  const { programCount, maxAssistance, edRequired } = await programStats();
  return (
    <WelcomeContent
      programCount={programCount}
      maxAssistance={maxAssistance}
      edRequired={edRequired}
    />
  );
}
