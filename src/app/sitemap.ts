import type { MetadataRoute } from 'next';
import { getPublicBlogPosts } from '@/lib/public-data';

const BASE_URL = 'https://www.refaadstack.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const mainRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPublicBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase unavailable — sitemap tetap jalan dengan main routes
  }

  return [...mainRoutes, ...blogRoutes];
}

export const revalidate = 3600;
