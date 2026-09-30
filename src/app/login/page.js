import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { LoginForm } from '@/components/auth/LoginForm.js';
import { Card } from '@/components/ui/Card.js';

export default async function LoginPage({
  searchParams,
}) {
  const { t } = await getI18n();
  const params = await searchParams;
  const next = (params?.next ?? '').toString();

  return (
    <main className="page-shell flex flex-col gap-8 py-16">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-[0.14em] text-muted hover:text-terra"
        >
          ← Visitimlaline
        </Link>

        <h1 className="text-5xl">{t('login.title')}</h1>

        <p className="max-w-md text-muted">
          {t('login.lead')}
        </p>
      </header>

      <Card
        className="max-w-md p-6"
      >
        <LoginForm next={next} />
      </Card>
    </main>
  );
}
