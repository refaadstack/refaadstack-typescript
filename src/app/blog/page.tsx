import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicBlogPosts } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog Pembuatan Aplikasi & Web Development',
  description:
    'Artikel RefaadStack tentang pengembangan website, produk digital, sistem bisnis, dan technical SEO.',
  alternates: {
    canonical: '/blog',
  },
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
          <p className="col-span-full text-sm text-muted-foreground">
            Belum ada artikel — pantau terus untuk tulisan terbaru.
          </p>
        ) : (
          posts.map((post) => (
            <ContentCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              image={resolveImageSrc(post.image)}
              imageAlt={`Ilustrasi artikel ${post.title}`}
              label={post.category}
              title={post.title}
              description={post.excerpt}
              meta={`${formatDate(post.publishedAt)}`}
            />
          ))
        )}
      </Container>
    </PublicShell>
  );
}
