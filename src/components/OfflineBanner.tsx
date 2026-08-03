import { useApp } from '../lib/app-context';
import { useOnlineStatus } from '../lib/online-status';

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { language } = useApp();
  if (online) return null;
  return <div className="offline-banner" role="status">
    {language === 'ru' ? 'Без интернета · прогресс сохранится на устройстве' : 'Offline · progress is saved on this device'}
  </div>;
}
