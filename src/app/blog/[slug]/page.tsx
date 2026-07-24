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
    <article className="mx-auto max-w-6xl px-5 pb-16 pt-[clamp(6rem,10vw,8.5rem)] md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-[72ch]">
        <nav aria-label="Breadcrumb" className="t-sm text-mute-l">
          <Link href="/blog" className="text-green underline underline-offset-2">
            Blog
          </Link>{" "}
          / {CATEGORY_LABELS[post.category] ?? post.category}
        </nav>
        <h1 className="h2 mt-3">{post.title}</h1>
        <p className="t-sm mt-4 text-mute-l">
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {post.reading_minutes ? ` \u00b7 ${post.reading_minutes} min read` : ""}
        </p>
        <div aria-hidden="true" className="rule mt-6 w-24" />
        <div
          className="prose-gl mt-8"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />
        <div className="mt-14 border-l-[3px] border-lime bg-white p-6">
          <p className="h3">Want it handled instead of explained?</p>
          <p className="mt-2 text-mute-l">
            Send a few photos and get a real price for your property, usually the same day.
          </p>
          <Link href="/estimate" className="btn btn-p mt-4">
            Get a free estimate
          </Link>
        </div>
      </div>
    </article>
  );
}
