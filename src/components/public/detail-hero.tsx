import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';

export function DetailHero({
  backHref,
  backLabel,
  label,
  title,
  summary,
  image,
  meta,
}: {
  backHref: string;
  backLabel: string;
  label: string;
  title: string;
  summary: string;
  image: string;
  meta?: { label: string; value: string }[];
}) {
  return (
    <header className="pt-28 sm:pt-32">
      <Container>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" weight="bold" />
          {backLabel}
        </Link>
        <div className="grid gap-10 pb-12 pt-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:pb-16">
          <div>
            <p className="mb-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              {label}
            </p>
            <h1 className="max-w-5xl text-balance font-heading text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              {title}
            </h1>
          </div>
          <div>
            <p className="text-pretty text-lg leading-8 text-muted-foreground">{summary}</p>
            {meta?.length ? (
              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-5">
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
        <div className="relative aspect-[16/8] min-h-72 overflow-hidden rounded-2xl border border-border bg-black">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
        </div>
      </Container>
    </header>
  );
}
