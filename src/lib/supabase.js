import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Connection test helper
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      mode: 'Local Prototype Storage',
      message: 'Supabase credentials not configured in .env. Running in persistent local prototype mode.'
    };
  }

  try {
    const { data, error } = await supabase.from('corridors').select('id').limit(1);
    if (error) throw error;
    return {
      connected: true,
      mode: 'Supabase PostgreSQL (Live)',
      message: 'Successfully connected to live Supabase PostgreSQL database.'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'Local Prototype Storage (Fallback)',
      message: `Supabase connection issue: ${err.message}. Using persistent local prototype storage.`
    };
  }
}
