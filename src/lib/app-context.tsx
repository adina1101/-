import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, type TranslationKey } from './i18n';
import type { Language, Theme, UserProfile } from './types';

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
export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('language') === 'en' ? 'en' : 'ru');
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState({ sound: true, music: false, animations: true, notifications: true });
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('cardix-profile');
      const saved = stored ? JSON.parse(stored) as Partial<UserProfile> : null;
      return {
        nickname: saved?.nickname ?? 'Adina', photo: saved?.photo ?? null,
      } satisfies UserProfile;
    } catch {
      return { nickname: 'Adina', photo: null } satisfies UserProfile;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => localStorage.setItem('language', language), [language]);
  useEffect(() => localStorage.setItem('cardix-profile', JSON.stringify(profile)), [profile]);

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
