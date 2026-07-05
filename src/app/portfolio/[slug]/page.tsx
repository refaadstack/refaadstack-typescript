import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/sections/cta';
import { DetailHero } from '@/components/public/detail-hero';
import { DetailSections } from '@/components/public/detail-sections';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { getPublicPortfolioBySlug } from '@/lib/public-data';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const portfolio = await getPublicPortfolioBySlug(params.slug);
  if (!portfolio) return {};

  const description = portfolio.shortDescription || portfolio.fullDescription;
  const image = portfolio.images[0]?.imageUrl || '/og-image.png';

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
  const image =
    portfolio.images[0]?.imageUrl || '/images/refaadstack-system-still.png';

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: portfolio.title,
          description: summary,
          image,
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
        image={image}
        meta={[
          { label: 'Kategori', value: portfolio.category },
          {
            label: 'Teknologi',
            value: portfolio.techStack.slice(0, 2).join(', ') || 'Custom stack',
          },
        ]}
      />
      <DetailSections
        sections={[
          {
            title: 'Gambaran pekerjaan',
            body: portfolio.fullDescription || summary,
          },
          {
            title: 'Masalah',
            body: portfolio.problem || 'Project dimulai dengan pemetaan kebutuhan dan alur kerja utama.',
          },
          {
            title: 'Solusi',
            body: portfolio.solution || 'Solusi dirancang secara modular agar mudah dipakai dan dikembangkan.',
          },
          {
            title: 'Dampak',
            body: portfolio.impactResult || 'Hasil project berfokus pada alur kerja yang lebih jelas dan pengalaman pengguna yang lebih baik.',
          },
        ]}
        lists={[{ title: 'Tech stack', items: portfolio.techStack }]}
      />
      <CTA />
    </PublicShell>
  );
}
