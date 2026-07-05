import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { RichTextContent } from '@/components/public/rich-text-content';
import { getPublicBlogPostBySlug, getPublicBlogPosts } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublicBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublicBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPublicBlogPostBySlug(params.slug);
  if (!post) notFound();
  const imageUrl = post.image.startsWith('http')
    ? post.image
    : `https://www.refaadstack.com${post.image}`;

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: imageUrl,
          datePublished: new Date(post.publishedAt).toISOString(),
          author: {
            '@type': 'Person',
            name: post.authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: 'RefaadStack',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.refaadstack.com/logo.png',
            },
          },
        }}
      />
      <article className="pt-28 sm:pt-32">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" weight="bold" />
            Kembali ke blog
          </Link>

          <header className="mx-auto max-w-4xl pb-12 pt-10 text-center sm:pb-16">
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              {post.category}
            </p>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-[1] tracking-[-0.05em] text-foreground sm:text-6xl">
              {post.title}
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-pretty text-lg leading-8 text-muted-foreground">
              {post.excerpt}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span className="mx-2">|</span>
              {post.readingTime}
            </p>
          </header>

          <div className="relative aspect-[16/8] min-h-72 overflow-hidden rounded-2xl border border-border bg-black">
            <Image
              src={post.image}
              alt={`Ilustrasi artikel ${post.title}`}
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </div>

          <div className="mx-auto max-w-3xl py-16 sm:py-24">
            {post.contentHtml ? (
              <RichTextContent html={post.contentHtml} />
            ) : (
              post.sections.map((section) => (
                <section key={section.heading} className="mb-12">
                  <h2 className="font-heading text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </Container>
      </article>
    </PublicShell>
  );
}
