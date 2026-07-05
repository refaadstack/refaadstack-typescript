import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicProduct } from '@/lib/public-data';

export function Products({ products }: { products: PublicProduct[] }) {
  return (
    <section id="products" className="py-20 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          title="Produk siap pakai untuk pekerjaan yang berulang."
          description="Dibangun dari pola masalah yang sering kami temui dalam project nyata."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {products.slice(0, 2).map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-[16/9] overflow-hidden bg-black"
                >
                  <Image
                    src={product.imageUrl || '/images/refaadstack-system-still.png'}
                    alt={`Visual produk ${product.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div>
                    <h3 className="font-heading text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
                      {product.name}
                    </h3>
                    <p className="mt-3 max-w-[48ch] leading-7 text-muted-foreground">
                      {product.tagline}
                    </p>
                  </div>
                  <ul className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    {product.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" weight="bold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                    <span className="text-sm font-semibold text-foreground">{product.price}</span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-foreground"
                    >
                      Detail produk
                      <ArrowRight className="size-4" weight="bold" />
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
