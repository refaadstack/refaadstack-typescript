import { ChatCircle, Envelope } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { COMPANY } from '@/lib/constants';

export function CTA() {
  return (
    <section id="cta" className="bg-primary text-black">
      <Container className="py-20 sm:py-28 lg:py-32">
        <Reveal>
          <div className="max-w-4xl">
            <h2 className="text-balance font-heading text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Punya bisnis yang perlu dibantu digitalisasi?
            </h2>
            <p className="mt-6 max-w-[55ch] text-pretty text-lg leading-8 text-black/70">
              Butuh pembuatan aplikasi, website, atau sistem digital untuk bisnismu? Ceritakan kebutuhanmu — kami bantu kasih arahan yang tepat.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya mau cerita bisnis saya`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition duration-200 hover:bg-zinc-900 active:translate-y-px"
              >
                <ChatCircle className="mr-2 size-5" weight="bold" />
                Ceritakan bisnis kamu
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex h-12 items-center gap-2 px-1 text-base font-semibold text-black underline-offset-4 transition hover:underline"
              >
                <Envelope className="size-5" weight="bold" />
                {COMPANY.email}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
