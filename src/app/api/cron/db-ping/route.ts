import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Supabase cron job - keep database awake
// Call this endpoint every 4 days via cron (Vercel Cron, GitHub Actions, etc.)
// Rate limit: 1x per 4 days

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceKey);

    // Simple query to keep connection alive
    const { error } = await supabase
      .from('portfolios')
      .select('id')
      .limit(1);

    if (error) {
      console.error('DB ping failed:', error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Database ping successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
