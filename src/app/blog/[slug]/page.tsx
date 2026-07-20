import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { CTA } from '@/components/sections/cta';
import { Container } from '@/components/public/container';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { RichTextContent } from '@/components/public/rich-text-content';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { resolveImageSrc } from '@/lib/assets';
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
      images: [resolveImageSrc(post.image) || '/og-image.png'],
    },
  };
}

function AuthorBadge({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
        {initials || 'R'}
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">Penulis</p>
      </div>
    </div>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPublicBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: resolveImageSrc(post.image) || '/og-image.png',
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
      <article className="pb-16 pt-24 sm:pb-24 sm:pt-28">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary-strong"
          >
            <ArrowLeft className="size-4" weight="bold" />
            Kembali ke blog
          </Link>

          <header className="max-w-4xl pb-12 pt-10 sm:pb-16">
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
              {post.category}
            </p>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-[1] tracking-[-0.05em] text-foreground sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-8 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <AuthorBadge name={post.authorName} />
              <p className="text-sm text-muted-foreground">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span className="mx-2">·</span>
                {post.readingTime}
              </p>
            </div>
          </header>

          <ScreenshotFrame
            src={resolveImageSrc(post.image)}
            alt={`Ilustrasi artikel ${post.title}`}
            label={post.category}
            aspect="aspect-[16/8]"
            sizes="(max-width: 1400px) 100vw, 1400px"
            priority
          />

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
      <CTA />
    </PublicShell>
  );
}
