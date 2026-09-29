'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/api-client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Button } from '@/components/ui/Button.js';

export function SignOutButton() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);

    const result = await apiFetch('/api/auth/logout', {
      method: 'POST',
    });

    setLoading(false);

    if (!result.ok) {
      return;
    }

    router.push('/login');
    router.refresh();
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={signOut}
      disabled={loading}
    >
      {t('backoffice.signOut')}
    </Button>
  );
}
