import Link from 'next/link';
import { ArrowRight, Check } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { SectionHeading } from '@/components/public/section-heading';
import { resolveImage } from '@/lib/assets';
import type { PublicProduct } from '@/lib/public-data';
import { cn } from '@/lib/utils';

export function Products({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) return null;

  const spans = ['lg:col-span-7', 'lg:col-span-5'];

  return (
    <section id="products" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          title="Produk siap pakai untuk pekerjaan yang berulang."
          description="Dibangun dari pola masalah yang sering kami temui dalam project nyata."
        />

        <div className="mt-14 grid gap-x-7 gap-y-12 lg:grid-cols-12">
          {products.slice(0, 2).map((product, index) => (
            <Reveal
              key={product.id}
              delay={index * 0.08}
              className={cn(spans[index] ?? 'lg:col-span-6')}
            >
              <article className="group flex h-full flex-col">
                <Link href={`/products/${product.slug}`} className="block">
                  <ScreenshotFrame
                    src={resolveImage(product.imageUrl, `/images/products/${product.slug}.png`)}
                    alt={`Tampilan produk ${product.name}`}
                    label={product.slug}
                    aspect="aspect-[16/10]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    imageClassName="transition duration-500 group-hover:scale-[1.02]"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-7">
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
                    {product.name}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-pretty leading-7 text-muted-foreground">
                    {product.tagline}
                  </p>

                  <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    {product.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" weight="bold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                    <p className="font-heading text-lg font-bold tracking-[-0.02em] text-foreground">
                      {product.price}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary-strong transition hover:text-foreground"
                    >
                      Detail produk
                      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" weight="bold" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
