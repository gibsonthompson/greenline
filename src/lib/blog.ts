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

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const client = getBlogFarmClient();
    if (!client) return [];
    const bizId = await getBusinessId();
    if (!bizId) return [];
    const { data, error } = await client
      .from("blog_generated_posts")
      .select("slug,title,meta_description,content_html,category,published_at,author,reading_minutes")
      .eq("business_id", bizId)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.meta_description ?? "",
      content_html: p.content_html ?? "",
      category: p.category ?? "lawn-maintenance",
      published_at: p.published_at,
      author: p.author ?? "Green Line Lawn Care",
      reading_minutes: p.reading_minutes ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
