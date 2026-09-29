'use client';

import { useEffect } from 'react';

import { logClientError } from '@/lib/observability/client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Button } from '@/components/ui/Button.js';

export default function GlobalError({
  error,
  reset,
}) {
  const { t } = useI18n();

  useEffect(() => {
    logClientError('render.error', {
      message: error?.message,
    });
  }, [error]);

  return (
    <div className="page-shell flex flex-col items-start gap-5 py-24">
      <p className="eyebrow">500</p>

      <h1 className="max-w-xl text-5xl">
        {t('errors.generic')}
      </h1>

      <p className="max-w-md text-muted">
        {t('notFound.text')}
      </p>

      <Button onClick={reset}>
        {t('errors.retry')}
      </Button>
    </div>
  );
}
