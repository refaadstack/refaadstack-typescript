'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { AdminNotice } from '@/components/admin/admin-form';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deleteService, getServices } from '@/lib/crud';

interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function ServiceListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        const data = await getServices();
        if (!mounted) return;

        setUser(sessionUser);
        setServices((data || []) as Service[]);
      } catch (caught) {
        console.error('Services load error:', caught);
        if (mounted) setError('Gagal memuat services dari database.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const refreshServices = async () => {
    const data = await getServices();
    setServices((data || []) as Service[]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus service ini?')) return;

    setDeleting(id);
    setError('');
    try {
      await deleteService(id);
      await refreshServices();
    } catch (caught) {
      console.error('Service delete error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menghapus service.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Services"
        title="Layanan yang mengisi section homepage."
        description="Urutan services mengikuti field sort order dari database. Service aktif tampil di public site."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/admin/services/new">
              <Plus className="mr-2 size-4" />
              Tambah service
            </Link>
          </Button>
        }
      />

      {error && <AdminNotice tone="error" className="mb-6">{error}</AdminNotice>}

      <AdminPanel
        title="Service database"
        description={`${services.length} service tersimpan di Supabase.`}
      >
        {services.length === 0 ? (
          <AdminEmptyState label="Belum ada service. Tambah service pertama untuk mengisi homepage." />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-3xl border border-border bg-surface p-4 transition hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid size-11 place-items-center rounded-2xl bg-background text-lg">
                        {service.icon || <Package className="size-5 text-primary" />}
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-bold tracking-[-0.035em] text-foreground">
                          {service.name}
                        </h2>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          Order {service.sort_order}
                        </p>
                      </div>
                    </div>
                    {service.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                      <AdminStatusPill tone={service.is_active ? 'active' : 'muted'}>
                        {service.is_active ? 'aktif' : 'nonaktif'}
                      </AdminStatusPill>
                      {service.is_active ? (
                        <CheckCircle className="size-4 text-primary" />
                      ) : (
                        <XCircle className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/admin/services/${service.id}`}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleting === service.id}
                      aria-label={`Hapus ${service.name}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
