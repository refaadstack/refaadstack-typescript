import Link from 'next/link';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { Button } from '@/components/ui/button';
import { publicImageExists } from '@/lib/assets';
import { COMPANY } from '@/lib/constants';

export function Hero({ heroImageUrl = '' }: { heroImageUrl?: string }) {
  const heroImage = heroImageUrl
    ? heroImageUrl
    : publicImageExists('/images/hero/main.png')
      ? '/images/hero/main.png'
      : null;

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border pt-16">
      <div className="surface-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <Container className="relative grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="relative z-10">
          <Reveal>
            <p className="mb-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Software house Jambi · Pembuatan Aplikasi &amp; Website
            </p>
            <h1 className="text-balance font-heading text-[2.65rem] font-bold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[4.35rem]">
              {'Bikin website & aplikasi untuk bisnis kamu '}
              <span className="block text-primary">— tanpa pusing teknis</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Kami urus desain, coding, dan maintenance. Kamu tinggal fokus jualan dan melayani pelanggan. Pertama kali? Konsultasi gratis via WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
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

        <Reveal delay={0.08} className="relative">
          <div className="editorial-shadow">
            <ScreenshotFrame
              src={heroImage}
              alt="Tampilan dashboard sistem yang dibangun RefaadStack"
              label="refaadstack / dashboard"
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 48vw"
              priority
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
