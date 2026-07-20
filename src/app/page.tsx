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

export const revalidate = 3600;

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

export default async function HomePage() {
  const { services, projects, products, portfolios, testimonials, blogPosts } =
    await getPublicHomeData();

  return (
    <PublicShell>
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <Hero />
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
