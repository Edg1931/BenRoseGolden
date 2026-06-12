import { NextResponse } from "next/server";
import { z } from "zod";
import { createParticipant } from "@/lib/participants/repository";
import { LANGUAGES } from "@/lib/participants/curriculum";
import type { AuthUser } from "@/lib/auth/roles";

/**
 * PUBLIC endpoint — newsletter signup from the marketing landing page.
 * Captures the lead straight into the CRM as a Benjamin Rose lead (source=web).
 * Intentionally unauthenticated; we act as a system BR user to write the lead.
 */

const signupSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).optional(),
  email: z.string().email(),
  language: z.enum(LANGUAGES).optional(),
  interest: z.string().optional(),
});

const SYSTEM_BR_USER: AuthUser = {
  id: "system-newsletter",
  email: "system@benrosegolden.local",
  role: "benjamin-rose",
  org: "benjamin-rose",
};

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.parse(await request.json());
    await createParticipant(SYSTEM_BR_USER, {
      org: "benjamin-rose",
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
      preferredLanguage: parsed.language ?? "en",
      preferredFormats: [],
      contactChannels: ["email"],
      doNotContact: false,
      household: { creditBand: "unknown" },
      tracks: [],
      stage: "lead",
      moduleProgress: [],
      certificates: [],
      communications: [],
      tags: ["newsletter", ...(parsed.interest ? [parsed.interest] : [])],
      source: "web",
      consentToShare: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed" },
      { status: 400 },
    );
  }
}
