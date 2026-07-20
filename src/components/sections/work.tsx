import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { SectionHeading } from '@/components/public/section-heading';
import { resolveImage } from '@/lib/assets';
import type { PublicPortfolio, PublicProject } from '@/lib/public-data';
import { cn } from '@/lib/utils';

type WorkItem = {
  key: string;
  href: string;
  title: string;
  category: string;
  summary: string;
  image: string | null;
  type: 'Project' | 'Portfolio';
  year?: string;
  featured: boolean;
  createdAt: string;
};

export function Work({
  projects,
  portfolios,
}: {
  projects: PublicProject[];
  portfolios: PublicPortfolio[];
}) {
  const items: WorkItem[] = [
    ...projects.map((project) => ({
      key: `project-${project.id}`,
      href: `/projects/${project.slug}`,
      title: project.title,
      category: project.category,
      summary: project.summary,
      image: resolveImage(project.image, `/images/work/${project.slug}.png`),
      type: 'Project' as const,
      year: project.year,
      featured: project.featured,
      createdAt: project.createdAt,
    })),
    ...portfolios.map((portfolio) => ({
      key: `portfolio-${portfolio.id}`,
      href: `/portfolio/${portfolio.slug}`,
      title: portfolio.title,
      category: portfolio.category,
      summary: portfolio.shortDescription || portfolio.fullDescription,
      image: resolveImage(
        portfolio.images[0]?.imageUrl,
        `/images/work/${portfolio.slug}.png`
      ),
      type: 'Portfolio' as const,
      year: undefined,
      featured: portfolio.featured,
      createdAt: portfolio.createdAt,
    })),
  ]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  if (items.length === 0) return null;

  const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4'];
  const aspects = ['aspect-[16/10]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3]'];

  return (
    <section id="work" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Karya"
            title="Karya yang sudah hidup di dalam bisnis."
            description="Website, produk, dan sistem yang kami bangun untuk konteks operasional yang berbeda."
          />
          <div className="flex shrink-0 items-center gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-strong transition hover:text-foreground"
            >
              Semua project
              <ArrowRight className="size-4" weight="bold" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-strong transition hover:text-foreground"
            >
              Semua portfolio
              <ArrowRight className="size-4" weight="bold" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-x-7 gap-y-12 lg:grid-cols-12">
          {items.map((item, index) => (
            <Reveal
              key={item.key}
              delay={(index % 2) * 0.06}
              className={cn(spans[index])}
            >
              <article className="group">
                <Link href={item.href} className="block">
                  <ScreenshotFrame
                    src={item.image}
                    alt={`Preview ${item.title}`}
                    chrome={false}
                    aspect={aspects[index]}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    imageClassName="transition duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-strong">
                      {item.type}
                      {item.category ? ` · ${item.category}` : ''}
                      {item.year ? ` · ${item.year}` : ''}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                      <Link href={item.href}>{item.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-[54ch] text-sm leading-6 text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
                    weight="bold"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
