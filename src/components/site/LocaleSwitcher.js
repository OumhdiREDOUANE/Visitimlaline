'use client';

import { useRouter } from 'next/navigation';

import { LOCALE_LABELS } from '@/lib/i18n/config.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';

export function LocaleSwitcher({ tone = 'dark' }) {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  const target = locale === 'fr' ? 'en' : 'fr';

  const switchTo = () => {
    setLocale(target);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={switchTo}
      title={t('nav.language')}
      aria-label={`${t('nav.language')}: ${LOCALE_LABELS[target]}`}
      className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase transition-colors ${
        tone === 'light'
          ? 'border-ink/20 text-ink hover:border-terra hover:text-terra'
          : 'border-cream/40 text-cream hover:border-cream hover:bg-cream/10'
      }`}
    >
      {LOCALE_LABELS[target]}
    </button>
  );
}
