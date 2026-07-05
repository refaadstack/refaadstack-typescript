import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicBlogPost } from '@/lib/public-data';
import { formatDate } from '@/lib/utils';

export function BlogPreview({ posts }: { posts: PublicBlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Catatan tentang produk, web, dan sistem bisnis."
            description="Hal praktis yang kami pelajari ketika merancang dan membangun produk digital."
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition hover:text-foreground"
          >
            Semua tulisan
            <ArrowRight className="size-4" weight="bold" />
          </Link>
        </div>

        <div className="mt-14">
          {posts.slice(0, 3).map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.04}>
              <article className="group grid gap-5 border-t border-border py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:py-9">
                <div className="text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span className="mt-1 block">{post.readingTime}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">{post.category}</p>
                  <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowRight
                  className="hidden size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary sm:block"
                  weight="bold"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
