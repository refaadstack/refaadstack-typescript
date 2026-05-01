import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}
