import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://refaadstack.com';

  // Sitemap MUST NOT contain hash/fragment URLs like `${baseUrl}/#services`.
  // Hash routes are client-side only and are rejected by Google Search Console.
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  return routes;
}
