import {
  getBlogPosts,
  getPortfolios,
  getProducts,
  getProjects,
  getServices,
  getTestimonials,
} from '@/lib/crud';
import { isRichHtml, sanitizeRichHtml } from '@/lib/rich-text';
import { slugify } from '@/lib/utils';

export interface PublicService {
  id: string;
  name: string;
  description: string;
}

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  price: string;
  imageUrl: string;
}

export interface PublicPortfolio {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  impactResult: string;
  techStack: string[];
  featured: boolean;
  createdAt: string;
  images: { id: string; imageUrl: string; sortOrder: number }[];
}

export interface PublicTestimonial {
  id: string;
  clientName: string;
  companyName: string;
  testimonial: string;
  avatarUrl: string;
  rating: number;
}

export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  services: string[];
  stack: string[];
  year: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  image: string;
  authorName: string;
  featured: boolean;
  contentHtml: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

function cleanCopy(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;

  return value
    .replace(/[—–]/g, '-')
    .replace(/[降至需要实时第一印象节省]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBlock(value: unknown) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/[—–]/g, '-')
    .replace(/[降至需要实时第一印象节省]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function cleanList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanCopy(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => cleanCopy(item))
      .filter(Boolean);
  }

  return [];
}

function priceLabel(value: unknown) {
  if (!value) return 'Hubungi untuk harga';
  const amount = Number(value);

  if (Number.isNaN(amount)) return cleanCopy(value);
  if (amount === 0) return 'Hubungi untuk harga';

  return `Mulai dari Rp ${amount.toLocaleString('id-ID')}`;
}

function parseBlogSections(content: unknown): PublicBlogPost['sections'] {
  const body = cleanBlock(content);
  if (!body) return [];

  const chunks = body
    .split(/\n(?=##\s+)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks
    .map((chunk, index) => {
      const lines = chunk.split('\n');
      const firstLine = lines[0]?.trim() || '';
      const hasHeading = firstLine.startsWith('## ');
      const heading = hasHeading
        ? cleanCopy(firstLine.replace(/^##\s+/, ''))
        : index === 0
          ? 'Catatan utama'
          : 'Lanjutan';
      const paragraphSource = hasHeading ? lines.slice(1).join('\n') : chunk;
      const paragraphs = paragraphSource
        .split(/\n{2,}/)
        .map((paragraph) => cleanCopy(paragraph))
        .filter(Boolean);

      return { heading, paragraphs };
    })
    .filter((section) => section.paragraphs.length > 0);
}

function logDatabaseReadError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[public-data] Database read failed for ${scope}:`, error);
  }
}

export async function getPublicServices(): Promise<PublicService[]> {
  try {
    const services = await getServices();
    return services
      .filter((service: any) => service.is_active)
      .map((service: any) => ({
        id: String(service.id),
        name: cleanCopy(service.name),
        description: cleanCopy(service.description),
      }));
  } catch (error) {
    logDatabaseReadError('services', error);
    return [];
  }
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  try {
    const projects = await getProjects();
    return projects
      .filter((project: any) => project.is_active)
      .map((project: any) => ({
        id: String(project.id),
        slug: cleanCopy(project.slug, slugify(project.title)),
        title: cleanCopy(project.title),
        category: cleanCopy(project.category),
        summary: cleanCopy(project.summary),
        description: cleanCopy(project.description),
        challenge: cleanCopy(project.challenge),
        approach: cleanCopy(project.approach),
        outcome: cleanCopy(project.outcome),
        services: cleanList(project.services),
        stack: cleanList(project.stack),
        year: cleanCopy(project.year, String(new Date().getFullYear())),
        image: cleanCopy(project.image_url, '/images/refaadstack-system-still.png'),
        featured: Boolean(project.featured),
        createdAt: cleanCopy(project.created_at, `${project.year || new Date().getFullYear()}-01-01T00:00:00.000Z`),
      }));
  } catch (error) {
    logDatabaseReadError('projects', error);
    return [];
  }
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  try {
    const products = await getProducts();
    return products
      .filter((product: any) => product.is_active)
      .map((product: any) => ({
        id: String(product.id),
        slug: slugify(product.slug || product.name),
        name: cleanCopy(product.name),
        tagline: cleanCopy(product.tagline),
        description: cleanCopy(product.description),
        features: cleanList(product.features),
        price: priceLabel(product.price),
        imageUrl: cleanCopy(product.image_url, '/images/refaadstack-system-still.png'),
      }));
  } catch (error) {
    logDatabaseReadError('products', error);
    return [];
  }
}

export async function getPublicPortfolios(): Promise<PublicPortfolio[]> {
  try {
    const portfolios = await getPortfolios();
    return portfolios.map((portfolio: any) => ({
      id: String(portfolio.id),
      slug: cleanCopy(portfolio.slug, slugify(portfolio.title)),
      title: cleanCopy(portfolio.title),
      category: cleanCopy(portfolio.category),
      shortDescription: cleanCopy(portfolio.short_description),
      fullDescription: cleanCopy(portfolio.full_description),
      problem: cleanCopy(portfolio.problem),
      solution: cleanCopy(portfolio.solution),
      impactResult: cleanCopy(portfolio.impact_result),
      techStack: cleanList(portfolio.tech_stack),
      featured: Boolean(portfolio.featured),
      createdAt: cleanCopy(portfolio.created_at, '2026-01-01T00:00:00.000Z'),
      images: Array.isArray(portfolio.portfolio_images)
        ? [...portfolio.portfolio_images]
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((image: any) => ({
              id: String(image.id),
              imageUrl: cleanCopy(image.image_url),
              sortOrder: Number(image.sort_order || 0),
            }))
        : [],
    }));
  } catch (error) {
    logDatabaseReadError('portfolios', error);
    return [];
  }
}

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts
      .filter((post: any) => post.is_published)
      .map((post: any) => {
        const rawContent = typeof post.content === 'string' ? post.content : '';
        const richContent = isRichHtml(rawContent) ? sanitizeRichHtml(rawContent) : '';

        return {
          id: String(post.id),
          slug: cleanCopy(post.slug, slugify(post.title)),
          title: cleanCopy(post.title),
          excerpt: cleanCopy(post.excerpt),
          publishedAt: cleanCopy(post.published_at, new Date().toISOString()),
          readingTime: cleanCopy(post.reading_time, '5 menit'),
        category: cleanCopy(post.category, 'Article'),
        tags: cleanList(post.tags),
        image: cleanCopy(post.image_url, '/images/refaadstack-system-still.png'),
          authorName: cleanCopy(post.author_name, 'RefaadStack'),
          featured: Boolean(post.featured),
          contentHtml: richContent,
          sections: richContent ? [] : parseBlogSections(post.content),
        };
      });
  } catch (error) {
    logDatabaseReadError('blog posts', error);
    return [];
  }
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const testimonials = await getTestimonials();
    return testimonials
      .filter((testimonial: any) => testimonial.is_active)
      .map((testimonial: any) => ({
        id: String(testimonial.id),
        clientName: cleanCopy(testimonial.client_name),
        companyName: cleanCopy(testimonial.company_name),
        testimonial: cleanCopy(testimonial.testimonial),
        avatarUrl: cleanCopy(testimonial.avatar_url),
        rating: Number(testimonial.rating || 5),
      }));
  } catch (error) {
    logDatabaseReadError('testimonials', error);
    return [];
  }
}

export async function getPublicProjectBySlug(slug: string) {
  const projects = await getPublicProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getPublicPortfolioBySlug(slug: string) {
  const portfolios = await getPublicPortfolios();
  return portfolios.find((portfolio) => portfolio.slug === slug);
}

export async function getPublicProductBySlug(slug: string) {
  const products = await getPublicProducts();
  return products.find((product) => product.slug === slug);
}

export async function getPublicBlogPostBySlug(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPublicHomeData() {
  const [services, projects, products, portfolios, testimonials, blogPosts] =
    await Promise.all([
      getPublicServices(),
      getPublicProjects(),
      getPublicProducts(),
      getPublicPortfolios(),
      getPublicTestimonials(),
      getPublicBlogPosts(),
    ]);

  return { services, projects, products, portfolios, testimonials, blogPosts };
}
