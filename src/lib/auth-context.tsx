import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applySession = (nextSession: Session | null) => {
      setSession(nextSession);
      if (nextSession?.user.user_metadata.account_type !== 'player') {
        window.setTimeout(() => void supabase.auth.updateUser({ data: { account_type: 'player' } }), 0);
      }
    };
    void supabase.auth.getSession()
      .then(({ data }) => applySession(data.session))
      .catch(() => applySession(null))
      .finally(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user: session?.user ?? null,
      session,
      loading,
      signOut: async () => { await supabase.auth.signOut(); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
