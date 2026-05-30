export interface SiteSettingsInput {
  site_title: string;
  site_description: string;
  site_keywords: string[];
  og_image_url: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsInput = {
  site_title: 'RefaadStack - Build Better Digital Solutions',
  site_description:
    'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk bisnis Anda.',
  site_keywords: [
    'software house',
    'digital solutions',
    'website development',
    'POS system',
    'SaaS',
    'web application',
    'Next.js',
    'react',
  ],
  og_image_url: '/og-image.png',
  canonical_url: 'https://refaadstack.dev',
  robots_index: true,
  robots_follow: true,
};
