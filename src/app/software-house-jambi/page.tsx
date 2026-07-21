import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { PublicShell } from '@/components/public/public-shell';
import { Reveal } from '@/components/public/reveal';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Software House Jambi',
  description:
    'RefaadStack adalah software house di Jambi. Kami membangun website, aplikasi web, POS system, dan SaaS untuk UMKM dan bisnis. Konsultasi gratis.',
  alternates: { canonical: '/software-house-jambi' },
  openGraph: {
    title: 'Software House Jambi — Pembuatan Aplikasi & Website | RefaadStack',
    description:
      'RefaadStack adalah software house di Jambi. Kami membangun website, aplikasi web, POS system, dan SaaS untuk UMKM dan bisnis. Konsultasi gratis.',
    url: '/software-house-jambi',
    siteName: 'RefaadStack',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function SoftwareHouseJambiPage() {
  return (
    <PublicShell>
      <section className="border-b border-border">
        <Container className="pb-16 pt-28 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
              RefaadStack · Sejak 2026
            </p>
            <h1 className="max-w-4xl text-balance font-heading text-4xl font-bold leading-[1] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Software House di Jambi
            </h1>
            <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-8 text-muted-foreground">
              RefaadStack adalah software house yang berbasis di Jambi, fokus pada pembuatan website, aplikasi web, POS system, dan SaaS untuk UMKM Indonesia. Kami menggabungkan konsultasi bisnis, desain, dan engineering dalam satu tim — jadi kamu cukup fokus jualan.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi`} target="_blank" rel="noopener noreferrer">
                  <ChatCircle className="mr-2 size-5" weight="bold" />
                  Mulai konsultasi
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  Portfolio kami
                  <ArrowRight className="ml-2 size-5" weight="bold" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container>
          <h2 className="font-heading text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
            Apa yang Kami Kerjakan
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Pembuatan Website', desc: 'Dari company profile hingga toko online — website profesional yang mobile-friendly dan SEO-ready.' },
              { title: 'Pembuatan Aplikasi Web', desc: 'POS system, SaaS, dashboard, sistem inventori — aplikasi custom untuk operasional bisnis.' },
              { title: 'Konsultasi Digital', desc: 'Arahan strategis untuk digitalisasi bisnis: dari pemilihan stack teknologi hingga roadmap produk.' },
              { title: 'UI/UX Design', desc: 'Desain antarmuka yang bersih dan mudah dipakai — diuji dari layar kecil hingga desktop.' },
              { title: 'Integrasi & Migrasi', desc: 'Hubungkan sistem lama dengan tools baru, atau pindahkan data dari platform lain ke sistem baru.' },
              { title: 'Maintenance & Support', desc: 'Dukungan teknis berkelanjutan — update, backup, monitoring, dan perbaikan bug.' },
            ].map((item) => (
              <article key={item.title} className="border-t border-border pt-6">
                <h3 className="font-heading text-xl font-bold tracking-[-0.025em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20 sm:py-28 lg:py-32">
        <Container className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-balance font-heading text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-[3.25rem]">
              Kenapa memilih software house di Jambi?
            </h2>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {[
              { title: 'Komunikasi lebih dekat', desc: 'Satu zona waktu, bahasa yang sama, dan bisa ketemu langsung kalau perlu diskusi teknis.' },
              { title: 'Paham konteks lokal', desc: 'Kami mengerti kebutuhan UMKM dan bisnis di Jambi — bukan template dari kota besar.' },
              { title: 'Harga lebih masuk akal', desc: 'Biaya operasional di Jambi lebih rendah, jadi budget project lebih efisien tanpa kurangi kualitas.' },
              { title: 'Remote-ready', desc: 'Meski base di Jambi, kami sudah terbiasa kerja remote dengan klien dari berbagai kota.' },
              { title: 'Full stack in-house', desc: 'Desain, frontend, backend, dan DevOps — semua dikerjakan oleh tim yang sama.' },
              { title: 'Dukungan jangka panjang', desc: 'Kami bukan vendor satu kali. Setelah project selesai, kami tetap dampingi.' },
            ].map((item) => (
              <article key={item.title} className="border-t border-border pt-6">
                <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32 bg-primary text-black">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-heading text-3xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Kerja bareng software house Jambi?
            </h2>
            <p className="mt-5 text-lg leading-8 text-black/70">
              Ceritakan ide atau masalah bisnismu. Kami bantu tentukan solusi terbaik — dari website sederhana sampai aplikasi custom.
            </p>
            <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo, saya tertarik kerja bareng software house Jambi`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition hover:bg-zinc-900">
              <ChatCircle className="mr-2 size-5" weight="bold" />
              Mulai diskusi
            </a>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
