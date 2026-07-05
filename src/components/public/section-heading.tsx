import { cn } from '@/lib/utils';

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = 'left',
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-heading text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-5 max-w-[62ch] text-pretty text-base leading-7 text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
