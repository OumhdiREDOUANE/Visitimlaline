'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/api-client.js';
import { logClientError } from '@/lib/observability/client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Field, TextInput } from '@/components/ui/Field.js';
import { Button } from '@/components/ui/Button.js';
import { Alert } from '@/components/ui/Alert.js';

export function LoginForm({ next }) {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    setLoading(false);

    if (!result.ok) {
      logClientError('auth.login_failed', {
        status: result.status,
      });

      setError(
        result.status === 401
          ? t('login.invalid')
          : result.status === 403
            ? t('login.inactive')
            : t('login.failed')
      );

      return;
    }

    router.push(next || defaultRoute(result.data.user));
    router.refresh();
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5"
    >
      <Field label={t('login.email')} htmlFor="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />
      </Field>

      <Field
        label={t('login.password')}
        htmlFor="password"
      >
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />
      </Field>

      {error ? (
        <Alert tone="error">{error}</Alert>
      ) : null}

      <div>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
        >
          {loading
            ? t('login.submitting')
            : t('login.submit')}
        </Button>
      </div>
    </form>
  );
}

function defaultRoute(user) {
  return user?.role === 'admin'
    ? '/admin/bookings'
    : '/staff/check-in';
}
