import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, type TranslationKey } from './i18n';
import type { AvatarAppearance, AvatarGender, AvatarProfile, Language, Theme } from './types';

interface AppContextValue {
  language: Language;
  theme: Theme;
  favorites: string[];
  settings: Record<'sound' | 'music' | 'animations' | 'notifications', boolean>;
  profile: AvatarProfile;
  setLanguage: (value: Language) => void;
  setTheme: (value: Theme) => void;
  toggleFavorite: (id: string) => void;
  toggleSetting: (key: keyof AppContextValue['settings']) => void;
  updateProfile: (nickname: string, avatar: string | null) => void;
  setAvatarGender: (gender: AvatarGender) => void;
  updateAvatarAppearance: (appearance: Partial<AvatarAppearance>) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextValue | null>(null);
const defaultAppearance: AvatarAppearance = {
  boyHairStyle: 'mullet', girlHairStyle: 'layers',
  hairColor: '#3b241d', skinTone: '#e9a06f', eyeColor: '#63391f',
};
const boyHairStyles = new Set<AvatarAppearance['boyHairStyle']>(['mullet', 'french-fade', 'buzz', 'bowl']);

function restoreAppearance(saved?: Partial<AvatarAppearance>): AvatarAppearance {
  const candidate = saved?.boyHairStyle as AvatarAppearance['boyHairStyle'] | undefined;
  const boyHairStyle = candidate && boyHairStyles.has(candidate) ? candidate : defaultAppearance.boyHairStyle;
  return { ...defaultAppearance, ...saved, boyHairStyle };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('language') === 'en' ? 'en' : 'ru');
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState({ sound: true, music: false, animations: true, notifications: true });
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('cardix-profile');
      const saved = stored ? JSON.parse(stored) as Partial<AvatarProfile> : null;
      return {
        nickname: saved?.nickname ?? 'Adina', avatar: saved?.avatar ?? null,
        gender: saved?.gender ?? 'girl', appearance: restoreAppearance(saved?.appearance),
      } satisfies AvatarProfile;
    } catch {
      return { nickname: 'Adina', avatar: null, gender: 'girl', appearance: defaultAppearance } satisfies AvatarProfile;
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
    updateProfile: (nickname, avatar) => setProfile((current) => ({ ...current, nickname: nickname.trim() || 'Player', avatar })),
    setAvatarGender: (gender) => setProfile((current) => ({ ...current, gender })),
    updateAvatarAppearance: (appearance) => setProfile((current) => ({
      ...current, appearance: { ...current.appearance, ...appearance },
    })),
    t: (key) => translate(language, key),
  }), [favorites, language, profile, settings, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
