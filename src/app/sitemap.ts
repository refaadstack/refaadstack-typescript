import type { MetadataRoute } from 'next';
import {
  getPublicBlogPosts,
  getPublicPortfolios,
  getPublicProducts,
  getPublicProjects,
} from '@/lib/public-data';

const BASE_URL = 'https://www.refaadstack.com';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, products, portfolios, blogPosts] = await Promise.all([
    getPublicProjects(),
    getPublicProducts(),
    getPublicPortfolios(),
    getPublicBlogPosts(),
  ]);

  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.createdAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map((portfolio) => ({
    url: `${BASE_URL}/portfolio/${portfolio.slug}`,
    lastModified: new Date(portfolio.createdAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.65,
  }));

  return [
    ...mainRoutes,
    ...projectRoutes,
    ...productRoutes,
    ...portfolioRoutes,
    ...blogRoutes,
  ];
}
