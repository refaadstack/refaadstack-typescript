import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { Reveal } from '@/components/public/reveal';
import { SectionHeading } from '@/components/public/section-heading';
import type { PublicProject } from '@/lib/public-data';

export function Projects({ projects }: { projects: PublicProject[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="border-y border-border bg-surface py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Project"
            title="Masalah nyata, keputusan yang terukur."
            description="Setiap project dimulai dari alur kerja dan hasil yang ingin diperbaiki."
          />
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition hover:text-foreground"
          >
            Semua project
            <ArrowRight className="size-4" weight="bold" />
          </Link>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          {projects.slice(0, 2).map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <article className="group">
                <Link
                  href={`/projects/${project.slug}`}
                  className={`relative block overflow-hidden rounded-2xl border border-border bg-black ${
                    index === 0 ? 'aspect-[16/11]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={`Visual project ${project.title}`}
                    fill
                    sizes={index === 0 ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'}
                    className={`object-cover transition duration-500 group-hover:scale-[1.025] ${
                      index === 0 ? 'object-center' : 'object-[70%_center]'
                    }`}
                  />
                </Link>
                <p className="mt-5 text-xs font-semibold text-primary">{project.category}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="mt-3 max-w-[58ch] leading-7 text-muted-foreground">
                  {project.summary}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
