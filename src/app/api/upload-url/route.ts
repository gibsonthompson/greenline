import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminClient } from "@/lib/supabase-admin";
import { allow } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Signed direct-to-storage upload. The photo never passes through a serverless
// function body. The bucket "lead-photos" must exist and be PRIVATE in Supabase
// Storage; if it does not, createSignedUploadUrl returns an error and this route
// surfaces the message instead of a blank 500.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await allow("upload", ip, 40, 60))) return NextResponse.json({ error: "rate" }, { status: 429 });

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
  const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safe}`;

  try {
    const { data, error } = await admin.storage.from("lead-photos").createSignedUploadUrl(path);
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Could not create upload URL. Does the lead-photos bucket exist?" },
        { status: 500 }
      );
    }
    return NextResponse.json({ uploadUrl: data.signedUrl, token: data.token, storagePath: path });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "storage error" },
      { status: 500 }
    );
  }
}
