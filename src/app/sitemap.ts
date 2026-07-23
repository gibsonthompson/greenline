import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { services } from "@/data/services";
import { cityPages } from "@/data/city-pages";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "", "/services", "/areas", "/work", "/reviews", "/about", "/estimate",
    "/blog", "/privacy", "/terms", "/sms-terms",
  ].map((p) => ({ url: `${SITE.url}${p}`, lastModified: new Date() }));

  const servicePages = services.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: new Date(),
  }));
  const areaPages = cityPages.map((c) => ({
    url: `${SITE.url}/areas/${c.slug}`,
    lastModified: new Date(),
  }));
  const posts = (await getAllPosts()).map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
  }));

  return [...staticPages, ...servicePages, ...areaPages, ...posts];
}
