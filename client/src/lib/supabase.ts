import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * True only when real Supabase credentials are present.
 * While the placeholder URL is active, hooks will skip all API calls
 * and return empty data immediately.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = createClient(supabaseUrl || 'https://x.supabase.co', supabaseAnonKey || 'x');

