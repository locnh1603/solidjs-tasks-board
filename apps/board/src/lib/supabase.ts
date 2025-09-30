import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import type { Database } from '../types/database.types';

/**
 * Supabase client for client-side operations
 * Uses ANON key - safe to expose to browser
 * Protected by Row Level Security (RLS) policies
 */
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-application-name': env.app.name,
      },
    },
  }
);

// Log initialization in development
if (env.isDevelopment) {
  console.log('✅ Supabase client initialized');
}

/**
 * Helper function to check if client is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  try {
    return !!(env.supabase.url && env.supabase.anonKey);
  } catch {
    return false;
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { session } = await getCurrentSession();
  return !!session;
};