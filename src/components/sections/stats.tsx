import { Container } from '@/components/public/container';
import { STATS } from '@/lib/constants';

export function Stats() {
  return (
    <section aria-label="Kapabilitas utama" className="border-b border-border">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-7 sm:py-9 ${
                index % 2 === 0 ? 'pr-5' : 'border-l border-border pl-5'
              } ${index >= 2 ? 'border-t border-border lg:border-t-0' : ''} ${
                index > 0 ? 'lg:border-l lg:border-border lg:pl-8' : ''
              }`}
            >
              <dt className="text-sm leading-6 text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 font-heading text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
