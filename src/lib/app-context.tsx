import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { translate, type TranslationKey } from './i18n';
import type { Language, Theme, UserProfile } from './types';
import { useAuth } from './auth-context';
import type { User } from '@supabase/supabase-js';

interface AppContextValue {
  language: Language;
  theme: Theme;
  favorites: string[];
  settings: Record<'sound' | 'music' | 'animations' | 'notifications', boolean>;
  profile: UserProfile;
  setLanguage: (value: Language) => void;
  setTheme: (value: Theme) => void;
  toggleFavorite: (id: string) => void;
  toggleSetting: (key: keyof AppContextValue['settings']) => void;
  updateProfile: (nickname: string, photo: string | null) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

function profileKey(userId?: string) {
  return `cardix-profile:${userId ?? 'offline'}`;
}

function accountNickname(user: User | null) {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  const candidate = [metadata?.nickname, metadata?.full_name, metadata?.name, user?.email?.split('@')[0]]
    .find((value): value is string => typeof value === 'string' && value.trim().length >= 2);
  return (candidate?.trim() || 'Игрок').slice(0, 18);
}

function loadProfile(user: User | null): UserProfile {
  try {
    const stored = localStorage.getItem(profileKey(user?.id));
    const saved = stored ? JSON.parse(stored) as Partial<UserProfile> : null;
    return { nickname: saved?.nickname ?? accountNickname(user), photo: saved?.photo ?? null };
  } catch { return { nickname: accountNickname(user), photo: null }; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('language') === 'en' ? 'en' : 'ru');
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState({ sound: true, music: false, animations: true, notifications: true });
  const [profile, setProfile] = useState(() => loadProfile(user));
  const profileOwner = useRef(user?.id);
  const skipProfileSave = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => localStorage.setItem('language', language), [language]);
  useEffect(() => {
    if (profileOwner.current === user?.id) return;
    profileOwner.current = user?.id;
    skipProfileSave.current = true;
    setProfile(loadProfile(user));
  }, [user?.id]);
  useEffect(() => {
    localStorage.removeItem('cardix-profile');
  }, []);
  useEffect(() => {
    if (skipProfileSave.current) { skipProfileSave.current = false; return; }
    localStorage.setItem(profileKey(user?.id), JSON.stringify(profile));
  }, [profile, user?.id]);

  const value = useMemo<AppContextValue>(() => ({
    language, theme, favorites, settings, profile, setLanguage, setTheme,
    toggleFavorite: (id) => setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    toggleSetting: (key) => setSettings((current) => ({ ...current, [key]: !current[key] })),
    updateProfile: (nickname, photo) => setProfile((current) => ({ ...current, nickname: nickname.trim() || 'Player', photo })),
    t: (key) => translate(language, key),
  }), [favorites, language, profile, settings, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
