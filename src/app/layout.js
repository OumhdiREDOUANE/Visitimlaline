import { Manrope, Sora } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';

const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Visitimlaline | Adventure starts here',
  description: 'Premium Timlaline adventure and experience booking platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-[#F5EFE5] text-[#17130F] antialiased">
        <div className="min-h-screen bg-[#F5EFE5]">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
