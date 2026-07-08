import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  createLenderSchema,
  lenderSchema,
  updateLenderSchema,
  type CreateLenderInput,
  type Lender,
  type UpdateLenderInput,
} from "./schema";
import { seedLenders } from "./seed";

/**
 * Data access for preferred lenders. Supabase-backed when configured, else an
 * in-memory seed for local/demo. Lenders are shared across staff (not org-scoped).
 */
const memory: Lender[] = seedLenders.map((l) => ({ ...l }));

export async function listLenders(): Promise<Lender[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("lenders").select("*").order("lastUpdated", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => lenderSchema.parse(row));
  }
  return [...memory].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export async function getLender(id: string): Promise<Lender | null> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("lenders").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? lenderSchema.parse(data) : null;
  }
  return memory.find((l) => l.id === id) ?? null;
}

function build(input: CreateLenderInput): Lender {
  const parsed = createLenderSchema.parse(input);
  const now = new Date().toISOString();
  return lenderSchema.parse({ ...parsed, id: randomUUID(), dateAdded: parsed.dateAdded ?? now, lastUpdated: now });
}

export async function createLender(input: CreateLenderInput): Promise<Lender> {
  const lender = build(input);
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("lenders").insert(lender).select("*").single();
    if (error) throw error;
    return lenderSchema.parse(data);
  }
  memory.unshift(lender);
  return lender;
}

export async function updateLender(id: string, input: UpdateLenderInput): Promise<Lender> {
  const existing = await getLender(id);
  if (!existing) throw new Error("Lender not found");
  const patch = updateLenderSchema.parse(input);
  const next = lenderSchema.parse({ ...existing, ...patch, id: existing.id, dateAdded: existing.dateAdded, lastUpdated: new Date().toISOString() });
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("lenders").update(next).eq("id", id).select("*").single();
    if (error) throw error;
    return lenderSchema.parse(data);
  }
  const idx = memory.findIndex((l) => l.id === id);
  if (idx >= 0) memory[idx] = next;
  return next;
}

/** Active lenders that serve a given language — the client↔lender language match. */
export async function lendersForLanguage(language: string): Promise<Lender[]> {
  const all = await listLenders();
  return all.filter((l) => l.active && l.languages.includes(language as never));
}
