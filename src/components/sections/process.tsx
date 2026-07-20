import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import { PROCESS_STEPS } from '@/lib/constants';

export function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          title="Satu alur dari percakapan hingga produk live."
          description="Setiap tahap menghasilkan keputusan yang dapat diperiksa sebelum pekerjaan bergerak lebih jauh."
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <article className="border-t border-border pt-6">
                <p className="font-heading text-5xl font-extrabold leading-none tracking-[-0.04em] text-primary-strong">
                  {step.number}
                </p>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-[-0.025em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
