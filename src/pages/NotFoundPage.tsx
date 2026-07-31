import { Link } from 'wouter';

export function NotFoundPage() {
  return <div className="screen empty-state"><span>🂠</span><h1>404</h1><p>Такой страницы нет</p><Link href="/" className="primary-button">На главную</Link></div>;
}
