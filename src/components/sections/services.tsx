import {
  ArrowsClockwise,
  Browser,
  ChartLineUp,
  Cloud,
  CreditCard,
  PlugsConnected,
} from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicService } from '@/lib/public-data';

const ICONS = [
  Browser,
  ChartLineUp,
  CreditCard,
  Cloud,
  PlugsConnected,
  ArrowsClockwise,
];

export function Services({ services }: { services: PublicService[] }) {
  return (
    <section id="services" className="py-20 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          eyebrow="Layanan"
          title="Dari kebutuhan bisnis menuju sistem yang dapat dipakai."
          description="Kami menggabungkan strategi, desain, dan engineering untuk membangun pengalaman digital yang utuh."
        />

        <div className="mt-14 grid gap-x-12 lg:grid-cols-2">
          {services.slice(0, 6).map((service, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <Reveal key={service.id} delay={(index % 2) * 0.06}>
                <article className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-7 sm:grid-cols-[4rem_1fr] sm:gap-6 sm:py-9">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition group-hover:bg-primary group-hover:text-black">
                    <Icon className="size-5" weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                      {service.name}
                    </h3>
                    <p className="mt-3 max-w-[52ch] leading-7 text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
