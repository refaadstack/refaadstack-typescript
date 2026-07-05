import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { getPublicBlogPosts } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artikel RefaadStack tentang pengembangan website, produk digital, sistem bisnis, dan technical SEO.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();

  return (
    <PublicShell>
      <CollectionHero
        label="Blog"
        title="Catatan untuk membangun produk digital dengan lebih jernih."
        description="Pemikiran praktis tentang strategi web, engineering, operasional, dan pertumbuhan produk."
      />
      <Container className="grid gap-x-7 gap-y-14 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-muted-foreground sm:col-span-2 lg:col-span-3">
            Belum ada artikel published di database.
          </div>
        ) : (
          posts.map((post) => (
            <ContentCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              image={post.image}
              imageAlt={`Ilustrasi artikel ${post.title}`}
              label={post.category}
              title={post.title}
              description={post.excerpt}
              meta={`${formatDate(post.publishedAt)} | ${post.readingTime}`}
            />
          ))
        )}
      </Container>
    </PublicShell>
  );
}
