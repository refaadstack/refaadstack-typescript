import {
  Code,
  DeviceMobile,
  MagnifyingGlass,
  Path,
  Stack,
  Strategy,
} from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';

const REASONS = [
  {
    icon: Strategy,
    title: 'Mulai dari masalah bisnis',
    description: 'Fitur dipilih karena berguna, bukan hanya karena terlihat menarik.',
  },
  {
    icon: Path,
    title: 'Proses yang terbuka',
    description: 'Scope, progres, dan keputusan teknis dibicarakan dengan bahasa yang jelas.',
  },
  {
    icon: Stack,
    title: 'Arsitektur yang dapat tumbuh',
    description: 'Fondasi dibuat modular agar perubahan berikutnya tidak dimulai dari nol.',
  },
  {
    icon: Code,
    title: 'Kode yang dapat dirawat',
    description: 'Struktur dan dokumentasi menjaga produk tetap sehat setelah diluncurkan.',
  },
  {
    icon: DeviceMobile,
    title: 'Pengalaman lintas perangkat',
    description: 'Tampilan dan interaksi diuji dari layar kecil hingga desktop.',
  },
  {
    icon: MagnifyingGlass,
    title: 'SEO tetap menjadi fondasi',
    description: 'Metadata, struktur semantik, dan performa dibangun sejak awal.',
  },
];

export function WhyUs() {
  return (
    <section id="why" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <h2 className="max-w-5xl text-balance font-heading text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-[3.25rem] lg:leading-[1.06]">
            Kami bukan sekadar vendor. Kami{' '}
            <span className="text-primary-strong">mitra teknologi</span> yang ikut
            memikirkan pertumbuhan bisnis kamu jangka panjang.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={(index % 3) * 0.05}>
              <article className="border-t border-border pt-6">
                <reason.icon className="size-5 text-primary" weight="bold" />
                <h3 className="mt-4 font-heading text-lg font-bold tracking-[-0.02em] text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 max-w-[40ch] text-sm leading-6 text-muted-foreground">
                  {reason.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
