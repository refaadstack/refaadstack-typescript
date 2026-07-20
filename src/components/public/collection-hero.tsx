import { Container } from '@/components/public/container';
import { cn } from '@/lib/utils';

export function CollectionHero({
  title,
  description,
  label,
  layout = 'default',
  className,
}: {
  title: string;
  description: string;
  label: string;
  layout?: 'default' | 'compact';
  className?: string;
}) {
  return (
    <header className={cn('border-b border-border', className)}>
      <Container
        className={cn(
          'grid gap-10 pb-16 pt-28 sm:pt-32',
          layout === 'compact'
            ? 'lg:grid-cols-[minmax(0,1fr)_16rem] lg:pb-20 lg:items-start'
            : 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:pb-24 lg:items-end'
        )}
      >
        <div>
          <p className="mb-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
            {label}
          </p>
          <h1 className="max-w-4xl text-balance font-heading text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </div>
        <p className="max-w-[34ch] text-pretty text-base leading-7 text-muted-foreground lg:pb-1">
          {description}
        </p>
      </Container>
    </header>
  );
}
