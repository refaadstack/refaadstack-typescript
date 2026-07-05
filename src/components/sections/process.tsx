import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import { PROCESS_STEPS } from '@/lib/constants';

export function Process() {
  return (
    <section id="process" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          eyebrow="Cara kerja"
          title="Satu alur dari percakapan hingga produk live."
          description="Setiap tahap menghasilkan keputusan yang dapat diperiksa sebelum pekerjaan bergerak lebih jauh."
        />

        <div className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <article className="border-t border-border py-6 lg:min-h-56">
                <h3 className="font-heading text-xl font-bold tracking-[-0.025em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
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
