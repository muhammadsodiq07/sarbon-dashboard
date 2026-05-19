import type { Metadata } from 'next';
import { QueryProvider } from '@/app/providers';
import { I18nHydrator } from './I18nhydrator';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sarbon — Dispatcher',
  description: 'Sarbon dispatcher cargo management platform.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nHydrator />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}