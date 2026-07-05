'use server';

import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SITE_SETTINGS, SiteSettingsInput } from '@/lib/site-settings';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase env variables');
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const IMAGE_BUCKETS = {
  portfolio: 'portfolio-images',
  product: 'product-images',
  content: 'content-media',
} as const;

const ensuredBuckets = new Set<string>();

export interface PortfolioInput {
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  problem: string;
  solution: string;
  impact_result: string;
  tech_stack: string[];
  featured: boolean;
}

export interface ProductInput {
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: string | null;
  image_url?: string | null;
  is_active: boolean;
}

export interface ServiceInput {
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TestimonialInput {
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
}

export interface ProjectInput {
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  description: string | null;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  services: string[] | null;
  stack: string[] | null;
  year: string | null;
  image_url: string | null;
  featured: boolean;
  is_active: boolean;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  reading_time: string | null;
  image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  is_published: boolean;
  featured: boolean;
}

export interface ImageUploadInput {
  name: string;
  type: string;
  data: string;
}

function getFileExtension(fileName: string, fileType: string) {
  const extension = fileName.split('.').pop();
  if (extension) return extension.toLowerCase();

  return fileType.split('/').pop() || 'jpg';
}

function getSafeFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSafeFolderName(folderId: string) {
  return folderId
    .split('/')
    .map((part) => getSafeFileName(part))
    .filter(Boolean)
    .join('/') || 'uploads';
}

async function ensurePublicBucket(bucket: string) {
  if (ensuredBuckets.has(bucket)) return;

  const { error } = await supabaseAdmin.storage.getBucket(bucket);
  if (!error) {
    ensuredBuckets.add(bucket);
    return;
  }

  const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
    public: true,
  });

  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(`Storage bucket unavailable: ${createError.message}`);
  }

  ensuredBuckets.add(bucket);
}

async function uploadBase64Image(
  bucket: string,
  folderId: string,
  fileData: ImageUploadInput
) {
  await ensurePublicBucket(bucket);

  const fileExt = getFileExtension(fileData.name, fileData.type);
  const safeName = getSafeFileName(fileData.name) || 'image';
  const safeFolder = getSafeFolderName(folderId);
  const fileName = `${safeFolder}/${Date.now()}-${safeName}.${fileExt}`;
  const buffer = Buffer.from(fileData.data, 'base64');

  const { error } = await supabaseAdmin.storage.from(bucket).upload(fileName, buffer, {
    cacheControl: '3600',
    contentType: fileData.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

async function deleteImageFile(bucket: string, imageUrl: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const urlParts = imageUrl.split(marker);
  if (urlParts.length < 2) return;

  const filePath = decodeURIComponent(urlParts[1]);
  await supabaseAdmin.storage.from(bucket).remove([filePath]);
}

export async function getPortfolios() {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .select('*, portfolio_images(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPortfolioById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .select('*, portfolio_images(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Portfolio not found');
  return data;
}

export async function createPortfolio(input: PortfolioInput) {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updatePortfolio(id: string, input: Partial<PortfolioInput>) {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePortfolio(id: string) {
  const images = await getPortfolioImages(id);

  const { error } = await supabaseAdmin.from('portfolios').delete().eq('id', id);
  if (error) throw new Error(error.message);

  await Promise.all(
    images.map((image) => deleteImageFile(IMAGE_BUCKETS.portfolio, image.image_url))
  );

  return { success: true };
}

export async function getPortfolioImages(portfolioId: string) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_images')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addPortfolioImage(
  portfolioId: string,
  imageUrl: string,
  sortOrder = 0
) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_images')
    .insert({
      portfolio_id: portfolioId,
      image_url: imageUrl,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadPortfolioImage(
  portfolioId: string,
  fileData: ImageUploadInput
): Promise<{ url: string; id: string }> {
  const imageUrl = await uploadBase64Image(IMAGE_BUCKETS.portfolio, portfolioId, fileData);
  const imageRecord = await addPortfolioImage(portfolioId, imageUrl, 0);

  return { url: imageUrl, id: imageRecord.id };
}

export async function deletePortfolioImageFile(imageUrl: string) {
  await deleteImageFile(IMAGE_BUCKETS.portfolio, imageUrl);
}

export async function deletePortfolioImage(id: string) {
  const { data: image } = await supabaseAdmin
    .from('portfolio_images')
    .select('image_url')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin.from('portfolio_images').delete().eq('id', id);
  if (error) throw new Error(error.message);

  if (image?.image_url) {
    await deletePortfolioImageFile(image.image_url);
  }

  return { success: true };
}

export async function updatePortfolioImageOrder(id: string, sortOrder: number) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_images')
    .update({ sort_order: sortOrder })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Product not found');
  return data;
}

export async function createProduct(input: ProductInput) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadProductImage(
  productId: string,
  fileData: ImageUploadInput
): Promise<{ url: string }> {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('image_url')
    .eq('id', productId)
    .single();

  const imageUrl = await uploadBase64Image(IMAGE_BUCKETS.product, productId, fileData);
  await updateProduct(productId, { image_url: imageUrl });

  if (product?.image_url) {
    await deleteImageFile(IMAGE_BUCKETS.product, product.image_url);
  }

  return { url: imageUrl };
}

export async function uploadContentMedia(
  folderId: string,
  fileData: ImageUploadInput
): Promise<{ url: string }> {
  const imageUrl = await uploadBase64Image(IMAGE_BUCKETS.content, folderId, fileData);
  return { url: imageUrl };
}

export async function deleteProduct(id: string) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('image_url')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);

  if (product?.image_url) {
    await deleteImageFile(IMAGE_BUCKETS.product, product.image_url);
  }

  return { success: true };
}

export async function getServices() {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getServiceById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Service not found');
  return data;
}

export async function createService(input: ServiceInput) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabaseAdmin.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getTestimonials() {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getTestimonialById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Testimonial not found');
  return data;
}

export async function createTestimonial(input: TestimonialInput) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getProjects() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProjectById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Project not found');
  return data;
}

export async function createProject(input: ProjectInput) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Blog post not found');
  return data;
}

export async function createBlogPost(input: BlogPostInput) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getAdminStats() {
  const [
    portfolios,
    products,
    activeProducts,
    testimonials,
    services,
    projects,
    activeProjects,
    blogPosts,
    publishedBlogPosts,
  ] = await Promise.all([
    countRows('portfolios'),
    countRows('products'),
    countRows('products', (query) => query.eq('is_active', true)),
    countRows('testimonials'),
    countRows('services'),
    countRows('projects'),
    countRows('projects', (query) => query.eq('is_active', true)),
    countRows('blog_posts'),
    countRows('blog_posts', (query) => query.eq('is_published', true)),
  ]);

  return {
    totalPortfolios: portfolios,
    totalProducts: products,
    activeProducts,
    totalTestimonials: testimonials,
    totalServices: services,
    totalProjects: projects,
    activeProjects,
    totalBlogPosts: blogPosts,
    publishedBlogPosts,
  };
}

async function countRows(
  table: string,
  filter?: (query: any) => any
): Promise<number> {
  try {
    const baseQuery = supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
    const query = filter ? filter(baseQuery) : baseQuery;
    const { count, error } = await query;

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

async function readRows<T>(
  table: string,
  fallback: T[],
  buildQuery: (query: any) => any
): Promise<T[]> {
  try {
    const { data, error } = await buildQuery(supabaseAdmin.from(table).select('*'));
    if (error) return fallback;
    return (data || fallback) as T[];
  } catch {
    return fallback;
  }
}

export async function getAdminOverviewData() {
  const stats = await getAdminStats();

  const [projects, blogPosts, portfolios, products, services, testimonials] = await Promise.all([
    readRows<any>('projects', [], (query) =>
      query.order('updated_at', { ascending: false }).order('created_at', { ascending: false }).limit(4)
    ),
    readRows<any>('blog_posts', [], (query) =>
      query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(4)
    ),
    readRows<any>('portfolios', [], (query) =>
      query.order('created_at', { ascending: false }).limit(4)
    ),
    readRows<any>('products', [], (query) =>
      query.order('created_at', { ascending: false }).limit(4)
    ),
    readRows<any>('services', [], (query) =>
      query.order('sort_order', { ascending: true }).limit(6)
    ),
    readRows<any>('testimonials', [], (query) =>
      query.order('created_at', { ascending: false }).limit(4)
    ),
  ]);

  return {
    stats,
    recent: {
      projects,
      blogPosts,
      portfolios,
      products,
      services,
      testimonials,
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettingsInput> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      site_title: data.site_title || DEFAULT_SITE_SETTINGS.site_title,
      site_description: data.site_description || DEFAULT_SITE_SETTINGS.site_description,
      site_keywords: data.site_keywords || DEFAULT_SITE_SETTINGS.site_keywords,
      og_image_url: data.og_image_url || DEFAULT_SITE_SETTINGS.og_image_url,
      canonical_url: data.canonical_url || DEFAULT_SITE_SETTINGS.canonical_url,
      author_name: data.author_name || DEFAULT_SITE_SETTINGS.author_name,
      published_time: data.published_time || DEFAULT_SITE_SETTINGS.published_time,
      robots_index: data.robots_index ?? DEFAULT_SITE_SETTINGS.robots_index,
      robots_follow: data.robots_follow ?? DEFAULT_SITE_SETTINGS.robots_follow,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .upsert(
      {
        id: 1,
        ...input,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
