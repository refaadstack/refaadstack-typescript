import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicPortfolio } from '@/lib/public-data';

export function Portfolio({ portfolios }: { portfolios: PublicPortfolio[] }) {
  return (
    <section id="portfolio" className="py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Kerja yang sudah menjadi bagian dari bisnis."
            description="Beberapa website, produk, dan sistem yang kami bangun bersama klien."
          />
          <Link
            href="/portfolio"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition hover:text-foreground"
          >
            Semua portfolio
            <ArrowRight className="size-4" weight="bold" />
          </Link>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-12">
          {portfolios.slice(0, 4).map((portfolio, index) => {
            const isWide = index === 0 || index === 3;

            return (
              <Reveal
                key={portfolio.id}
                className={isWide ? 'lg:col-span-7' : 'lg:col-span-5'}
                delay={(index % 2) * 0.06}
              >
                <article className="group">
                  <Link
                    href={`/portfolio/${portfolio.slug}`}
                    className={`relative block overflow-hidden rounded-2xl border border-border bg-black ${
                      isWide ? 'aspect-[16/10]' : 'aspect-[4/3]'
                    }`}
                  >
                    <Image
                      src={
                        portfolio.images[0]?.imageUrl ||
                        '/images/refaadstack-system-still.png'
                      }
                      alt={`Preview ${portfolio.title}`}
                      fill
                      sizes={isWide ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'}
                      className="object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  </Link>
                  <div className="mt-5 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold text-primary">{portfolio.category}</p>
                      <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                        <Link href={`/portfolio/${portfolio.slug}`}>{portfolio.title}</Link>
                      </h3>
                      <p className="mt-2 max-w-[54ch] text-sm leading-6 text-muted-foreground">
                        {portfolio.shortDescription || portfolio.fullDescription}
                      </p>
                    </div>
                    <ArrowRight
                      className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
                      weight="bold"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
