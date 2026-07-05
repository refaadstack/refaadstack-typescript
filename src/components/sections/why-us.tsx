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
    description: 'Fondasi dibuat modular agar perubahan berikutnya tidak selalu dimulai dari nol.',
  },
  {
    icon: Code,
    title: 'Kode yang dapat dirawat',
    description: 'Struktur dan dokumentasi membantu produk tetap sehat setelah diluncurkan.',
  },
  {
    icon: DeviceMobile,
    title: 'Pengalaman lintas perangkat',
    description: 'Tampilan dan interaksi diuji dari layar kecil hingga desktop.',
  },
  {
    icon: MagnifyingGlass,
    title: 'SEO tetap menjadi fondasi',
    description: 'Metadata, struktur semantik, performa, dan tautan internal dibangun sejak awal.',
  },
];

export function WhyUs() {
  return (
    <section id="why" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-36">
      <Container className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="text-balance font-heading text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-5xl">
              Teknologi yang terasa masuk akal bagi orang yang memakainya.
            </h2>
            <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-8 text-muted-foreground">
              Kami menjaga keputusan desain dan teknis tetap dekat dengan pekerjaan nyata di dalam bisnis.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-x-8 sm:grid-cols-2">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={(index % 2) * 0.06}>
              <article className="border-t border-border py-7">
                <reason.icon className="size-6 text-primary" weight="bold" />
                <h3 className="mt-5 font-heading text-lg font-bold tracking-[-0.02em] text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
