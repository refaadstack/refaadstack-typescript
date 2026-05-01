import { MetadataRoute } from 'next';
import { getPortfolios } from '@/lib/crud';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://refaadstack.dev';
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/#services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/#portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/#products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/#testimonials`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/#why-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/#cta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
  try {
    const portfolios = await getPortfolios();
    const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map((p) => ({
      url: `${baseUrl}/#portfolio`,
      lastModified: new Date(p.updated_at || p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    return [...staticRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}
