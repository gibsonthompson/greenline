import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";

// Blog-farm calls this after publishing. Constant-time secret compare.
export async function POST(req: NextRequest) {
  let body: { secret?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const expected = process.env.REVALIDATION_SECRET ?? "";
  const got = body.secret ?? "";
  const a = Buffer.from(got.padEnd(64).slice(0, 64));
  const b = Buffer.from(expected.padEnd(64).slice(0, 64));
  if (!expected || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "invalid secret" }, { status: 401 });
  }

  const paths = ["/blog", "/"];
  if (body.slug) paths.unshift(`/blog/${body.slug}`);
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ revalidated: true, paths, timestamp: new Date().toISOString() });
}
