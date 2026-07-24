import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, CATEGORY_LABELS } from "@/lib/blog";

export const revalidate = 3600; // ISR + on-demand via /api/revalidate

export const metadata: Metadata = {
  title: "Blog: Bay Area Lawn Care, Explained Plainly",
  description:
    "Mowing heights, seasonal schedules, costs, and problem diagnosis for East Bay lawns, written without the fluff.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-[clamp(8rem,12vw,10rem)] md:px-8">
      <h1 className="h2 max-w-[18ch]">Lawn care, explained plainly</h1>
      <p className="lead mt-4 max-w-[52ch] text-mute-l">
        What East Bay lawns actually need, month by month and problem by problem. No fluff, no
        upsell, real numbers.
      </p>

      {posts.length === 0 ? (
        <div className="mt-14 max-w-[52ch] border-t-2 border-line pt-8">
          <p className="h3">First posts are on the way.</p>
          <p className="mt-3 text-mute-l">
            Until then, the service pages carry the practical detail: start with{" "}
            <Link href="/services/mowing" className="text-green underline underline-offset-2">
              how we mow
            </Link>{" "}
            and{" "}
            <Link
              href="/services/edging-and-trimming"
              className="text-green underline underline-offset-2"
            >
              why the edge matters
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-12">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="svc-row">
                <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_220px] md:items-baseline md:gap-8">
                  <span className="h3">{p.title}</span>
                  <span className="t-sm text-mute-l">
                    {CATEGORY_LABELS[p.category] ?? p.category} &middot;{" "}
                    {new Date(p.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1 max-w-[68ch] text-mute-l">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
