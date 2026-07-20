import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';

export function Stats({
  workCount,
  productCount,
}: {
  workCount: number;
  productCount: number;
}) {
  const stats = [
    {
      value: String(workCount),
      label: 'Project & sistem yang kami bangun',
    },
    {
      value: String(productCount),
      label: 'Produk siap pakai untuk bisnis',
    },
    {
      value: '< 24 jam',
      label: 'Respon konsultasi via WhatsApp',
    },
    {
      value: 'Jambi',
      label: 'Base kami, kerja remote ke seluruh Indonesia',
    },
  ];

  return (
    <section aria-label="Bukti dan kapabilitas" className="border-b border-border">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.05}
              className={`py-8 sm:py-10 ${
                index % 2 === 0 ? 'pr-5' : 'border-l border-border pl-5'
              } ${index >= 2 ? 'border-t border-border lg:border-t-0' : ''} ${
                index > 0 ? 'lg:border-l lg:border-border lg:pl-8' : ''
              }`}
            >
              <dd className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-none">
                {stat.value}
              </dd>
              <dt className="mt-3 max-w-[22ch] text-sm leading-5 text-muted-foreground">
                {stat.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
