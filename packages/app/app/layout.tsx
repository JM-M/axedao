import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import Navbar from '@/components/Navbar';
import SessionProvider from '@/components/SessionProvider';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';
import { getServerSession } from 'next-auth';
import { Provider as ThemeProvider } from './_providers/nextUI.provider';
import { Provider as SnackbarProvider } from './_providers/snackbar.provider';
import { Provider as Web3Provider } from './_providers/web3.provider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <SessionProvider session={session}>
          <ThemeProvider themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <SnackbarProvider>
              <Web3Provider>
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  {children}
                  <footer className="mt-auto flex w-full items-center justify-center gap-1 pb-20 md:pb-10 py-10">
                    <span className="text-default-600">Powered by </span>
                    <span className="text-primary">AXÉ DAO</span>
                  </footer>
                </div>
              </Web3Provider>
            </SnackbarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
