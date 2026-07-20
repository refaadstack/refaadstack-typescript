import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { cn } from '@/lib/utils';

export function ContentCard({
  href,
  image,
  imageAlt,
  label,
  title,
  description,
  meta,
  aspect = 'aspect-[4/3]',
  className,
}: {
  href: string;
  image: string | null;
  imageAlt: string;
  label: string;
  title: string;
  description: string;
  meta?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <Link href={href} className="block">
        <ScreenshotFrame
          src={image}
          alt={imageAlt}
          chrome={false}
          aspect={aspect}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 34vw"
          imageClassName="transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-strong">
            {label}
          </p>
          {meta ? (
            <p className="truncate text-xs text-muted-foreground">{meta}</p>
          ) : null}
        </div>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-foreground">
          <Link href={href}>{title}</Link>
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary-strong transition hover:text-foreground"
        >
          Baca detail
          <ArrowRight className="size-4" weight="bold" />
        </Link>
      </div>
    </article>
  );
}
