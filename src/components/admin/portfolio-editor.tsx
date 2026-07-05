'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Trash2, X } from 'lucide-react';
import { AdminField, AdminFormActions, AdminImagePlaceholder, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import {
  createPortfolio,
  deletePortfolioImage,
  getPortfolioById,
  type PortfolioInput,
  updatePortfolio,
  uploadPortfolioImage,
} from '@/lib/crud';
import {
  createPendingImages,
  fileToUploadData,
  type PendingImage,
  revokePendingImages,
  validateImageFile,
} from '@/lib/image-upload';
import { slugify } from '@/lib/utils';

interface PortfolioImageRecord {
  id: string;
  image_url: string;
  sort_order: number;
}

interface PortfolioRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  full_description: string | null;
  problem: string | null;
  solution: string | null;
  impact_result: string | null;
  tech_stack: string[] | null;
  featured: boolean;
  portfolio_images?: PortfolioImageRecord[];
}

export function PortfolioEditor({ id }: { id?: string }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const pendingImagesRef = useRef<PendingImage[]>([]);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<PortfolioImageRecord[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    short_description: '',
    full_description: '',
    problem: '',
    solution: '',
    impact_result: '',
    tech_stack: '',
    featured: false,
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
          const data = (await getPortfolioById(id)) as PortfolioRecord;
          if (!mounted) return;

          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || '',
            short_description: data.short_description || '',
            full_description: data.full_description || '',
            problem: data.problem || '',
            solution: data.solution || '',
            impact_result: data.impact_result || '',
            tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(', ') : '',
            featured: Boolean(data.featured),
          });
          setImages(
            [...(data.portfolio_images || [])].sort(
              (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
            )
          );
        }

        if (mounted) setUser(sessionUser);
      } catch (caught) {
        console.error('Portfolio editor load error:', caught);
        if (mounted) setError(isEditing ? 'Portfolio tidak ditemukan.' : 'Gagal membuka form portfolio.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
      revokePendingImages(pendingImagesRef.current);
    };
  }, [id, isEditing, router]);

  const setPending = (items: PendingImage[]) => {
    pendingImagesRef.current = items;
    setPendingImages(items);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((current) => {
      if (type === 'checkbox') {
        return { ...current, [name]: (event.target as HTMLInputElement).checked };
      }

      if (name === 'title' && !current.slug) {
        return { ...current, title: value, slug: slugify(value) };
      }

      return { ...current, [name]: value };
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    const validationError = files.map(validateImageFile).find(Boolean);
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextImages = [...pendingImagesRef.current, ...createPendingImages(files)];
    setPending(nextImages);
  };

  const removePendingImage = (imageId: string) => {
    const target = pendingImagesRef.current.find((image) => image.id === imageId);
    if (target) revokePendingImages([target]);
    setPending(pendingImagesRef.current.filter((image) => image.id !== imageId));
  };

  const removeExistingImage = async (imageId: string) => {
    if (!confirm('Hapus gambar portfolio ini?')) return;

    setError('');
    try {
      await deletePortfolioImage(imageId);
      setImages((current) => current.filter((image) => image.id !== imageId));
    } catch (caught) {
      console.error('Delete portfolio image error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menghapus gambar.');
    }
  };

  const toList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const input: PortfolioInput = {
        title: formData.title.trim(),
        slug: slugify(formData.slug || formData.title),
        category: formData.category.trim(),
        short_description: formData.short_description.trim() || '',
        full_description: formData.full_description.trim() || '',
        problem: formData.problem.trim() || '',
        solution: formData.solution.trim() || '',
        impact_result: formData.impact_result.trim() || '',
        tech_stack: toList(formData.tech_stack),
        featured: formData.featured,
      };

      const portfolioId = id || String((await createPortfolio(input)).id);
      if (id) {
        await updatePortfolio(id, input);
      }

      for (const pendingImage of pendingImagesRef.current) {
        const fileData = await fileToUploadData(pendingImage.file);
        await uploadPortfolioImage(portfolioId, fileData);
      }

      revokePendingImages(pendingImagesRef.current);
      setPending([]);
      router.push('/admin/portfolio');
      router.refresh();
    } catch (caught) {
      console.error('Portfolio save error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan portfolio.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Portfolio editor"
        title={isEditing ? 'Edit portfolio.' : 'Tambah portfolio baru.'}
        description="Portfolio ini tampil di listing public, halaman detail portfolio, dan sitemap."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/portfolio">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <AdminPanel
            title="Basic information"
            description="Judul, slug, kategori, teknologi, dan status featured."
          >
            <div className="space-y-5">
              <AdminField label="Title" htmlFor="title">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <AdminField label="Slug" htmlFor="slug">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <AdminField label="Category" htmlFor="category">
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <AdminField
                label="Tech stack"
                htmlFor="tech_stack"
                hint="Pisahkan teknologi dengan koma."
              >
                <Input
                  id="tech_stack"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <AdminToggleRow
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                title="Featured portfolio"
                description="Portfolio featured ditonjolkan di homepage/listing."
              />
            </div>
          </AdminPanel>

          <AdminPanel
            title="Story"
            description="Copy yang dipakai di detail case study."
          >
            <div className="space-y-5">
              <AdminField label="Short description" htmlFor="short_description">
                <Textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <AdminField label="Full description" htmlFor="full_description">
                <Textarea
                  id="full_description"
                  name="full_description"
                  value={formData.full_description}
                  onChange={handleChange}
                  rows={5}
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
              <div className="grid gap-4 lg:grid-cols-2">
                <AdminField label="Problem" htmlFor="problem">
                  <Textarea
                    id="problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 rounded-2xl bg-surface"
                  />
                </AdminField>
                <AdminField label="Solution" htmlFor="solution">
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 rounded-2xl bg-surface"
                  />
                </AdminField>
              </div>
              <AdminField label="Impact result" htmlFor="impact_result">
                <Textarea
                  id="impact_result"
                  name="impact_result"
                  value={formData.impact_result}
                  onChange={handleChange}
                  rows={4}
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
            </div>
          </AdminPanel>
        </div>

        <AdminPanel
          title="Portfolio images"
          description="Upload satu atau lebih gambar. Gambar pertama dipakai sebagai cover listing."
          action={
            <AdminStatusPill tone={images.length + pendingImages.length > 0 ? 'active' : 'muted'}>
              {images.length + pendingImages.length} image
            </AdminStatusPill>
          }
        >
          <div className="space-y-5">
            <AdminField label="Upload images" htmlFor="portfolio-images">
              <Input
                id="portfolio-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="mt-2 rounded-2xl bg-surface file:text-foreground"
              />
            </AdminField>

            {images.length === 0 && pendingImages.length === 0 ? (
              <AdminImagePlaceholder icon={<ImagePlus className="size-5" />}>
                Belum ada gambar portfolio. Upload gambar agar public case study punya visual.
              </AdminImagePlaceholder>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-3xl border border-border bg-surface">
                    <img
                      src={image.image_url}
                      alt="Portfolio image"
                      className="aspect-video w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground opacity-100 shadow-lg transition hover:bg-primary hover:text-black md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Hapus gambar portfolio"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                {pendingImages.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-3xl border border-primary/40 bg-surface">
                    <img
                      src={image.previewUrl}
                      alt={image.file.name}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
                      pending
                    </div>
                    <button
                      type="button"
                      onClick={() => removePendingImage(image.id)}
                      className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground opacity-100 shadow-lg transition hover:bg-primary hover:text-black md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Hapus gambar pilihan"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminPanel>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}

        <AdminFormActions
          saving={saving}
          submitLabel={isEditing ? 'Update portfolio' : 'Create portfolio'}
          savingLabel={isEditing ? 'Updating...' : 'Creating...'}
          cancelHref="/admin/portfolio"
        />
      </form>
    </AdminShell>
  );
}
