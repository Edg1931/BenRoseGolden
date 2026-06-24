import type { Program } from "../schema";

/**
 * A ProgramSource yields curated/external program records. The matching engine
 * depends only on this interface, so adding the Down Payment Resource API later
 * is a matter of registering another source — no engine or schema changes.
 */
export interface ProgramSource {
  readonly id: "curated" | "dpr" | "supabase";
  readonly enabled: boolean;
  load(): Promise<Program[]>;
}

import { curatedSource } from "./curated";
import { dprSource } from "./dpr";
import { supabaseSource } from "./supabase";

// Order = precedence: the first source to write an id wins. Supabase (live,
// staff-curated) overrides the static seed, which overrides the DPR adapter.
const SOURCES: ProgramSource[] = [supabaseSource, curatedSource, dprSource];

/** Load and merge programs from every enabled source, de-duped by id. */
export async function loadAllPrograms(): Promise<Program[]> {
  const results = await Promise.all(
    SOURCES.filter((s) => s.enabled).map((s) => s.load()),
  );
  const byId = new Map<string, Program>();
  for (const list of results) {
    for (const program of list) {
      // First write wins; SOURCES order gives Supabase precedence over seed.
      if (!byId.has(program.id)) byId.set(program.id, program);
    }
  }
  return [...byId.values()];
}
