import { Container } from '@/components/public/container';

export function CollectionHero({
  title,
  description,
  label,
}: {
  title: string;
  description: string;
  label: string;
}) {
  return (
    <header className="border-b border-border pt-28 sm:pt-32">
      <Container className="grid gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:pb-24">
        <div>
          <p className="mb-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
            {label}
          </p>
          <h1 className="max-w-4xl text-balance font-heading text-5xl font-bold leading-[0.96] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
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
