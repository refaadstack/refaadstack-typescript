import { ProjectEditor } from '@/components/admin/project-editor';

export default function AdminEditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProjectEditor projectId={params.id} />;
}
