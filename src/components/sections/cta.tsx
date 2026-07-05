import { ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(255,102,196,0.11),transparent)]" />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-balance font-heading text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Punya bisnis yang perlu dibantu digitalin?
            </h2>
            <p className="mx-auto mt-6 max-w-[55ch] text-pretty text-lg leading-8 text-muted-foreground">
              Ceritain ke gue masalahnya. Bisa jadi loe butuh website baru, aplikasi, atau cuma perlu ditunjukin langkah yang cocok. Konsultasi gratis, gak ada kewajiban.
            </p>
            <Button asChild size="lg" className="mt-9">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya mau cerita bisnis saya`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatCircle className="mr-2 size-5" weight="bold" />
                Ceritain bisnis loe
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
