'use client';

import { useRouter } from 'next/navigation';

import { LOCALE_LABELS } from '@/lib/i18n/config.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';

export function LocaleSwitcher({ tone = 'dark' }) {
  const {
    locale,
    currency,
    setLocale,
    setCurrency,
    t,
  } = useI18n();
  const router = useRouter();
  const target = locale === 'fr' ? 'en' : 'fr';

  const switchTo = () => {
    setLocale(target);
    router.refresh();
  };

  const switchCurrency = (next) => {
    setCurrency(next);
    router.refresh();
  };

  const light = tone === 'light';
  const border = light
    ? 'border-ink/20 text-ink hover:border-terra hover:text-terra'
    : 'border-cream/40 text-cream hover:border-cream hover:bg-cream/10';

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={switchTo}
        title={t('nav.language')}
        aria-label={`${t('nav.language')}: ${LOCALE_LABELS[target]}`}
        className={`rounded-full border px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] transition-colors ${border}`}
      >
        {LOCALE_LABELS[target]}
      </button>
      <span className={`flex items-center rounded-full border p-0.5 text-[0.625rem] font-bold tracking-[0.12em] ${border}`}>
        {['MAD', 'EUR'].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => switchCurrency(value)}
            className={`rounded-full px-2 py-1 transition-colors ${
              currency === value
                ? light
                  ? 'bg-ink text-cream'
                  : 'bg-cream text-ink'
                : 'opacity-70 hover:opacity-100'
            }`}
            aria-pressed={currency === value}
          >
            {value}
          </button>
        ))}
      </span>
    </span>
  );
}
