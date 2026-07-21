import type { Metadata } from 'next';
import { CollectionHero } from '@/components/public/collection-hero';
import { Container } from '@/components/public/container';
import { ContentCard } from '@/components/public/content-card';
import { PublicShell } from '@/components/public/public-shell';
import { resolveImageSrc } from '@/lib/assets';
import { getPublicProjects } from '@/lib/public-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Project Pembuatan Aplikasi & Website',
  description:
    'Studi kasus project RefaadStack untuk website, aplikasi web, POS, dan platform SaaS.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Project Pembuatan Aplikasi & Website | RefaadStack',
    description:
      'Studi kasus project pembuatan aplikasi dan website oleh RefaadStack — software house dari Jambi.',
    url: '/projects',
    siteName: 'RefaadStack',
    locale: 'id_ID',
    type: 'website',
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
          <p className="col-span-full text-sm text-muted-foreground">
            Project belum ditambahkan — segera hadir.
          </p>
        ) : (
          projects.map((project) => (
            <ContentCard
              key={project.slug}
              href={`/projects/${project.slug}`}
              image={resolveImageSrc(project.image)}
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
