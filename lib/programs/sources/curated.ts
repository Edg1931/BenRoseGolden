import seed from "@/data/programs.seed.json";
import { programsFileSchema, type Program } from "../schema";
import type { ProgramSource } from "./index";

/** Curated Ohio program database, validated against the schema at load time. */
export const curatedSource: ProgramSource = {
  id: "curated",
  enabled: true,
  async load(): Promise<Program[]> {
    const parsed = programsFileSchema.parse(seed);
    return parsed.programs;
  },
};
