import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/sections/cta';
import { DetailHero } from '@/components/public/detail-hero';
import { DetailSections } from '@/components/public/detail-sections';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicProductBySlug, getPublicProducts } from '@/lib/public-data';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getPublicProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.tagline,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [resolveImageSrc(product.imageUrl) || '/og-image.png'],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getPublicProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: resolveImageSrc(product.imageUrl) || '/og-image.png',
          brand: {
            '@type': 'Brand',
            name: 'RefaadStack',
          },
        }}
      />
      <DetailHero
        backHref="/products"
        backLabel="Kembali ke produk"
        label="Produk RefaadStack"
        title={product.name}
        summary={product.tagline}
        image={resolveImageSrc(product.imageUrl)}
        meta={[
          { label: 'Harga', value: product.price },
          { label: 'Model', value: 'Siap pakai' },
        ]}
      />
      <DetailSections
        sections={[
          { title: 'Tentang produk', body: product.description },
        ]}
        lists={[{ title: 'Fitur utama', items: product.features }]}
      />
      <CTA />
    </PublicShell>
  );
}
