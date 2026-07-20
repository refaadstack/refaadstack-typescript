import { hashPassword } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const email = request.nextUrl.searchParams.get('email') || 'admin@refaadstack.dev';
  const password = request.nextUrl.searchParams.get('password') || 'admin123';
  const name = request.nextUrl.searchParams.get('name') || 'Admin';

  const setupKey = process.env.SETUP_ADMIN_KEY;
  if (!setupKey || key !== setupKey) {
    return Response.json({ error: 'Invalid key' }, { status: 403 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const hash = await hashPassword(password);

    const { error: deleteError } = await supabase
      .from('admins')
      .delete()
      .eq('email', email.toLowerCase().trim());
    if (deleteError) {
      return Response.json({ error: 'Delete failed: ' + deleteError.message });
    }

    const { data, error } = await supabase
      .from('admins')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: hash,
        name,
        role: 'admin',
      })
      .select('id, email, name')
      .single();

    if (error) {
      return Response.json({ error: error.message });
    }

    return Response.json({ success: true, admin: data, password });
  } catch (e: any) {
    return Response.json({ error: e.message || String(e) });
  }
}
