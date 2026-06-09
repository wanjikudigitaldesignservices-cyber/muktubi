// ============================================================
// MUKTUBI — Auth Context
// Manages authentication state and user profile across the app
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_PROFILES } from '@/lib/demo-data';
import { ROLES } from '@/lib/constants';
import type { Profile, Role } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: Role) => void;
  getDefaultPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users mapped to roles for quick testing
const DEMO_ROLE_MAP: Record<Role, Profile> = {
  super_admin: DEMO_PROFILES[0],      // Dr. Mary Kamau
  center_librarian: DEMO_PROFILES[1], // Grace Wanjiku
  teacher: DEMO_PROFILES[3],          // Alice Muthoni
  student: DEMO_PROFILES[6],          // Brian Otieno
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isDemo, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      // In demo mode, use email prefix to determine role
      const roleFromEmail = email.split('@')[0] as Role;
      if (DEMO_ROLE_MAP[roleFromEmail]) {
        setProfile(DEMO_ROLE_MAP[roleFromEmail]);
        return { error: null };
      }
      // Default to librarian for any email in demo mode
      setProfile(DEMO_ROLE_MAP.center_librarian);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    if (isDemo) {
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const switchDemoRole = (role: Role) => {
    if (isDemo && DEMO_ROLE_MAP[role]) {
      setProfile(DEMO_ROLE_MAP[role]);
    }
  };

  const getDefaultPath = () => {
    if (!profile) return '/login';
    return ROLES[profile.role]?.defaultPath || '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemo,
        signIn,
        signOut,
        switchDemoRole,
        getDefaultPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
