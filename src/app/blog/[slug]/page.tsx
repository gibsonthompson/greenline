import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, CATEGORY_LABELS } from "@/lib/blog";
import { SITE } from "@/data/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.published_at },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#business` },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-[72ch]">
        <nav aria-label="Breadcrumb" className="t-body-sm text-ink-60">
          <Link href="/blog" className="text-turf-ink underline underline-offset-2">
            Blog
          </Link>{" "}
          / {CATEGORY_LABELS[post.category] ?? post.category}
        </nav>
        <h1 className="t-display-lg mt-3">{post.title}</h1>
        <p className="t-body-sm mt-4 text-ink-60">
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {post.reading_minutes ? ` \u00b7 ${post.reading_minutes} min read` : ""}
        </p>
        <div aria-hidden="true" className="line-h mt-6 w-24" />
        <div
          className="prose-gl mt-8"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />
        <div className="mt-14 border-l-[3px] border-turf bg-concrete-00 p-6">
          <p className="t-display-sm">Want it handled instead of explained?</p>
          <p className="mt-2 text-ink-60">
            Send a few photos and get a real price for your property, usually the same day.
          </p>
          <Link href="/estimate" className="btn btn-fill mt-4">
            Get a free estimate
          </Link>
        </div>
      </div>
    </article>
  );
}
