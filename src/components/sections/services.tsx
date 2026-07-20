import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicService } from '@/lib/public-data';

export function Services({ services }: { services: PublicService[] }) {
  return (
    <section id="services" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow="Layanan"
          title="Dari kebutuhan bisnis menuju sistem yang dapat dipakai."
          description="Kami menggabungkan strategi, desain, dan engineering untuk membangun pengalaman digital yang utuh."
        />

        <div className="mt-14 border-b border-border">
          {services.slice(0, 6).map((service, index) => (
            <Reveal key={service.id} delay={index * 0.04}>
              <article className="group grid grid-cols-[2.75rem_1fr] items-start gap-x-5 border-t border-border py-7 transition-colors hover:bg-surface sm:grid-cols-[5rem_1fr_1.1fr_2.5rem] sm:items-center sm:gap-x-8 sm:py-8">
                <span className="pt-1 font-mono text-sm font-semibold text-primary-strong sm:pt-0 sm:text-base">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-[1.75rem]">
                  {service.name}
                </h3>
                <p className="col-span-2 mt-3 max-w-[56ch] text-pretty leading-7 text-muted-foreground sm:col-span-1 sm:mt-0">
                  {service.description}
                </p>
                <ArrowUpRight
                  className="hidden size-6 text-muted-foreground transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block"
                  weight="bold"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
