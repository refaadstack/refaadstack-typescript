import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/sections/cta';
import { Container } from '@/components/public/container';
import { DetailHero } from '@/components/public/detail-hero';
import { DetailSections } from '@/components/public/detail-sections';
import { JsonLd } from '@/components/public/json-ld';
import { PortfolioGallery } from '@/components/public/portfolio-gallery';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicPortfolioBySlug } from '@/lib/public-data';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const portfolio = await getPublicPortfolioBySlug(params.slug);
  if (!portfolio) return {};

  const description = portfolio.shortDescription || portfolio.fullDescription;
  const image = resolveImageSrc(portfolio.images[0]?.imageUrl) || '/og-image.png';

  return {
    title: portfolio.title,
    description,
    alternates: {
      canonical: `/portfolio/${portfolio.slug}`,
    },
    openGraph: {
      title: portfolio.title,
      description,
      type: 'article',
      images: [image],
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const portfolio = await getPublicPortfolioBySlug(params.slug);
  if (!portfolio) notFound();

  const summary = portfolio.shortDescription || portfolio.fullDescription;
  const tech = portfolio.techStack.slice(0, 2).join(', ') || 'Custom stack';

  const galleryImages = portfolio.images.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    sortOrder: img.sortOrder,
  }));

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: portfolio.title,
          description: summary,
          image: resolveImageSrc(portfolio.images[0]?.imageUrl) || '/og-image.png',
          creator: {
            '@type': 'Organization',
            name: 'RefaadStack',
          },
        }}
      />
      <DetailHero
        backHref="/portfolio"
        backLabel="Kembali ke portfolio"
        label={portfolio.category}
        title={portfolio.title}
        summary={summary}
        image={null}
        meta={[
          { label: 'Kategori', value: portfolio.category },
          { label: 'Teknologi', value: tech },
        ]}
      />

      <Container className="pb-16 pt-8 sm:pb-20 sm:pt-12">
        <PortfolioGallery images={galleryImages} title={portfolio.title} />
      </Container>

      <DetailSections
        sections={[
          {
            title: 'Gambaran pekerjaan',
            body: portfolio.fullDescription || summary,
          },
          {
            title: 'Masalah',
            body: portfolio.problem || 'Tidak ada data — sedang diperbarui.',
          },
          {
            title: 'Solusi',
            body: portfolio.solution || 'Tidak ada data — sedang diperbarui.',
          },
          {
            title: 'Dampak',
            body: portfolio.impactResult || 'Tidak ada data — sedang diperbarui.',
          },
        ]}
        lists={[{ title: 'Tech stack', items: portfolio.techStack }]}
      />
      <CTA />
    </PublicShell>
  );
}
