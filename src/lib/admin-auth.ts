import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAdminClient } from "./supabase-admin";

/* ============================================================================
   PIN AUTHENTICATION

   Replaces Supabase Auth so there is no email verification step. The PIN is
   scrypt-hashed with a per-install salt and never stored in plain text.

   A PIN is short, so brute force is the real threat. Two defences:
     1. failed attempts are counted in the database and the login locks for
        15 minutes after 5 misses
     2. the session cookie is HMAC-signed, httpOnly and sameSite=lax

   Use 6 digits. Four digits is 10,000 combinations, which a lockout makes
   survivable but not comfortable.
   ============================================================================ */

const COOKIE = "gl_admin";
const SESSION_HOURS = 12;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MIN = 15;

function secret(): string {
  // Falls back to the service role key so the app still works before
  // ADMIN_SESSION_SECRET is set. Set it properly in production.
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "insecure-dev-secret";
}

function hashPin(pin: string, salt: string): string {
  return scryptSync(pin, salt, 32).toString("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEq(a: string, b: string): boolean {
  const x = Buffer.from(a.padEnd(128).slice(0, 128));
  const y = Buffer.from(b.padEnd(128).slice(0, 128));
  return timingSafeEqual(x, y);
}

/* ------------------------------------------------------------- PIN record */

type AuthRow = { pin_hash: string; pin_salt: string; failed_attempts: number; locked_until: string | null };

async function getAuthRow(): Promise<AuthRow | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin
    .from("gl_settings").select("value").eq("key", "admin_pin").maybeSingle();
  return (data?.value as AuthRow) ?? null;
}

async function putAuthRow(row: AuthRow) {
  const admin = getAdminClient();
  if (!admin) return;
  await admin.from("gl_settings").upsert(
    { key: "admin_pin", value: row, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
}

/** True when no PIN has been set yet, so the UI can offer first-run setup. */
export async function pinIsSet(): Promise<boolean> {
  return Boolean(await getAuthRow());
}

export async function setPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^\d{4,10}$/.test(pin)) return { ok: false, error: "PIN must be 4 to 10 digits." };
  if (/^(\d)\1+$/.test(pin)) return { ok: false, error: "PIN cannot be the same digit repeated." };
  if ("0123456789".includes(pin) || "9876543210".includes(pin))
    return { ok: false, error: "PIN cannot be sequential digits." };
  const salt = randomBytes(16).toString("hex");
  await putAuthRow({ pin_hash: hashPin(pin, salt), pin_salt: salt, failed_attempts: 0, locked_until: null });
  return { ok: true };
}

export async function changePin(currentPin: string, newPin: string): Promise<{ ok: boolean; error?: string }> {
  const row = await getAuthRow();
  if (row) {
    if (!safeEq(hashPin(currentPin, row.pin_salt), row.pin_hash)) {
      return { ok: false, error: "Current PIN is incorrect." };
    }
  }
  return setPin(newPin);
}

/* --------------------------------------------------------------- sign in */

export async function verifyPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  const row = await getAuthRow();
  if (!row) return { ok: false, error: "No PIN has been set yet." };

  if (row.locked_until && new Date(row.locked_until) > new Date()) {
    const mins = Math.ceil((new Date(row.locked_until).getTime() - Date.now()) / 60000);
    return { ok: false, error: `Too many attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.` };
  }

  if (safeEq(hashPin(pin, row.pin_salt), row.pin_hash)) {
    await putAuthRow({ ...row, failed_attempts: 0, locked_until: null });
    return { ok: true };
  }

  const failed = (row.failed_attempts ?? 0) + 1;
  const locked = failed >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MIN * 60000).toISOString() : null;
  await putAuthRow({ ...row, failed_attempts: locked ? 0 : failed, locked_until: locked });

  return {
    ok: false,
    error: locked
      ? `Too many attempts. Locked for ${LOCKOUT_MIN} minutes.`
      : `Incorrect PIN. ${MAX_ATTEMPTS - failed} attempt${MAX_ATTEMPTS - failed === 1 ? "" : "s"} left.`,
  };
}

/* --------------------------------------------------------------- session */

export function makeToken(): string {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = `${expires}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function tokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, sig] = parts;
  if (!safeEq(sign(`${expires}.${nonce}`), sig)) return false;
  return Number(expires) > Date.now();
}

export async function startSession() {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isSignedIn(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;
