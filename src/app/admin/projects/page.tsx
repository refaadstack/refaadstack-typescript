'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deleteProject, getProjects } from '@/lib/crud';
import { formatDate } from '@/lib/utils';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function fetchProjects() {
    const data = await getProjects();
    setProjects(data || []);
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        if (!mounted) return;
        setUser(sessionUser);
        await fetchProjects();
      } catch (caught) {
        console.error('Projects admin error:', caught);
        if (mounted) setError('Belum bisa membaca tabel projects. Push schema terbaru dulu.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus project ini dari database?')) return;

    setDeleting(id);
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (caught) {
      console.error('Delete project error:', caught);
      alert('Project gagal dihapus');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Projects"
        title="Studi kasus yang bisa dikelola dari database."
        description="Semua item di sini mengisi `/projects`, halaman detail project, dan sitemap."
        actions={
          <Link href="/admin/projects/new">
            <Button className="rounded-full">
              <Plus className="mr-2 size-4" />
              Tambah project
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-6 rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
          {error}
        </div>
      )}

      <AdminPanel title="Project database" description={`${projects.length} project tersimpan`}>
        {projects.length === 0 ? (
          <AdminEmptyState label="Belum ada project di database." />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid gap-4 rounded-3xl border border-border bg-surface p-4 lg:grid-cols-[1fr_auto]"
              >
                <div className="flex gap-4">
                  <div className="hidden size-14 place-items-center rounded-2xl bg-background text-primary sm:grid">
                    <FolderKanban className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-2xl font-bold tracking-[-0.045em] text-foreground">
                        {project.title}
                      </h2>
                      <AdminStatusPill tone={project.is_active ? 'active' : 'muted'}>
                        {project.is_active ? 'Aktif' : 'Draft'}
                      </AdminStatusPill>
                      {project.featured && <AdminStatusPill>Featured</AdminStatusPill>}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {project.summary || 'Belum ada ringkasan.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{project.category || 'Tanpa kategori'}</span>
                      <span>|</span>
                      <span>/{project.slug}</span>
                      <span>|</span>
                      <span>{project.created_at ? formatDate(project.created_at) : project.year}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={deleting === project.id}
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
