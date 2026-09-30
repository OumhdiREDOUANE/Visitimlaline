import { Manrope, Sora } from 'next/font/google';

import './globals.css';

import {
  getDictionary,
  getLocale,
} from '@/lib/i18n/server.js';
import { createTranslator } from '@/lib/i18n/translate.js';
import { LocaleProvider } from '@/components/providers/LocaleProvider.js';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
});

export async function generateMetadata() {
  const locale = await getLocale();
  const t = createTranslator(getDictionary(locale));

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function RootLayout({
  children,
}) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider
          locale={locale}
          dictionary={dictionary}
        >
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
