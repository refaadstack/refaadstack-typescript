'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { AdminField, AdminFormActions, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import {
  createService,
  getServiceById,
  type ServiceInput,
  updateService,
} from '@/lib/crud';

interface ServiceRecord {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export function ServiceEditor({ id }: { id?: string }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    sort_order: '',
    is_active: true,
  });

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        if (id) {
          const data = (await getServiceById(id)) as ServiceRecord;
          if (!mounted) return;

          setFormData({
            name: data.name || '',
            description: data.description || '',
            icon: data.icon || '',
            sort_order: data.sort_order?.toString() || '',
            is_active: data.is_active,
          });
        }

        if (mounted) setUser(sessionUser);
      } catch (caught) {
        console.error('Service editor load error:', caught);
        if (mounted) setError(isEditing ? 'Service tidak ditemukan.' : 'Gagal membuka form service.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [id, isEditing, router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const input: ServiceInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon.trim() || null,
        sort_order: formData.sort_order ? Number(formData.sort_order) : 0,
        is_active: formData.is_active,
      };

      if (id) {
        await updateService(id, input);
      } else {
        await createService(input);
      }

      router.push('/admin/services');
      router.refresh();
    } catch (caught) {
      console.error('Service save error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan service.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Service editor"
        title={isEditing ? 'Edit service.' : 'Tambah service baru.'}
        description="Service aktif akan tampil di homepage dan dipakai sebagai copy layanan public."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/services">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <AdminPanel
          title="Service information"
          description="Nama, icon, urutan, dan deskripsi layanan."
          action={<Package className="size-5 text-primary" />}
        >
          <div className="space-y-5">
            <AdminField label="Name" htmlFor="name">
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Company profile website"
                required
                className="mt-2 rounded-2xl bg-surface"
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <AdminField label="Icon" htmlFor="icon">
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="⚙️"
                  className="mt-2 rounded-2xl bg-surface text-center text-lg"
                />
              </AdminField>

              <AdminField label="Sort order" htmlFor="sort_order">
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
            </div>

            <AdminField label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat service"
                className="mt-2 rounded-2xl bg-surface"
                rows={5}
              />
            </AdminField>

            <AdminToggleRow
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              title="Active service"
              description="Service aktif tampil di homepage."
            />
          </div>
        </AdminPanel>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}

        <AdminFormActions
          saving={saving}
          submitLabel={isEditing ? 'Update service' : 'Create service'}
          savingLabel={isEditing ? 'Updating...' : 'Creating...'}
          cancelHref="/admin/services"
        />
      </form>
    </AdminShell>
  );
}
