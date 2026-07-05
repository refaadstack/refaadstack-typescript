import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/sections/cta';
import { DetailHero } from '@/components/public/detail-hero';
import { DetailSections } from '@/components/public/detail-sections';
import { JsonLd } from '@/components/public/json-ld';
import { PublicShell } from '@/components/public/public-shell';
import { getPublicProjectBySlug, getPublicProjects } from '@/lib/public-data';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getPublicProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getPublicProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <PublicShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          image: `https://www.refaadstack.com${project.image}`,
          dateCreated: project.year,
          creator: {
            '@type': 'Organization',
            name: 'RefaadStack',
          },
        }}
      />
      <DetailHero
        backHref="/projects"
        backLabel="Kembali ke project"
        label={project.category}
        title={project.title}
        summary={project.summary}
        image={project.image}
        meta={[
          { label: 'Tahun', value: project.year },
          { label: 'Fokus', value: project.services[0] },
        ]}
      />
      <DetailSections
        sections={[
          { title: 'Gambaran project', body: project.description },
          { title: 'Tantangan', body: project.challenge },
          { title: 'Pendekatan', body: project.approach },
          { title: 'Hasil', body: project.outcome },
        ]}
        lists={[
          { title: 'Layanan', items: project.services },
          { title: 'Teknologi', items: project.stack },
        ]}
      />
      <CTA />
    </PublicShell>
  );
}
