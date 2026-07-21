import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;
const rateStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const entry = rateStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingTime(content: string): string {
  const text = content.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} menit`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function autoExcerpt(content: string, maxLen = 140): string {
  const text = stripHtml(content);
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

function guard(request: NextRequest): Response | null {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.BLOG_API_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return Response.json({ success: false, error: 'Invalid API key' }, { status: 403 });
  }
  if (!checkRateLimit(request)) {
    return Response.json({ success: false, error: 'Rate limit exceeded. Max 20 req/min.' }, { status: 429 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const auth = guard(request);
  if (auth) return auth;

  return Response.json({
    methods: {
      GET: 'Docs — returns this spec',
      POST: 'Create new article',
      PUT: 'Update article by slug',
      DELETE: 'Delete article by slug',
    },
    auth: { header: 'x-api-key', value: '<your-key>' },
    fields: {
      title: { type: 'string', required: true, description: 'Judul artikel (max 70 char)' },
      content: { type: 'string (HTML)', required: true, description: 'Isi artikel dalam HTML' },
      excerpt: { type: 'string', required: false, default: '140 chars pertama dari content' },
      category: { type: 'string', required: false, default: 'Article', examples: ['SEO', 'Web Development', 'Bisnis Digital', 'UMKM'] },
      slug: { type: 'string', required: false, default: 'auto dari title', description: 'Duplikat otomatis diberi suffix' },
      image_url: { type: 'string', required: false, default: '/og-image.png' },
      author_name: { type: 'string', required: false, default: 'RefaadStack' },
      reading_time: { type: 'string', required: false, default: 'auto (1 menit per 180 kata)' },
      is_published: { type: 'boolean', required: false, default: true },
      featured: { type: 'boolean', required: false, default: false },
    },
    target_keywords: [
      { keyword: 'jasa pembuatan website jambi', slug: 'jasa-pembuatan-website-jambi', title: 'Jasa Pembuatan Website Profesional di Jambi untuk UMKM' },
      { keyword: 'software house jambi', slug: 'cara-memilih-software-house-jambi', title: 'Cara Memilih Software House di Jambi yang Tepat' },
      { keyword: 'pembuatan aplikasi web jambi', slug: 'biaya-pembuatan-aplikasi-web-jambi', title: 'Berapa Biaya Pembuatan Aplikasi Web di Jambi?' },
      { keyword: 'aplikasi web untuk umkm', slug: 'aplikasi-web-untuk-umkm-jambi', title: 'Mengapa UMKM Jambi Butuh Aplikasi Web?' },
      { keyword: 'aplikasi pos jambi', slug: 'aplikasi-pos-jambi', title: 'Aplikasi POS: Solusi Kasir Digital untuk Toko di Jambi' },
      { keyword: 'proses pembuatan aplikasi', slug: 'proses-pembuatan-aplikasi', title: 'Proses Pembuatan Aplikasi dari Konsultasi hingga Launching' },
    ],
    rules: [
      'Minimal 500 kata per artikel',
      'Judul maksimal 70 karakter',
      'Pakai <h2>, <h3> dengan target keyword',
      'Paragraf pembuka harus mengandung target keyword',
      'Tautkan internal ke /services, /portfolio, /products',
      'Akhiri dengan CTA — ajak konsultasi via WhatsApp',
      'Content wajib dalam HTML (bukan plain text)',
    ],
  });
}

export async function POST(request: NextRequest) {
  const auth = guard(request);
  if (auth) return auth;

  try {
    const body = await request.json();

    const title = body.title?.trim();
    if (!title) {
      return Response.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const content = body.content?.trim();
    if (!content) {
      return Response.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const slug = body.slug?.trim() || slugify(title);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const post = {
      title,
      slug: finalSlug,
      excerpt: body.excerpt?.trim() || autoExcerpt(content),
      content,
      category: body.category?.trim() || 'Article',
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => String(t).trim()).filter(Boolean) : [],
      reading_time: body.reading_time?.trim() || estimateReadingTime(content),
      image_url: body.image_url?.trim() || '/og-image.png',
      author_name: body.author_name?.trim() || 'RefaadStack',
      published_at: body.published_at || new Date().toISOString(),
      is_published: body.is_published !== false,
      featured: body.featured === true,
    };

    const { data: created, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select('id, title, slug, created_at')
      .single();

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json(
      {
        success: true,
        post: {
          id: created.id,
          title: created.title,
          slug: created.slug,
          url: `https://www.refaadstack.com/blog/${created.slug}`,
          created_at: created.created_at,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    return Response.json(
      { success: false, error: e.message || String(e) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = guard(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const slug = body.slug?.trim();
    if (!slug) {
      return Response.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: existing } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return Response.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (body.title?.trim()) updates.title = body.title.trim();
    if (body.content?.trim()) {
      updates.content = body.content.trim();
      if (!body.excerpt) updates.excerpt = autoExcerpt(body.content.trim());
      if (!body.reading_time) updates.reading_time = estimateReadingTime(body.content.trim());
    }
    if (body.excerpt?.trim()) updates.excerpt = body.excerpt.trim();
    if (body.category?.trim()) updates.category = body.category.trim();
    if (Array.isArray(body.tags)) updates.tags = body.tags.map((t: string) => String(t).trim()).filter(Boolean);
    if (body.image_url?.trim()) updates.image_url = body.image_url.trim();
    if (body.author_name?.trim()) updates.author_name = body.author_name.trim();
    if (body.reading_time?.trim()) updates.reading_time = body.reading_time.trim();
    if (body.slug && body.slug.trim() !== slug) {
      const { data: conflict } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', body.slug.trim())
        .maybeSingle();
      if (!conflict) updates.slug = body.slug.trim();
    }
    if (typeof body.is_published === 'boolean') updates.is_published = body.is_published;
    if (typeof body.featured === 'boolean') updates.featured = body.featured;

    const { data: updated, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('slug', slug)
      .select('id, title, slug, created_at')
      .single();

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      post: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        url: `https://www.refaadstack.com/blog/${updated.slug}`,
        created_at: updated.created_at,
      },
    });
  } catch (e: any) {
    return Response.json({ success: false, error: e.message || String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = guard(request);
  if (auth) return auth;

  try {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return Response.json({ success: false, error: 'Slug query parameter is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return Response.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug);

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, slug });
  } catch (e: any) {
    return Response.json({ success: false, error: e.message || String(e) }, { status: 500 });
  }
}
