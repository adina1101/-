import { Link } from 'wouter';
import { Icon } from './Icon';

export function PageHeader({ title, subtitle, back }: {
  title: string;
  subtitle?: string;
  back?: string;
}) {
  return (
    <header className="page-header">
      <div className="page-title-row">
        {back && <Link href={back} className="icon-button"><Icon name="back" /></Link>}
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {!back && <button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button>}
    </header>
  );
}
