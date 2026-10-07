import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  admin: {
    id: 'usr-admin-01',
    email: 'admin@railblock.ai',
    full_name: 'Er. S. Kumar (Chief Controller)',
    role: 'Admin',
    department: 'Central Operating Control / IRSE',
    division: 'Madurai Division (MDU)'
  },
  planner: {
    id: 'usr-planner-01',
    email: 'planner@railblock.ai',
    full_name: 'Er. R. Ramesh (Senior Section Engineer)',
    role: 'Planner',
    department: 'Civil P-Way / TRD Coordination',
    division: 'Tirunelveli Section (TEN)'
  },
  viewer: {
    id: 'usr-viewer-01',
    email: 'viewer@railblock.ai',
    full_name: 'A. Sundaram (Station Operations)',
    role: 'Viewer',
    department: 'Station Master / Safety Inspector',
    division: 'Kovilpatti (CVP)'
  }
};

const LOCAL_AUTH_KEY = 'railblock_active_user_v2';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(LOCAL_AUTH_KEY);
    return saved ? JSON.parse(saved) : DEMO_USERS.admin; // Default demo user
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Listen to Supabase auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            role: session.user.user_metadata?.role || 'Planner',
            department: session.user.user_metadata?.department || 'Operations',
            division: 'Madurai Division'
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(authUser));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const loginWithDemoRole = (roleKey) => {
    const demoUser = DEMO_USERS[roleKey] || DEMO_USERS.planner;
    setUser(demoUser);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } else {
        // Find matching demo user or create generic
        let match = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!match) {
          match = {
            id: `usr-${Date.now()}`,
            email,
            full_name: email.split('@')[0],
            role: 'Planner',
            department: 'Operations',
            division: 'Madurai Division'
          };
        }
        setUser(match);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(match));
        return { user: match };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase logout fallback:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithDemoRole,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const getDefaultRedirectForRole = (role) => {
  const r = (role || '').toLowerCase();
  if (r === 'admin') return '/admin-panel';
  if (r === 'planner') return '/planner-panel';
  if (r === 'viewer') return '/viewer-panel';
  return '/dashboard';
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return {
    ...context,
    getDefaultRedirectForRole
  };
}
