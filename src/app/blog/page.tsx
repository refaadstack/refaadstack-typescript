import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { BlogFilter } from '@/components/public/blog-filter';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicBlogPosts } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog Pembuatan Aplikasi & Web Development',
  description:
    'Artikel RefaadStack tentang pengembangan website, produk digital, sistem bisnis, dan technical SEO.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog Pembuatan Aplikasi & Web Development | RefaadStack',
    description:
      'Artikel tentang pembuatan aplikasi web, optimasi bisnis digital, dan tips teknologi dari software house Jambi.',
    url: '/blog',
    siteName: 'RefaadStack',
    locale: 'id_ID',
    type: 'website',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; tag?: string }>;
}) {
  const posts = await getPublicBlogPosts();
  const { kategori, tag } = await searchParams;

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))];

  const filtered = posts.filter((post) => {
    if (kategori && post.category !== kategori) return false;
    if (tag && !(post.tags || []).includes(tag)) return false;
    return true;
  });

  return (
    <PublicShell>
      <CollectionHero
        label="Blog"
        title="Catatan untuk membangun produk digital dengan lebih jernih."
        description="Pemikiran praktis tentang strategi web, engineering, operasional, dan pertumbuhan produk."
      />
      <Suspense fallback={null}>
        <BlogFilter categories={categories} tags={allTags} />
      </Suspense>
      <Container className="grid gap-x-7 gap-y-14 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground py-12">
            Belum ada artikel.
          </p>
        ) : (
          filtered.map((post) => (
            <ContentCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              image={resolveImageSrc(post.image)}
              imageAlt={`Ilustrasi artikel ${post.title}`}
              label={post.category}
              title={post.title}
              description={post.excerpt}
              meta={formatDate(post.publishedAt)}
            />
          ))
        )}
      </Container>
    </PublicShell>
  );
}
