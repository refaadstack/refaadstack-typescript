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

function getSafeUrl(url: string, fallback: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === 'refaadstack.com') {
      parsedUrl.hostname = 'www.refaadstack.com';
    }

    return parsedUrl;
  } catch {
    return new URL(fallback);
  }
}

function getSafeIsoDate(value: string, fallback: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getSafeUrl(settings.canonical_url, 'https://www.refaadstack.com');
  const publishedTime = getSafeIsoDate(
    settings.published_time,
    '2026-05-01T00:00:00.000Z'
  );
  const modifiedTime = new Date().toISOString();

  return {
    metadataBase: canonicalUrl,
    title: settings.site_title,
    description: settings.site_description,
    keywords: settings.site_keywords,
    authors: [{ name: settings.author_name }],
    alternates: {
      canonical: canonicalUrl.toString(),
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: settings.site_title,
      description: settings.site_description,
      type: 'article',
      locale: 'id_ID',
      siteName: 'RefaadStack',
      url: canonicalUrl.toString(),
      publishedTime,
      modifiedTime,
      authors: [settings.author_name],
      images: [
        {
          url: settings.og_image_url,
          width: 1200,
          height: 630,
          alt: settings.site_title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_title,
      description: settings.site_description,
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
