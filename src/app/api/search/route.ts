import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) {
    return Response.json({ results: [], query: '' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const pattern = `%${q}%`;

  try {
    const [blog, projects, portfolios, products] = await Promise.allSettled([
      supabase.from('blog_posts').select('title, slug, excerpt, category').eq('is_published', true).or(`title.ilike.${pattern},excerpt.ilike.${pattern},category.ilike.${pattern}`).limit(5).order('published_at', { ascending: false }),
      supabase.from('projects').select('title, slug, summary, category').eq('is_active', true).or(`title.ilike.${pattern},summary.ilike.${pattern},category.ilike.${pattern}`).limit(5).order('created_at', { ascending: false }),
      supabase.from('portfolios').select('title, slug, short_description, category').or(`title.ilike.${pattern},short_description.ilike.${pattern},category.ilike.${pattern}`).limit(5).order('created_at', { ascending: false }),
      supabase.from('products').select('name, slug, tagline, description').eq('is_active', true).or(`name.ilike.${pattern},tagline.ilike.${pattern},description.ilike.${pattern}`).limit(5).order('created_at', { ascending: false }),
    ]);

    const results = [
      ...(blog.status === 'fulfilled'
        ? (blog.value.data || []).map((item: any) => ({ ...item, _type: 'blog' }))
        : []),
      ...(projects.status === 'fulfilled'
        ? (projects.value.data || []).map((item: any) => ({ ...item, _type: 'project' }))
        : []),
      ...(portfolios.status === 'fulfilled'
        ? (portfolios.value.data || []).map((item: any) => ({ ...item, _type: 'portfolio' }))
        : []),
      ...(products.status === 'fulfilled'
        ? (products.value.data || []).map((item: any) => ({ ...item, _type: 'product' }))
        : []),
    ];

    return Response.json({ results, query: q });
  } catch {
    return Response.json({ results: [], query: q, error: 'Search failed' });
  }
}
