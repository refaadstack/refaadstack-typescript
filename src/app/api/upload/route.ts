import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.BLOG_API_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return Response.json({ success: false, error: 'Invalid API key' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return Response.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'Only images allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Max 5MB' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const hash = crypto.randomBytes(4).toString('hex');
    const fileName = `${folder}/${Date.now()}-${hash}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('content-media')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('content-media').getPublicUrl(fileName);

    return Response.json({ success: true, url: data.publicUrl });
  } catch (e: any) {
    return Response.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
