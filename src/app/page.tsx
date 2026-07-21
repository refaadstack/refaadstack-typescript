import { PublicShell } from '@/components/public/public-shell';
import { JsonLd } from '@/components/public/json-ld';
import { Marquee } from '@/components/public/marquee';
import { BlogPreview } from '@/components/sections/blog-preview';
import { CTA } from '@/components/sections/cta';
import { Hero } from '@/components/sections/hero';
import { Process } from '@/components/sections/process';
import { Products } from '@/components/sections/products';
import { Services } from '@/components/sections/services';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';
import { WhyUs } from '@/components/sections/why-us';
import { Work } from '@/components/sections/work';
import { getPublicHomeData } from '@/lib/public-data';
import { getSiteSettings } from '@/lib/crud';

export const revalidate = 60;

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RefaadStack',
  url: 'https://www.refaadstack.com',
  logo: 'https://www.refaadstack.com/logo.png',
  email: 'refaad16@gmail.com',
  telephone: '+62 823 7433 8273',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jambi',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://www.instagram.com/refaadstack/',
    'https://github.com/refaadstack',
    'https://www.linkedin.com/in/redho-fadillah-adha/',
  ],
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RefaadStack',
  url: 'https://www.refaadstack.com',
  inLanguage: 'id-ID',
};

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RefaadStack',
  image: 'https://www.refaadstack.com/logo.png',
  url: 'https://www.refaadstack.com',
  email: 'refaad16@gmail.com',
  telephone: '+62 823 7433 8273',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jambi',
    addressCountry: 'ID',
  },
  areaServed: ['Jambi', 'Indonesia'],
  sameAs: [
    'https://www.instagram.com/refaadstack/',
    'https://github.com/refaadstack',
    'https://www.linkedin.com/in/redho-fadillah-adha/',
  ],
  knowsAbout: [
    'Software Development',
    'Web Development',
    'Mobile App Development',
    'POS System',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '17:00',
  },
};

export default async function HomePage() {
  const { services, projects, products, portfolios, testimonials, blogPosts } =
    await getPublicHomeData();

  let heroImageUrl = '';
  try {
    const settings = await getSiteSettings();
    heroImageUrl = settings.hero_image_url || '';
  } catch {
    // settings tidak tersedia — fallback ke local file
  }

  return (
    <PublicShell>
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <Hero heroImageUrl={heroImageUrl} />
      <Marquee />
      <Stats
        workCount={projects.length + portfolios.length}
        productCount={products.length}
      />
      <Services services={services} />
      <WhyUs />
      <Work projects={projects} portfolios={portfolios} />
      <Products products={products} />
      <Process />
      <Testimonials testimonials={testimonials} />
      <BlogPreview posts={blogPosts} />
      <CTA />
    </PublicShell>
  );
}
