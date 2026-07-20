import Image from 'next/image';
import { ImageSquare } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

/**
 * Sharp-cornered frame for real screenshots. Renders a minimal browser
 * chrome bar by default; pass chrome={false} for a bare image block.
 * When src is null, renders a designed placeholder slot instead of a
 * broken image.
 */
export function ScreenshotFrame({
  src,
  alt,
  label,
  chrome = true,
  aspect = 'aspect-[16/10]',
  sizes = '(max-width: 1024px) 100vw, 50vw',
  priority = false,
  className,
  imageClassName,
}: {
  src: string | null;
  alt: string;
  label?: string;
  chrome?: boolean;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn('overflow-hidden border border-border bg-card', className)}>
      {chrome ? (
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-primary" aria-hidden />
          {label ? (
            <span className="ml-2 truncate font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className={cn('relative bg-surface', aspect)}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn('object-cover object-top', imageClassName)}
          />
        ) : (
          <div className="surface-grid absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageSquare className="size-7" weight="bold" aria-hidden />
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em]">
              Screenshot segera hadir
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
