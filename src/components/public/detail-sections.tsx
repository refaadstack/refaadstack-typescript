import { Check } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';

export function DetailSections({
  sections,
  lists,
}: {
  sections: { title: string; body: string }[];
  lists?: { title: string; items: string[] }[];
}) {
  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <div>
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.04}>
              <article className="border-t border-border py-8 sm:py-10">
                <h2 className="font-heading text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-5 max-w-[68ch] text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                  {section.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {lists?.length ? (
          <aside className="space-y-9 lg:sticky lg:top-28 lg:self-start">
            {lists.map((list) => (
              <div key={list.title}>
                <h2 className="text-sm font-bold text-foreground">{list.title}</h2>
                <ul className="mt-4 space-y-3">
                  {list.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                    >
                      <Check className="mt-1 size-3.5 shrink-0 text-primary" weight="bold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>
        ) : null}
      </Container>
    </section>
  );
}
