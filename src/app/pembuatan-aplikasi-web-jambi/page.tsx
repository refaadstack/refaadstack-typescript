import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { PublicShell } from '@/components/public/public-shell';
import { Reveal } from '@/components/public/reveal';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Pembuatan Aplikasi Web Jambi',
  description:
    'Jasa pembuatan aplikasi web di Jambi untuk UMKM dan bisnis. POS system, SaaS, dashboard, dan aplikasi custom. Dibangun oleh software house lokal Jambi.',
  alternates: { canonical: '/pembuatan-aplikasi-web-jambi' },
  openGraph: {
    title: 'Pembuatan Aplikasi Web Jambi — POS, SaaS & Custom App | RefaadStack',
    description:
      'Jasa pembuatan aplikasi web di Jambi untuk UMKM dan bisnis. POS system, SaaS, dashboard, dan aplikasi custom. Dibangun oleh software house lokal Jambi.',
    url: '/pembuatan-aplikasi-web-jambi',
    siteName: 'RefaadStack',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function AplikasiWebPage() {
  return (
    <PublicShell>
      <section className="border-b border-border">
        <Container className="pb-16 pt-28 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Software house Jambi · Custom Development
            </p>
            <h1 className="max-w-4xl text-balance font-heading text-4xl font-bold leading-[1] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Pembuatan Aplikasi Web untuk Bisnis
            </h1>
            <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-8 text-muted-foreground">
              Kami merancang dan mengembangkan aplikasi web custom untuk operasional bisnis — POS system, SaaS platform, dashboard analitik, sistem otomatisasi, dan integrasi API. Semua dibangun dengan arsitektur yang scalable dan mudah dikembangkan.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi pembuatan aplikasi`} target="_blank" rel="noopener noreferrer">
                  <ChatCircle className="mr-2 size-5" weight="bold" />
                  Konsultasi gratis
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">
                  Lihat project
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
            Jenis Aplikasi yang Kami Bangun
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'POS System', desc: 'Aplikasi kasir digital untuk retail dan F&B — ringan, cepat, mendukung multi-outlet dan laporan real-time.' },
              { title: 'SaaS Platform', desc: 'Aplikasi berbasis langganan untuk kebutuhan spesifik. Dari project management tools hingga sistem membership.' },
              { title: 'Dashboard & Analytics', desc: 'Panel visual yang menampilkan data bisnis — penjualan, inventori, performa tim — dalam satu layar.' },
              { title: 'Sistem Otomatisasi', desc: 'Automasi workflow bisnis: dari reminder WhatsApp otomatis, email trigger, hingga report generator.' },
              { title: 'Integrasi API', desc: 'Hubungkan aplikasi yang sudah ada: payment gateway, WhatsApp API, marketplace, ERP, dan lainnya.' },
              { title: 'Aplikasi Inventori', desc: 'Lacak stok barang, kelola supplier, dan dapatkan notifikasi saat stok menipis — semua dalam satu dashboard.' },
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
        <Container>
          <h2 className="font-heading text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
            Proses Pembuatan Aplikasi
          </h2>
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { num: '01', title: 'Konsultasi', desc: 'Kita diskusi kebutuhan, tujuan, dan scope aplikasi. Gratis dan tanpa komitmen.' },
              { num: '02', title: 'Planning & Desain', desc: 'Wireframe, sitemap, UI/UX design, dan timeline project yang realistis.' },
              { num: '03', title: 'Development', desc: 'Pengembangan dengan teknologi modern, update progres berkala, staging untuk review.' },
              { num: '04', title: 'Testing & QA', desc: 'Testing fungsional, performa, cross-browser, dan mobile compatibility.' },
              { num: '05', title: 'Launching', desc: 'Deploy ke production, setup domain & SSL, training penggunaan sistem.' },
            ].map((step) => (
              <article key={step.num} className="border-t border-border pt-6">
                <p className="font-heading text-5xl font-extrabold leading-none tracking-[-0.04em] text-primary-strong">{step.num}</p>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-[-0.025em] text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32 bg-primary text-black">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-heading text-3xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Siap bangun aplikasi untuk bisnismu?
            </h2>
            <p className="mt-5 text-lg leading-8 text-black/70">
              Dari POS system sampai SaaS — kami siap bantu dari nol. Konsultasi gratis, tanpa kewajiban.
            </p>
            <a href={`https://wa.me/${COMPANY.whatsapp}?text=Halo, saya mau konsultasi pembuatan aplikasi web`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition hover:bg-zinc-900">
              <ChatCircle className="mr-2 size-5" weight="bold" />
              Ceritakan kebutuhan aplikasi kamu
            </a>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
