'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { AdminField, AdminFormActions, AdminImagePlaceholder, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import {
  createProduct,
  getProductById,
  type ProductInput,
  updateProduct,
  uploadProductImage,
} from '@/lib/crud';
import {
  createPendingImages,
  fileToUploadData,
  type PendingImage,
  revokePendingImages,
  validateImageFile,
} from '@/lib/image-upload';

interface ProductRecord {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface ProductEditorProps {
  id?: string;
}

export function ProductEditor({ id }: ProductEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const pendingImageRef = useRef<PendingImage | null>(null);
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    features: '',
    price: '',
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
          const data = (await getProductById(id)) as ProductRecord;
          if (!mounted) return;

          setProduct(data);
          setDirectImageUrl(data.image_url || '');
          setFormData({
            name: data.name || '',
            tagline: data.tagline || '',
            description: data.description || '',
            features: data.features?.join(', ') || '',
            price: data.price || '',
            is_active: data.is_active,
          });
        }

        if (mounted) setUser(sessionUser);
      } catch (caught) {
        console.error('Product editor load error:', caught);
        if (mounted) setError(isEditing ? 'Product tidak ditemukan.' : 'Gagal membuka form product.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
      if (pendingImageRef.current) revokePendingImages([pendingImageRef.current]);
    };
  }, [id, isEditing, router]);

  const setSelectedImage = (image: PendingImage | null) => {
    pendingImageRef.current = image;
    setPendingImage(image);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    if (pendingImageRef.current) revokePendingImages([pendingImageRef.current]);
    setSelectedImage(createPendingImages([file])[0]);
    event.target.value = '';
  };

  const removePendingImage = () => {
    if (pendingImageRef.current) revokePendingImages([pendingImageRef.current]);
    setSelectedImage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const features = formData.features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean);
      const input: ProductInput = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim() || null,
        description: formData.description.trim() || null,
        features: features.length > 0 ? features : null,
        price: formData.price || null,
        image_url: directImageUrl.trim() || null,
        is_active: formData.is_active,
      };

      const productId = id || String((await createProduct(input)).id);

      if (id) {
        await updateProduct(id, input);
      }

      if (pendingImageRef.current) {
        const fileData = await fileToUploadData(pendingImageRef.current.file);
        await uploadProductImage(productId, fileData);
        revokePendingImages([pendingImageRef.current]);
        setSelectedImage(null);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (caught) {
      console.error('Product save error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Product editor"
        title={isEditing ? 'Edit product.' : 'Tambah product baru.'}
        description="Data ini mengisi halaman products, detail product, homepage, dan sitemap public."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminPanel
            title="Basic information"
            description="Nama, tagline, harga, dan status publish product."
          >
            <div className="space-y-5">
              <AdminField label="Name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="RefaadPOS"
                  required
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminField label="Tagline" htmlFor="tagline">
                <Input
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Sistem kasir modern untuk UMKM"
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminField label="Price (IDR)" htmlFor="price">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0 untuk hubungi sales"
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminToggleRow
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                title="Active product"
                description="Product aktif tampil di public page dan sitemap."
              />
            </div>
          </AdminPanel>

          <AdminPanel
            title="Details"
            description="Copy singkat yang tampil di card dan halaman detail product."
          >
            <div className="space-y-5">
              <AdminField label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Deskripsi product"
                  className="mt-2 rounded-2xl bg-surface"
                  rows={5}
                />
              </AdminField>

              <AdminField
                label="Features"
                htmlFor="features"
                hint="Pisahkan feature dengan koma."
              >
                <Input
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Multi-outlet, laporan real-time, stok otomatis"
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>
            </div>
          </AdminPanel>
        </div>

        <AdminPanel
          title="Product image"
          description="Gambar ini dipakai sebagai thumbnail product di landing page dan detail page."
          action={
            product?.image_url ? (
              <AdminStatusPill tone="active">image tersedia</AdminStatusPill>
            ) : (
              <AdminStatusPill tone="muted">belum ada image</AdminStatusPill>
            )
          }
        >
          <div className="space-y-5">
            <AdminField label={isEditing ? 'Replace image' : 'Upload image'} htmlFor="product-image">
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-2 rounded-2xl bg-surface file:text-foreground"
              />
            </AdminField>

            <AdminField label="Atau paste URL gambar (Supabase Storage)" htmlFor="product-image-url">
              <Input
                id="product-image-url"
                value={directImageUrl}
                onChange={(e) => setDirectImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 rounded-2xl bg-surface"
              />
            </AdminField>

            {pendingImage ? (
              <div className="group relative w-full max-w-md">
                <img
                  src={pendingImage.previewUrl}
                  alt={pendingImage.file.name}
                  className="aspect-video w-full rounded-3xl border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={removePendingImage}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground opacity-100 shadow-lg transition hover:bg-primary hover:text-black md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Hapus gambar pilihan"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : product?.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-video w-full max-w-md rounded-3xl border border-border object-cover"
              />
            ) : (
              <AdminImagePlaceholder icon={<ImagePlus className="size-5" />}>
                Belum ada gambar product. Upload langsung di sini supaya card public tidak kosong.
              </AdminImagePlaceholder>
            )}
          </div>
        </AdminPanel>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}

        <AdminFormActions
          saving={saving}
          submitLabel={isEditing ? 'Update product' : 'Create product'}
          savingLabel={isEditing ? 'Updating...' : 'Creating...'}
          cancelHref="/admin/products"
        />
      </form>
    </AdminShell>
  );
}
