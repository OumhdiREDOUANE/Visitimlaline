import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { Button } from '@/components/ui/Button.js';

export default async function NotFound() {
  const { t } = await getI18n();

  return (
    <div className="page-shell flex flex-col items-start gap-5 py-24">
      <p className="eyebrow">404</p>

      <h1 className="max-w-xl text-5xl">
        {t('notFound.title')}
      </h1>

      <p className="max-w-md text-muted">
        {t('notFound.text')}
      </p>

      <Link href="/">
        <Button>{t('errors.backHome')}</Button>
      </Link>
    </div>
  );
}
