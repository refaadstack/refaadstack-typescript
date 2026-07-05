import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { getPublicProducts } from '@/lib/public-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Produk',
  description:
    'Produk digital RefaadStack untuk kasir retail, undangan digital, dan kebutuhan operasional bisnis.',
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsPage() {
  const products = await getPublicProducts();

  return (
    <PublicShell>
      <CollectionHero
        label="Produk"
        title="Perangkat digital untuk pekerjaan yang perlu lebih rapi."
        description="Produk siap pakai yang tetap memberi ruang untuk kebutuhan bisnis yang spesifik."
      />
      <Container className="grid gap-x-7 gap-y-14 py-16 sm:grid-cols-2 sm:py-24">
        {products.map((product) => (
          <ContentCard
            key={product.id}
            href={`/products/${product.slug}`}
            image={product.imageUrl || '/images/refaadstack-system-still.png'}
            imageAlt={`Visual produk ${product.name}`}
            label="Produk RefaadStack"
            title={product.name}
            description={product.tagline}
            meta={product.price}
          />
        ))}
      </Container>
    </PublicShell>
  );
}
