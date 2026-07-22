import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/sections/cta';
import { Container } from '@/components/public/container';
import { DetailHero } from '@/components/public/detail-hero';
import { DetailSections } from '@/components/public/detail-sections';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
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
  const image = resolveImageSrc(portfolio.images[0]?.imageUrl);
  const tech = portfolio.techStack.slice(0, 2).join(', ') || 'Custom stack';

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: portfolio.title,
          description: summary,
          image: image || '/og-image.png',
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
          { label: 'Teknologi', value: tech },
        ]}
      />

      {portfolio.images.length > 1 && (
        <section className="py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl mb-8">
              Galeri Screenshot
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.images.slice(1).map((img, i) => (
                <ScreenshotFrame
                  key={img.id || i}
                  src={resolveImageSrc(img.imageUrl)}
                  alt={`Screenshot ${portfolio.title} ${i + 1}`}
                  chrome={false}
                  aspect="aspect-[16/10]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

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
