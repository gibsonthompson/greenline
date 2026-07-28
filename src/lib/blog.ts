import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Blog-farm is a SEPARATE Supabase project from this site's CRM database.
// The client below is lazy-initialized. This is not optional: client
// components import BlogPost and CATEGORY_LABELS from this file, which
// bundles the module to the browser. A module-level createClient would
// execute there with undefined env vars and throw "supabaseUrl is
// required", silently breaking the blog. See build spec 14.4.
const BUSINESS_SLUG = "greenline";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content_html: string;
  category: string;
  published_at: string;
  author: string;
  reading_minutes: number | null;
};

export const CATEGORY_LABELS: Record<string, string> = {
  "lawn-maintenance": "Lawn Maintenance",
  "seasonal": "Seasonal Guides",
  "cost-and-hiring": "Cost and Hiring",
  "diagnosis": "Problem Diagnosis",
  "local": "City Guides",
};

let _client: SupabaseClient | null | undefined;
function getBlogFarmClient(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  const url = process.env.BLOG_FARM_SUPABASE_URL;
  const key = process.env.BLOG_FARM_SUPABASE_KEY;
  _client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return _client;
}

async function getBusinessId(): Promise<string | null> {
  try {
    const client = getBlogFarmClient();
    if (!client) return null;
    const { data } = await client
      .from("blog_businesses")
      .select("id")
      .eq("slug", BUSINESS_SLUG)
      .single();
    return data?.id ?? null;
  } catch {
    return null;
  }
}

// Reading time from word count: ~200 words per minute, minimum 1.
function readingMinutes(wordCount: number | null): number | null {
  if (!wordCount || wordCount <= 0) return null;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const client = getBlogFarmClient();
    if (!client) return [];
    const bizId = await getBusinessId();
    if (!bizId) return [];
    // NOTE: column names match the blog-farm schema exactly:
    // html_content (not content_html), publish_date (not published_at),
    // word_count (reading time is computed, no reading_minutes column),
    // and there is no author column (author is per-business, defaulted below).
    const { data, error } = await client
      .from("blog_generated_posts")
      .select("slug,title,meta_description,html_content,category,publish_date,word_count")
      .eq("business_id", bizId)
      .eq("status", "published")
      .order("publish_date", { ascending: false });
    if (error || !data) return [];
    return data.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.meta_description ?? "",
      content_html: p.html_content ?? "",
      category: p.category ?? "lawn-maintenance",
      published_at: p.publish_date
        ? `${p.publish_date}T12:00:00Z`
        : new Date().toISOString(),
      author: "Green Line Lawn Care",
      reading_minutes: readingMinutes(p.word_count),
    }));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}