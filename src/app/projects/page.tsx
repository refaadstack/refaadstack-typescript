import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { getPublicProjects } from '@/lib/public-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Project',
  description:
    'Studi kasus project RefaadStack untuk website, aplikasi web, POS, dan platform SaaS.',
  alternates: {
    canonical: '/projects',
  },
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <PublicShell>
      <CollectionHero
        label="Project"
        title="Keputusan desain dan teknis dalam konteks nyata."
        description="Studi kasus tentang masalah, pendekatan, dan hasil yang menjadi dasar setiap project."
      />
      <Container className="grid gap-x-7 gap-y-14 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-muted-foreground sm:col-span-2 lg:col-span-3">
            Belum ada project aktif di database.
          </div>
        ) : (
          projects.map((project) => (
            <ContentCard
              key={project.slug}
              href={`/projects/${project.slug}`}
              image={project.image}
              imageAlt={`Visual project ${project.title}`}
              label={project.category}
              title={project.title}
              description={project.summary}
              meta={project.year}
            />
          ))
        )}
      </Container>
    </PublicShell>
  );
}
