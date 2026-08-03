import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth-context';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthPage } from '../pages/AuthPage';
import { useOnlineStatus } from '../lib/online-status';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const online = useOnlineStatus();
  if (!online) return children;
  if (!isSupabaseConfigured) return <AuthPage />;
  if (loading) return <div className="auth-loading"><div className="auth-logo">C<span>♠</span></div><p>CARDI<b>X</b></p></div>;
  return user ? children : <AuthPage />;
}
