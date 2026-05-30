import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { getSiteSettings } from '@/lib/crud';

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
    return new URL(url);
  } catch {
    return new URL(fallback);
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getSafeUrl(settings.canonical_url, 'https://refaadstack.dev');

  return {
    metadataBase: canonicalUrl,
    title: settings.site_title,
    description: settings.site_description,
    keywords: settings.site_keywords,
    authors: [{ name: 'RefaadStack' }],
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
      type: 'website',
      locale: 'id_ID',
      siteName: 'RefaadStack',
      url: canonicalUrl.toString(),
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
