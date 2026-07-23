import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 40;
}

// Signed direct-to-storage upload. The photo never passes through a
// serverless function body (spec 8.3 step 7). Bucket stays private.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate" }, { status: 429 });

  let body: { filename?: string; contentType?: string; bytes?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!body.contentType?.startsWith("image/") || (body.bytes ?? 0) > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "images under 8MB only" }, { status: 400 });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const safe = (body.filename ?? "photo.jpg").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safe}`;

  const { data, error } = await admin.storage
    .from("lead-photos")
    .createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: "storage" }, { status: 500 });

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    token: data.token,
    storagePath: path,
  });
}
