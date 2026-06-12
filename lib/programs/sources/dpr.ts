import type { Program } from "../schema";
import type { ProgramSource } from "./index";

/**
 * Down Payment Resource (DPR) API adapter — INTEGRATION POINT (not yet active).
 *
 * Enabled only when DPR_API_BASE_URL + DPR_API_KEY are set. When you sign up for
 * DPR, implement `load()` to fetch their programs and map their response into our
 * `Program` schema here. The matching engine and UI need no changes.
 */
export const dprSource: ProgramSource = {
  id: "dpr",
  enabled: Boolean(process.env.DPR_API_BASE_URL && process.env.DPR_API_KEY),
  async load(): Promise<Program[]> {
    if (!this.enabled) return [];
    // TODO: fetch from DPR and map to Program[].
    // const res = await fetch(`${process.env.DPR_API_BASE_URL}/programs?state=OH`, {
    //   headers: { Authorization: `Bearer ${process.env.DPR_API_KEY}` },
    // });
    // return mapDprToPrograms(await res.json());
    return [];
  },
};
