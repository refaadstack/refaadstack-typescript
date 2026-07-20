import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicPortfolios } from '@/lib/public-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Portfolio website, aplikasi, POS, SaaS, dan sistem digital yang dikerjakan oleh RefaadStack.',
  alternates: {
    canonical: '/portfolio',
  },
};

export default async function PortfolioPage() {
  const portfolios = await getPublicPortfolios();

  return (
    <PublicShell>
      <CollectionHero
        label="Portfolio"
        title="Karya yang sudah hidup di dalam bisnis."
        description="Pilihan website, produk, dan sistem yang dirancang untuk konteks operasional yang berbeda."
      />
      <Container className="grid gap-x-7 gap-y-14 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
        {portfolios.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground">
            Portfolio belum ditambahkan — segera hadir.
          </p>
        ) : (
          portfolios.map((portfolio) => (
            <ContentCard
              key={portfolio.id}
              href={`/portfolio/${portfolio.slug}`}
              image={resolveImageSrc(portfolio.images[0]?.imageUrl)}
              imageAlt={`Preview ${portfolio.title}`}
              label={portfolio.category}
              title={portfolio.title}
              description={portfolio.shortDescription || portfolio.fullDescription}
              meta={portfolio.techStack.slice(0, 2).join(', ')}
            />
          ))
        )}
      </Container>
    </PublicShell>
  );
}
