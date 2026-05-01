// lib/crud.ts - Versi yang PASTI jalan

'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase env variables');
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

// ===== TYPES =====

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

// ===== PORTFOLIO =====
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

export async function createPortfolio(input: any) {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .insert(input as any) // ✅ PAKAI as any
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePortfolio(id: string, input: any) {
  const { data, error } = await supabaseAdmin
    .from('portfolios')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any) // ✅ PAKAI as any
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePortfolio(id: string) {
  const { error } = await supabaseAdmin
    .from('portfolios')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ===== STORAGE =====
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function uploadPortfolioImage(
  portfolioId: string, 
  fileData: { name: string; type: string; data: string } // base64 data
): Promise<{ url: string; id: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  const supabase = createSupabaseClient(supabaseUrl, serviceKey);
  
  // Decode base64 to buffer
  const binaryString = atob(fileData.data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const blob = new Blob([bytes], { type: fileData.type });
  const file = new File([blob], fileData.name, { type: fileData.type });
  
  const fileExt = fileData.name.split('.').pop();
  const fileName = `${portfolioId}/${Date.now()}.${fileExt}`;
  
  console.log('Uploading to Supabase Storage:', {
    bucket: 'portfolio-images',
    fileName,
    fileType: fileData.type
  });
  
  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  console.log('Upload success:', data);
  
  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);
  
  console.log('Public URL:', urlData.publicUrl);
  
  // Add to portfolio_images table
  const imageRecord = await addPortfolioImage(portfolioId, urlData.publicUrl, 0);
  
  return { url: urlData.publicUrl, id: imageRecord.id };
}

export async function deletePortfolioImageFile(imageUrl: string) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Extract file path from URL
  const urlParts = imageUrl.split('/storage/v1/object/public/portfolio-images/');
  if (urlParts.length < 2) return;
  
  const filePath = urlParts[1];
  
  await supabase.storage
    .from('portfolio-images')
    .remove([filePath]);
}

// ===== PORTFOLIO IMAGES =====
export async function getPortfolioImages(portfolioId: string) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_images')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addPortfolioImage(portfolioId: string, imageUrl: string, sortOrder: number = 0) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_images')
    .insert({
      portfolio_id: portfolioId,
      image_url: imageUrl,
      sort_order: sortOrder
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePortfolioImage(id: string) {
  const { error } = await supabaseAdmin
    .from('portfolio_images')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
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

// ===== PRODUCTS =====
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

export async function createProduct(input: any) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(input as any) // ✅ PAKAI as any
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, input: any) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any) // ✅ PAKAI as any
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ===== SERVICES =====
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

export async function createService(input: any) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .insert(input as any) // ✅ PAKAI as any
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateService(id: string, input: any) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any) // ✅ PAKAI as any
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ===== TESTIMONIALS =====
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

export async function createTestimonial(input: any) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .insert(input as any) // ✅ PAKAI as any
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTestimonial(id: string, input: any) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as any) // ✅ PAKAI as any
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ===== STATS =====
export async function getAdminStats() {
  const [portfolios, products, testimonials, services] = await Promise.all([
    supabaseAdmin.from('portfolios').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('testimonials').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('services').select('id', { count: 'exact', head: true }),
  ]);
  return {
    totalPortfolios: portfolios.count || 0,
    totalProducts: products.count || 0,
    totalTestimonials: testimonials.count || 0,
    totalServices: services.count || 0,
  };
}