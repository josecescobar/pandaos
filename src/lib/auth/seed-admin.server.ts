import { getSql } from "@/lib/db";

const ADMIN_EMAIL = "admin@pandaos.ai";
const ADMIN_NAME = "admin";
const ADMIN_PASSWORD = "admin123";

const OPS_EMAIL = "ops@pandaos.ai";
const OPS_NAME = "ops";
const OPS_PASSWORD = "ops12345";

let seedPromise: Promise<void> | null = null;

async function ensureUser(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  const sql = await getSql();
  const existing = await sql<{ id: string }>`
    select id from "user" where email = ${email} limit 1
  `;
  if (existing.length > 0) return;

  const { auth } = await import("@/lib/auth/server");
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (err) {
    const again = await sql<{ id: string }>`
      select id from "user" where email = ${email} limit 1
    `;
    if (again.length === 0) {
      console.error(`[pandaos] failed to seed user ${email}:`, err);
      throw err;
    }
  }
}

/**
 * Ensures default accounts exist. Idempotent.
 * - admin / admin123
 * - ops / ops123 (second team member for multi-user testing)
 */
export async function ensureAdminUser(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      await ensureUser(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME);
      await ensureUser(OPS_EMAIL, OPS_PASSWORD, OPS_NAME);
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  await seedPromise;
}

/** Map a login identifier (username or email) to the account email. */
export function resolveLoginEmail(identifier: string): string {
  const raw = identifier.trim().toLowerCase();
  if (!raw) return raw;
  if (raw === "admin") return ADMIN_EMAIL;
  if (raw === "ops") return OPS_EMAIL;
  if (!raw.includes("@")) return `${raw}@pandaos.ai`;
  return raw;
}
