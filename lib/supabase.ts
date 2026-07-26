import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl.trim() !== '' &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey &&
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

if (!isSupabaseConfigured) {
  console.warn(
    'GymEase: Supabase credentials not fully configured. Using mock client fallback for demonstration purposes.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
