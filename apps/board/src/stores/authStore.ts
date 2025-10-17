import { createStore } from 'solid-js/store';
import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

export const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,
});

// Initialize auth state and listen for changes
let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
let isInitializing = false;

const initializeAuth = async () => {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    return;
  }

  isInitializing = true;

  try {
    // Get initial session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      // Session refresh failed or no valid session: reset to non-login state
      let errorMessage = null;
      if (error) {
        errorMessage = error instanceof Error ? error.message : 'Failed to initialize auth';
      }
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false,
        initialized: true,
        error: errorMessage,
      });
      return;
    }

    // Valid session: load user profile
    await loadUserProfile(session.user.id);
    setAuthState({
      user: session.user,
      session,
      loading: false,
      initialized: true,
      error: null,
    });
  } catch (error) {
    console.error('[Auth] Initialization error:', error);
    setAuthState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: true,
      error: error instanceof Error ? error.message : 'Failed to initialize auth',
    });
  } finally {
    isInitializing = false;
  }
};

// Load user profile from database
const loadUserProfile = async (userId: string) => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile load timeout')), 3000);
    });

    const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();

    const result = (await Promise.race([profilePromise, timeoutPromise])) as Awaited<
      typeof profilePromise
    >;

    const { data, error } = result;

    if (error) {
      console.error('[Auth] Profile load error:', error);
      return;
    }

    setAuthState('profile', data);
  } catch (error) {
    console.error('[Auth] Profile load error:', error);
    // Don't throw - allow auth to continue even if profile fails
  }
};

// Handle auth state changes
const handleAuthChange = async (_event: AuthChangeEvent, session: Session | null) => {
  // Skip ALL events if we're currently initializing to avoid race conditions
  if (isInitializing) {
    return;
  }

  if (session?.user) {
    await loadUserProfile(session.user.id);
    await updateUserPresence(session.user.id, 'online');
  } else {
    setAuthState('profile', null);
  }

  setAuthState({
    user: session?.user ?? null,
    session: session ?? null,
    loading: false,
    initialized: true,
  });
};

// Update user presence
const updateUserPresence = async (
  userId: string,
  status: 'online' | 'offline' | 'away' | 'busy'
) => {
  try {
    await supabase.from('user_presence').upsert({
      user_id: userId,
      status,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating presence:', error);
  }
};

// Initialize on mount - should be called from a component
const setupAuthListener = () => {
  // Subscribe to auth changes
  authSubscription = supabase.auth.onAuthStateChange(handleAuthChange);

  return () => {
    if (authSubscription) {
      authSubscription.data.subscription.unsubscribe();
      authSubscription = null;
    }
  };
};

// Export functions for setup
export const initAuth = () => {
  void initializeAuth();
  return setupAuthListener();
};

// Auth Actions
export const authActions = {
  signIn: async (email: string, password: string) => {
    setAuthState('loading', true);
    setAuthState('error', null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setAuthState('error', errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setAuthState('loading', false);
    }
  },

  signUp: async (email: string, password: string, username: string, fullName?: string) => {
    setAuthState('loading', true);
    setAuthState('error', null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Create profile record
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          full_name: fullName ?? null,
          status: 'online',
        });
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      setAuthState('error', errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setAuthState('loading', false);
    }
  },

  signOut: async () => {
    setAuthState('loading', true);

    try {
      // Update presence to offline
      if (authState.user) {
        await updateUserPresence(authState.user.id, 'offline');
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear state but keep initialized true
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false,
        initialized: true,
      });

      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      setAuthState('error', errorMessage);
      return { error: errorMessage };
    } finally {
      setAuthState('loading', false);
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    if (!authState.user) {
      return { error: 'No user logged in' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAuthState('profile', data);

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      return { data: null, error: errorMessage };
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      return { data: null, error: errorMessage };
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      return { data: null, error: errorMessage };
    }
  },
};
