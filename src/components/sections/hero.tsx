import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border pt-[4.5rem]">
      <div className="surface-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <Container className="relative grid min-h-[calc(100dvh-4.5rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] lg:py-14">
        <div className="relative z-10 max-w-2xl">
          <Reveal>
            <p className="mb-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              Software house untuk UMKM Jambi
            </p>
            <h1 className="text-balance font-heading text-5xl font-bold leading-[0.96] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
              Bikin website & aplikasi untuk bisnis loe — tanpa pusing teknis
            </h1>
            <p className="mt-6 max-w-[54ch] text-pretty text-lg leading-8 text-muted-foreground">
              Gue handle desain, coding, dan maintenance. Loe tinggal fokus jualan dan layanan pelanggan. Pertama kali? Konsultasi gratis via WA.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatCircle className="mr-2 size-5" weight="bold" />
                Mulai konsultasi
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                Lihat project
                <ArrowRight className="ml-2 size-5" weight="bold" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="relative lg:-mr-12">
          <div className="editorial-shadow relative aspect-[4/3] min-h-[24rem] overflow-hidden rounded-2xl border border-border bg-black">
            <Image
              src="/images/refaadstack-system-still.png"
              alt="Komposisi abstrak berwarna hitam, putih, dan pink yang menggambarkan sistem digital modular"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
