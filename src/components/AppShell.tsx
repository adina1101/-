import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useApp } from '../lib/app-context';
import { Icon } from './Icon';
import { ProfilePhoto } from './ProfilePhoto';
import { OfflineBanner } from './OfflineBanner';

const navItems = [
  { href: '/rules', icon: 'rules', label: 'rules' },
  { href: '/play', icon: 'play', label: 'play' },
  { href: '/casino', icon: 'casino', label: 'casinoNav' },
  { href: '/shop', icon: 'shop', label: 'shop' },
  { href: '/friends', icon: 'friends', label: 'friends' },
  { href: '/profile', icon: 'profile', label: 'profile' },
  { href: '/settings', icon: 'settings', label: 'settings' },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { t, profile } = useApp();

  if (location === '/game' || location === '/local-game') {
    return <div className="app-frame game-frame"><OfflineBanner /><main className="app-content">{children}</main></div>;
  }

  return (
    <div className="app-frame">
      <OfflineBanner />
      <main className="app-content">{children}</main>
      <nav className="bottom-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={location.startsWith(item.href) ? 'nav-item active' : 'nav-item'}>
            {item.href === '/profile'
              ? <ProfilePhoto photo={profile.photo} className="nav-profile-photo" />
              : <Icon name={item.icon} />}
            <span>{t(item.label)}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
