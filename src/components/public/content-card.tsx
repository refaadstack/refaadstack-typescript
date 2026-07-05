import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

export function ContentCard({
  href,
  image,
  imageAlt,
  label,
  title,
  description,
  meta,
  className,
}: {
  href: string;
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  description: string;
  meta?: string;
  className?: string;
}) {
  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-black"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 34vw"
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-primary">{label}</p>
          {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-foreground">
          <Link href={href}>{title}</Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary transition hover:text-foreground"
        >
          Baca detail
          <ArrowRight className="size-4" weight="bold" />
        </Link>
      </div>
    </article>
  );
}
