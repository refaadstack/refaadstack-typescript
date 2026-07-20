import { hashPassword, verifyPassword } from '@/lib/auth';

export async function GET() {
  const hash = await hashPassword('admin123');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  let result: Record<string, unknown> = {};

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, password_hash, name, role')
      .eq('email', 'admin@refaadstack.dev')
      .single();

    const dbHash = admin?.password_hash || 'NO_HASH';
    const pwOk = await verifyPassword('admin123', dbHash);

    result = {
      error,
      adminFound: !!admin,
      dbHash: dbHash.substring(0, 30) + '...',
      computedHash: hash,
      hashesMatch: hash === dbHash,
      pwVerified: pwOk,
    };
  } catch (e) {
    result = { error: String(e) };
  }

  return Response.json(result);
}
