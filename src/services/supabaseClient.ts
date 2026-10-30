import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL =
  (import.meta.env.VITE_SUPABASE_URL || 'https://dwjreceajfrtuycsalzw.supabase.co').trim();

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return SUPABASE_ANON_KEY.length > 20;
};

// Khởi tạo Supabase Client an toàn, có fallback nếu chưa gắn anon key
export const supabase = createClient(
  SUPABASE_PROJECT_URL,
  SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_build',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
