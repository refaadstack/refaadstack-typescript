import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'RefaadStack – Build Better Digital Solutions',
  description:
    'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk UMKM, startup, dan perusahaan yang ingin digitalisasi.',
  keywords: [
    'software house',
    'digital solutions',
    'website development',
    'POS system',
    'SaaS',
    'web application',
    'Next.js',
    'react',
  ],
  authors: [{ name: 'RefaadStack' }],
icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'RefaadStack – Build Better Digital Solutions',
    description:
      'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk bisnis Anda.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'RefaadStack',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RefaadStack - Build Better Digital Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RefaadStack – Build Better Digital Solutions',
    description:
      'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk bisnis Anda.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="id" suppressHydrationWarning className="overflow-x-hidden">
<body
        className={`${dmSans.variable} ${syne.variable} font-sans antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
