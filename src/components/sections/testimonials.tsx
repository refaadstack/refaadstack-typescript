import { Quotes } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import type { PublicTestimonial } from '@/lib/public-data';

export function Testimonials({
  testimonials,
}: {
  testimonials: PublicTestimonial[];
}) {
  if (testimonials.length === 0) return null;

  const [featured, ...others] = testimonials;

  return (
    <section id="testimonials" className="border-y border-border bg-surface py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_0.38fr] lg:items-end">
        <Reveal>
          <Quotes className="size-9 text-primary" weight="fill" />
          <blockquote className="mt-7 max-w-4xl text-pretty font-heading text-3xl font-bold leading-[1.16] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            “{featured.testimonial}”
          </blockquote>
          <p className="mt-7 text-sm font-semibold text-foreground">
            {featured.clientName}
            {featured.companyName ? (
              <span className="font-normal text-muted-foreground">, {featured.companyName}</span>
            ) : null}
          </p>
        </Reveal>

        {others.length > 0 ? (
          <Reveal delay={0.08}>
            <p className="text-sm leading-6 text-muted-foreground">
              Dipercaya untuk membantu tim membangun sistem yang lebih rapi dan pengalaman digital yang lebih meyakinkan.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {others.slice(0, 4).map((testimonial) => (
                <span key={testimonial.id} className="text-sm font-semibold text-foreground">
                  {testimonial.companyName || testimonial.clientName}
                </span>
              ))}
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
