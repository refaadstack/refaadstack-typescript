'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { AdminField, AdminImagePlaceholder } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { createProject, getProjectById, updateProject, uploadContentMedia, type ProjectInput } from '@/lib/crud';
import { fileToUploadData, validateImageFile } from '@/lib/image-upload';
import { slugify } from '@/lib/utils';

import { getErrorMessage } from '@/lib/error-utils';
const DEFAULT_IMAGE = '/images/refaadstack-system-still.png';

interface ProjectEditorProps {
  projectId?: string;
}

interface ProjectFormState {
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  services: string;
  stack: string;
  year: string;
  image_url: string;
  featured: boolean;
  is_active: boolean;
}

const DEFAULT_FORM: ProjectFormState = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  description: '',
  challenge: '',
  approach: '',
  outcome: '',
  services: '',
  stack: '',
  year: String(new Date().getFullYear()),
  image_url: DEFAULT_IMAGE,
  featured: false,
  is_active: true,
};

export function ProjectEditor({ projectId }: ProjectEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(projectId);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<ProjectFormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

        if (!mounted) return;
        setUser(sessionUser);

        if (projectId) {
          const project = await getProjectById(projectId);
          if (!mounted) return;
          setForm({
            title: project.title || '',
            slug: project.slug || '',
            category: project.category || '',
            summary: project.summary || '',
            description: project.description || '',
            challenge: project.challenge || '',
            approach: project.approach || '',
            outcome: project.outcome || '',
            services: Array.isArray(project.services) ? project.services.join(', ') : '',
            stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
            year: project.year || String(new Date().getFullYear()),
            image_url: project.image_url || DEFAULT_IMAGE,
            featured: Boolean(project.featured),
            is_active: Boolean(project.is_active),
          });
        }
      } catch (caught) {
        console.error('Project editor error:', caught);
        if (mounted) setError('Project tidak bisa dibuka. Pastikan tabel projects sudah ada.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [projectId, router]);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = 'checked' in event.target ? event.target.checked : false;

    setForm((current) => {
      if (type === 'checkbox') {
        return { ...current, [name]: checked };
      }

      if (name === 'title' && !current.slug) {
        return { ...current, title: value, slug: slugify(value) };
      }

      return { ...current, [name]: value };
    });
  };

  const toList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const fileData = await fileToUploadData(file);
      const folder = `project-hero/${slugify(form.slug || form.title || 'project-draft')}`;
      const { url } = await uploadContentMedia(folder, fileData);
      setForm((current) => ({ ...current, image_url: url }));
    } catch (caught) {
      console.error('Project image upload error:', caught);
      setError(getErrorMessage(caught, 'Gagal upload gambar project. Maks 2MB.'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload: ProjectInput = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      category: form.category.trim(),
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      challenge: form.challenge.trim() || null,
      approach: form.approach.trim() || null,
      outcome: form.outcome.trim() || null,
      services: toList(form.services),
      stack: toList(form.stack),
      year: form.year.trim() || String(new Date().getFullYear()),
      image_url: form.image_url.trim() || DEFAULT_IMAGE,
      featured: form.featured,
      is_active: form.is_active,
    };

    try {
      if (projectId) {
        await updateProject(projectId, payload);
      } else {
        await createProject(payload);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (caught) {
      console.error('Save project error:', caught);
      setError(getErrorMessage(caught, 'Project gagal disimpan.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow={isEdit ? 'Edit project' : 'New project'}
        title={isEdit ? 'Rapikan studi kasus.' : 'Tambah studi kasus baru.'}
        description="Konten ini akan tampil di halaman Projects, detail project, dan sitemap jika statusnya aktif."
        actions={
          <Link href="/admin/projects">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <AdminPanel
          title="Konten project"
          description="Isi semua bagian utama supaya halaman detail terasa lengkap."
          action={
            <Button type="submit" disabled={saving} className="rounded-full">
              <Save className="mr-2 size-4" />
              {saving ? 'Menyimpan' : 'Simpan'}
            </Button>
          }
        >
          {error && (
            <div className="mb-5 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
              {error}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <AdminField label="Judul">
              <Input name="title" value={form.title} onChange={updateField} required />
            </AdminField>
            <AdminField label="Slug">
              <Input name="slug" value={form.slug} onChange={updateField} required />
            </AdminField>
            <AdminField label="Kategori">
              <Input name="category" value={form.category} onChange={updateField} required />
            </AdminField>
            <AdminField label="Tahun">
              <Input name="year" value={form.year} onChange={updateField} />
            </AdminField>
            <AdminField label="Layanan, pisahkan koma">
              <Input name="services" value={form.services} onChange={updateField} />
            </AdminField>
            <AdminField label="Teknologi, pisahkan koma">
              <Input name="stack" value={form.stack} onChange={updateField} />
            </AdminField>
            <AdminField label="Gambar hero" className="lg:col-span-2">
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="rounded-2xl bg-background file:text-foreground"
                  aria-label="Upload gambar hero project"
                />
                <AdminField label="Atau paste URL gambar" htmlFor="image_url">
                  <Input
                    id="image_url"
                    name="image_url"
                    value={form.image_url}
                    onChange={updateField}
                    placeholder="https://..."
                    className="mt-2 rounded-2xl bg-background"
                  />
                </AdminField>
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Preview gambar hero project"
                    className="aspect-video w-full rounded-3xl border border-border object-cover"
                  />
                ) : (
                  <AdminImagePlaceholder icon={<ImagePlus className="size-5" />}>
                    Upload gambar project supaya halaman detail public punya visual.
                  </AdminImagePlaceholder>
                )}
                {uploadingImage && (
                  <p className="text-xs font-semibold text-primary">Uploading gambar...</p>
                )}
              </div>
            </AdminField>
            <AdminField label="Ringkasan" className="lg:col-span-2">
              <Textarea name="summary" value={form.summary} onChange={updateField} rows={3} />
            </AdminField>
            <AdminField label="Deskripsi project" className="lg:col-span-2">
              <Textarea name="description" value={form.description} onChange={updateField} rows={5} />
            </AdminField>
            <AdminField label="Tantangan">
              <Textarea name="challenge" value={form.challenge} onChange={updateField} rows={6} />
            </AdminField>
            <AdminField label="Pendekatan">
              <Textarea name="approach" value={form.approach} onChange={updateField} rows={6} />
            </AdminField>
            <AdminField label="Hasil" className="lg:col-span-2">
              <Textarea name="outcome" value={form.outcome} onChange={updateField} rows={5} />
            </AdminField>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={updateField}
                className="size-4 accent-primary"
              />
              Tampilkan di public
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={updateField}
                className="size-4 accent-primary"
              />
              Featured
            </label>
          </div>
        </AdminPanel>
      </form>
    </AdminShell>
  );
}
