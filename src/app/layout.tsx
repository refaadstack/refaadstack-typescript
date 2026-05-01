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
  openGraph: {
    title: 'RefaadStack – Build Better Digital Solutions',
    description:
      'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk bisnis Anda.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'RefaadStack',
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
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${syne.variable} font-sans antialiased`}
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
