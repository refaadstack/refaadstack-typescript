import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.BLOG_API_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return Response.json({ success: false, error: 'Invalid API key' }, { status: 403 });
  }

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
