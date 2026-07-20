import Image from 'next/image';
import { Star } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicTestimonial } from '@/lib/public-data';

function Avatar({ testimonial }: { testimonial: PublicTestimonial }) {
  if (testimonial.avatarUrl) {
    return (
      <span className="relative block size-11 shrink-0 overflow-hidden rounded-full border border-border">
        <Image
          src={testimonial.avatarUrl}
          alt={`Foto ${testimonial.clientName}`}
          fill
          sizes="2.75rem"
          className="object-cover"
        />
      </span>
    );
  }

  const initials = testimonial.clientName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-black">
      {initials || 'R'}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  const rating = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={index < rating ? 'size-4 text-primary' : 'size-4 text-border'}
          weight={index < rating ? 'fill' : 'bold'}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function Testimonials({
  testimonials,
}: {
  testimonials: PublicTestimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading title="Apa kata klien." />

        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.06} className="h-full">
              <figure className="flex h-full flex-col border border-border bg-background p-7">
                <Rating value={testimonial.rating} />
                <blockquote className="mt-5 text-pretty leading-7 text-foreground">
                  “{testimonial.testimonial}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-7">
                  <Avatar testimonial={testimonial} />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {testimonial.clientName}
                    </p>
                    {testimonial.companyName ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {testimonial.companyName}
                      </p>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
