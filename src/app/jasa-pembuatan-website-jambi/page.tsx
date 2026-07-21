import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { PublicShell } from '@/components/public/public-shell';
import { Reveal } from '@/components/public/reveal';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Jambi',
  description:
    'Jasa pembuatan website profesional di Jambi untuk UMKM dan bisnis. Mulai dari company profile, landing page, hingga toko online. Konsultasi gratis.',
  alternates: { canonical: '/jasa-pembuatan-website-jambi' },
  openGraph: {
    title: 'Jasa Pembuatan Website Jambi — Profesional & Terjangkau | RefaadStack',
    description:
      'Jasa pembuatan website profesional di Jambi untuk UMKM dan bisnis. Mulai dari company profile, landing page, hingga toko online. Konsultasi gratis.',
    url: '/jasa-pembuatan-website-jambi',
    siteName: 'RefaadStack',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function JasaWebsitePage() {
  return (
    <PublicShell>
      <section className="border-b border-border">
        <Container className="pb-16 pt-28 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
              RefaadStack · Jambi
            </p>
            <h1 className="max-w-4xl text-balance font-heading text-4xl font-bold leading-[1] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Jasa Pembuatan Website di Jambi
            </h1>
            <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-8 text-muted-foreground">
              Kami merancang dan mengembangkan website profesional untuk UMKM, startup, dan bisnis di Jambi. Mulai dari company profile, landing page, hingga toko online — semuanya dibangun dengan teknologi modern, mobile-friendly, dan SEO-optimized sejak awal.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi pembuatan website`} target="_blank" rel="noopener noreferrer">
                  <ChatCircle className="mr-2 size-5" weight="bold" />
                  Konsultasi gratis
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  Lihat portfolio
                  <ArrowRight className="ml-2 size-5" weight="bold" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              { title: 'Company Profile', desc: 'Website profesional yang menampilkan identitas bisnis, layanan, dan portofolio. Cocok untuk branding UMKM Jambi.' },
              { title: 'Landing Page', desc: 'Halaman tunggal yang fokus pada konversi — ideal untuk kampanye, produk baru, atau lead generation.' },
              { title: 'Toko Online', desc: 'Website e-commerce ringan yang siap terima pesanan, dengan integrasi pembayaran dan manajemen produk.' },
              { title: 'SEO-Ready', desc: 'Setiap website kami dibangun dengan fondasi SEO: struktur semantik, meta tag, performa cepat, dan mobile-friendly.' },
              { title: 'Custom Dashboard', desc: 'Panel admin khusus untuk mengelola konten website tanpa perlu menyentuh kode.' },
              { title: 'Maintenance', desc: 'Update berkala, backup, dan dukungan teknis setelah website live — biar kamu fokus jualan.' },
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

      <section className="border-y border-border bg-primary py-20 sm:py-28 lg:py-32 text-black">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-heading text-3xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Butuh website untuk bisnis kamu di Jambi?
            </h2>
            <p className="mt-5 text-lg leading-8 text-black/70">
              Ceritakan kebutuhanmu — kami bantu pilih solusi yang tepat. Konsultasi gratis, tanpa kewajiban.
            </p>
            <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo, saya mau konsultasi jasa pembuatan website`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition hover:bg-zinc-900">
              <ChatCircle className="mr-2 size-5" weight="bold" />
              Ceritakan kebutuhan kamu
            </a>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
