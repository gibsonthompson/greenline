import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAdminClient } from "./supabase-admin";

/* ============================================================================
   PIN AUTHENTICATION

   The admin ships with a seeded default PIN so the first login needs no setup
   step. Enter it, then change it in Settings. Once a custom PIN is saved the
   default stops working.

   Multiple PINs can be active at once: the owner can add a second PIN from
   Settings (for example one for themselves and one for a helper) without
   removing the existing one. A login succeeds if the entered PIN matches any
   active PIN.

   Every PIN is scrypt-hashed with its own per-PIN salt and never stored in
   plain text. Defences against brute force: failed attempts are counted in the
   database and the login locks for 15 minutes after 5 misses, and the session
   cookie is HMAC-signed, httpOnly and sameSite=lax. The login route adds a
   per-IP throttle on top, which also guards the seeded default before any row
   exists.
   ============================================================================ */

// Seeded starting PIN. Active until a custom PIN is saved from Settings.
const DEFAULT_PIN = "135791";

const COOKIE = "gl_admin";
const SESSION_HOURS = 12;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MIN = 15;
const MAX_PINS = 5;

function secret(): string {
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

type PinEntry = { hash: string; salt: string; label: string };
type AuthRow = { pins: PinEntry[]; failed_attempts: number; locked_until: string | null };

// The old single-PIN shape, still present on installs created before the
// multi-PIN change. Read and upgraded on the fly.
type LegacyAuthRow = { pin_hash: string; pin_salt: string; failed_attempts: number; locked_until: string | null };

function normalize(raw: unknown): AuthRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.pins)) {
    return {
      pins: r.pins as PinEntry[],
      failed_attempts: Number(r.failed_attempts) || 0,
      locked_until: (r.locked_until as string | null) ?? null,
    };
  }
  // Legacy single-PIN record: wrap the one hash into the new list shape.
  if (typeof r.pin_hash === "string" && typeof r.pin_salt === "string") {
    const legacy = r as unknown as LegacyAuthRow;
    return {
      pins: [{ hash: legacy.pin_hash, salt: legacy.pin_salt, label: "PIN" }],
      failed_attempts: Number(legacy.failed_attempts) || 0,
      locked_until: legacy.locked_until ?? null,
    };
  }
  return null;
}

async function getAuthRow(): Promise<AuthRow | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin
    .from("gl_settings").select("value").eq("key", "admin_pin").maybeSingle();
  return normalize(data?.value);
}

async function putAuthRow(row: AuthRow) {
  const admin = getAdminClient();
  if (!admin) return;
  await admin.from("gl_settings").upsert(
    { key: "admin_pin", value: row, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
}

function validatePinFormat(pin: string): string | null {
  if (!/^\d{4,10}$/.test(pin)) return "PIN must be 4 to 10 digits.";
  if (/^(\d)\1+$/.test(pin)) return "PIN cannot be the same digit repeated.";
  if ("0123456789".includes(pin) || "9876543210".includes(pin)) return "PIN cannot be sequential digits.";
  return null;
}

/** Always true: there is always a usable PIN, the seeded default or a custom
 *  one, so the login screen shows PIN entry rather than a first-run setup. */
export async function pinIsSet(): Promise<boolean> {
  return true;
}

/** Replace all PINs with a single new one. Used for the first custom PIN and
 *  for a full reset. */
export async function setPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  const bad = validatePinFormat(pin);
  if (bad) return { ok: false, error: bad };
  const salt = randomBytes(16).toString("hex");
  await putAuthRow({
    pins: [{ hash: hashPin(pin, salt), salt, label: "PIN" }],
    failed_attempts: 0,
    locked_until: null,
  });
  return { ok: true };
}

/** Change flow: verify the current PIN, then replace all PINs with the new
 *  one. This preserves the original single-PIN behaviour. */
export async function changePin(currentPin: string, newPin: string): Promise<{ ok: boolean; error?: string }> {
  const row = await getAuthRow();
  if (row) {
    const matches = row.pins.some((p) => safeEq(hashPin(currentPin, p.salt), p.hash));
    if (!matches) return { ok: false, error: "Current PIN is incorrect." };
  } else {
    if (!safeEq(currentPin, DEFAULT_PIN)) return { ok: false, error: "Current PIN is incorrect." };
  }
  return setPin(newPin);
}

/** Add an additional PIN without removing existing ones. Requires a valid
 *  existing PIN (or the seeded default, if no custom PIN exists yet). Both the
 *  old and the new PIN work afterwards. */
export async function addPin(
  currentPin: string,
  newPin: string,
  label = "PIN"
): Promise<{ ok: boolean; error?: string }> {
  const bad = validatePinFormat(newPin);
  if (bad) return { ok: false, error: bad };

  let row = await getAuthRow();

  // No custom PIN yet: the seeded default must authorize the add, and it
  // becomes the first stored PIN so it keeps working alongside the new one.
  if (!row) {
    if (!safeEq(currentPin, DEFAULT_PIN)) return { ok: false, error: "Current PIN is incorrect." };
    const dSalt = randomBytes(16).toString("hex");
    row = {
      pins: [{ hash: hashPin(DEFAULT_PIN, dSalt), salt: dSalt, label: "PIN" }],
      failed_attempts: 0,
      locked_until: null,
    };
  } else {
    const authorized = row.pins.some((p) => safeEq(hashPin(currentPin, p.salt), p.hash));
    if (!authorized) return { ok: false, error: "Current PIN is incorrect." };
  }

  if (row.pins.length >= MAX_PINS) {
    return { ok: false, error: `You can have at most ${MAX_PINS} PINs.` };
  }
  // Reject a PIN that already exists so both entries do not collide.
  if (row.pins.some((p) => safeEq(hashPin(newPin, p.salt), p.hash))) {
    return { ok: false, error: "That PIN is already in use." };
  }

  const salt = randomBytes(16).toString("hex");
  row.pins.push({ hash: hashPin(newPin, salt), salt, label: label.slice(0, 40) || "PIN" });
  await putAuthRow({ ...row, failed_attempts: 0, locked_until: null });
  return { ok: true };
}

/** How many PINs are currently active. Used by Settings to show the count. */
export async function pinCount(): Promise<number> {
  const row = await getAuthRow();
  if (!row) return 1; // seeded default
  return row.pins.length;
}

/* --------------------------------------------------------------- sign in */

export async function verifyPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  const row = await getAuthRow();

  // No custom PIN saved yet: the seeded default is the only valid PIN. The
  // per-IP throttle in the login route guards this path against brute force.
  if (!row) {
    if (safeEq(pin, DEFAULT_PIN)) return { ok: true };
    return { ok: false, error: "Incorrect PIN." };
  }

  if (row.locked_until && new Date(row.locked_until) > new Date()) {
    const mins = Math.ceil((new Date(row.locked_until).getTime() - Date.now()) / 60000);
    return { ok: false, error: `Too many attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.` };
  }

  const matches = row.pins.some((p) => safeEq(hashPin(pin, p.salt), p.hash));
  if (matches) {
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
