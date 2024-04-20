import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Spinner } from '@nextui-org/react';
import { dir } from 'i18next';
import clsx from 'clsx';

import '@/styles/globals.css';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Providers } from '../providers';
import {
  ALL_LOCALES,
  fallbackLng,
  isSupportedLanguage,
} from '../i18n/settings';
import { PageContainer } from '@/components/primitives';
import Navbar from '@/components/Navbar';

// NEXTJS provides these params to pages (layouts do NOT receive searchParams!), but no official interface exists, yet.
// https://github.com/vercel/next.js/discussions/46131
export type NextPageProps<ParamType = string> = {
  params: { locale: ParamType };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export async function generateStaticParams() {
  return ALL_LOCALES.map((lng) => ({ lng }));
}

export default function RootLayout({
  params: { locale },
  children,
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  const lang = isSupportedLanguage(locale) ? locale : fallbackLng;
  return (
    <html lang={lang} dir={dir(lang)} suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'light',
          }}
        >
          <div className="relative flex h-screen flex-col">
            <Navbar />
            <main className="container mx-auto max-w-6xl flex-grow px-2 sm:px-3">
              <Suspense fallback={<Spinner size="lg" />}>
                <PageContainer>{children}</PageContainer>
              </Suspense>
            </main>
            <footer className="flex w-full items-center justify-center py-2 sm:py-3">
              <span className="text-default-600">Powered by </span>
              <span className="text-primary">AXÉ DAO</span>
            </footer>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
