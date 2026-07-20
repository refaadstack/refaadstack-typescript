import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageSquare } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import { resolveImage } from '@/lib/assets';
import type { PublicBlogPost } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export function BlogPreview({ posts }: { posts: PublicBlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Catatan tentang produk, web, dan sistem bisnis."
            description="Hal praktis yang kami pelajari ketika merancang dan membangun produk digital."
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-strong transition hover:text-foreground"
          >
            Semua tulisan
            <ArrowRight className="size-4" weight="bold" />
          </Link>
        </div>

        <div className="mt-14 border-b border-border">
          {posts.slice(0, 3).map((post, index) => {
            const image = resolveImage(post.image, `/images/blog/${post.slug}.png`);

            return (
              <Reveal key={post.slug} delay={index * 0.04}>
                <article className="group grid gap-5 border-t border-border py-7 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center sm:gap-8 sm:py-8">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block aspect-[16/10] w-full overflow-hidden border border-border bg-surface sm:aspect-[4/3] sm:w-[8.5rem]"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`Cover ${post.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 8.5rem"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="surface-grid absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <ImageSquare className="size-6" weight="bold" aria-hidden />
                      </span>
                    )}
                  </Link>

                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      {` · ${post.readingTime}`}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary-strong">{post.category}</p>
                    <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-[62ch] text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>

                  <ArrowRight
                    className="hidden size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary sm:block"
                    weight="bold"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
