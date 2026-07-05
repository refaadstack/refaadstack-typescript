import type { Metadata, Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const SITE_URL = 'https://www.refaadstack.com';
const SEO_TITLE = 'RefaadStack | Software House & Web Development Jambi';
const SEO_DESCRIPTION =
  'RefaadStack software house Jambi. Jasa pembuatan website, POS system, SaaS, dan aplikasi web untuk bisnis Anda. Konsultasi gratis.';
const SEO_KEYWORDS = [
  'RefaadStack',
  'Refaadstack Jambi',
  'Redho Fadillah Adha',
  'software house Jambi',
  'jasa pembuatan website Jambi',
  'jasa web application',
  'POS system Indonesia',
  'SaaS development',
  'IT Consultant Jambi',
  'Web Design Jambi',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: '%s | RefaadStack',
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: 'RefaadStack' }],
  creator: 'RefaadStack',
  publisher: 'RefaadStack',
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'hJ9FmOJNR4HnyOdx2LyMpo2GWauL3417fdofT6rR4Tg',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    type: 'website',
    locale: 'id_ID',
    siteName: 'RefaadStack',
    url: SITE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SEO_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    author: 'RefaadStack',
    'article:published_time': '2026-05-01T00:00:00.000Z',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${syne.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
