import { Manrope, Sora } from 'next/font/google';

import './globals.css';

import {
  getDictionary,
  getLocale,
  getI18n,
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

const SITE_URL = 'https://visitimlaline.com';
const SITE_NAME = 'Visitmlalin';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = createTranslator(getDictionary(locale));

  const title = SITE_NAME;
  const description =
    'Discover and book quad biking, buggy rides, camel rides, and unforgettable outdoor experiences in Timlaline, Morocco.';

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },

    applicationName: SITE_NAME,

    description,

    alternates: {
      canonical: '/',
    },

    icons: {
      icon: '/icon.png',
      
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },

    openGraph: {
      type: 'website',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Experiences in Timlaline, Morocco`,
      description,
      
    },

    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      
    },
  };
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'Visitimlaline',
  url: `${SITE_URL}/`,
};

export default async function RootLayout({ children }) {
  const { locale, currency } = await getI18n();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <LocaleProvider
          locale={locale}
          currency={currency}
          dictionary={dictionary}
        >
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}