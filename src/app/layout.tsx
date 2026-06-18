import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { getSiteSettings } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

const SITE_URL = 'https://www.refaadstack.com';
const SEO_TITLE = 'RefaadStack — Software House & Web Development Jambi';
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

function getSafeIsoDate(value: string, fallback: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const publishedTime = getSafeIsoDate(
    settings.published_time,
    '2026-05-01T00:00:00.000Z'
  );
  const modifiedTime = new Date().toISOString();

  return {
    metadataBase: new URL(SITE_URL),
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    authors: [{ name: settings.author_name }],
    alternates: {
      canonical: SITE_URL,
    },
    verification: {
      // TODO: Ganti "PASTE_GSC_CODE" dengan verification code dari Google Search Console > Settings > Verification
      google: 'hJ9FmOJNR4HnyOdx2LyMpo2GWauL3417fdofT6rR4Tg',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: SEO_TITLE,
      description: SEO_DESCRIPTION,
      type: 'article',
      locale: 'id_ID',
      siteName: 'RefaadStack',
      url: SITE_URL,
      publishedTime,
      modifiedTime,
      authors: [settings.author_name],
      images: [
        {
          url: settings.og_image_url,
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
      images: [settings.og_image_url],
    },
    robots: {
      index: settings.robots_index,
      follow: settings.robots_follow,
    },
    other: {
      author: settings.author_name,
      'article:author': settings.author_name,
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'og:updated_time': modifiedTime,
    },
  };
}

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
