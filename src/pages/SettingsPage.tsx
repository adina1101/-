import { PageHeader } from '../components/PageHeader';
import { Toggle } from '../components/Toggle';
import { useApp } from '../lib/app-context';
import type { TranslationKey } from '../lib/i18n';
import { useAuth } from '../lib/auth-context';

export function SettingsPage() {
  const { language, setLanguage, theme, setTheme, settings, toggleSetting, t } = useApp();
  const { user, signOut } = useAuth();
  const toggles: Array<{ key: keyof typeof settings; label: TranslationKey }> = [
    { key: 'sound', label: 'sound' }, { key: 'music', label: 'music' },
    { key: 'animations', label: 'animations' }, { key: 'notifications', label: 'notifications' },
  ];
  return (
    <div className="screen">
      <PageHeader title={t('settings')} />
      <h2 className="group-title">{t('appearance')}</h2>
      <section className="settings-group">
        <div className="setting-row"><span>◐</span><strong>{t('darkTheme')}</strong>
          <Toggle checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} label={t('darkTheme')} /></div>
        <div className="setting-row language-row"><span>文</span><strong>{t('language')}</strong>
          <div className="segmented"><button className={language === 'ru' ? 'active' : ''} onClick={() => setLanguage('ru')}>RU</button>
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div></div>
      </section>
      <h2 className="group-title">Приложение</h2>
      <section className="settings-group">
        {toggles.map(({ key, label }) => <div className="setting-row" key={key}>
          <span>{key === 'sound' ? '♪' : key === 'music' ? '♫' : key === 'animations' ? '✦' : '♢'}</span>
          <strong>{t(label)}</strong><Toggle checked={settings[key]} onChange={() => toggleSetting(key)} label={t(label)} />
        </div>)}
      </section>
      <h2 className="group-title">{t('account')}</h2>
      <section className="settings-group links">
        {user?.email && <div className="setting-row account-email"><span>●</span><strong>{user.email}</strong></div>}
        <button><span>?</span><strong>{t('support')}</strong><i>›</i></button>
        <button><span>⌾</span><strong>{t('privacy')}</strong><i>›</i></button>
        <button className="danger" onClick={() => void signOut()}><span>↪</span><strong>{t('logout')}</strong></button>
      </section>
      <p className="version">CardVerse · 1.0.0</p>
    </div>
  );
}
