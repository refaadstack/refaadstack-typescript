'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Pencil, Plus, ShoppingCart, Trash2, XCircle } from 'lucide-react';
import { AdminNotice } from '@/components/admin/admin-form';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deleteProduct, getProducts } from '@/lib/crud';

interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: string | null;
  image_url: string | null;
  is_active: boolean;
}

export default function ProductListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
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

        const data = await getProducts();
        if (!mounted) return;

        setUser(sessionUser);
        setProducts((data || []) as Product[]);
      } catch (caught) {
        console.error('Products load error:', caught);
        if (mounted) setError('Gagal memuat products dari database.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const refreshProducts = async () => {
    const data = await getProducts();
    setProducts((data || []) as Product[]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus product ini?')) return;

    setDeleting(id);
    setError('');
    try {
      await deleteProduct(id);
      await refreshProducts();
    } catch (caught) {
      console.error('Product delete error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menghapus product.');
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price || Number(price) === 0) return 'Hubungi untuk harga';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Products"
        title="Produk yang tampil di halaman publik."
        description="Semua product dibaca langsung dari database. Product aktif masuk ke homepage, listing product, detail product, dan sitemap."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/admin/products/new">
              <Plus className="mr-2 size-4" />
              Tambah product
            </Link>
          </Button>
        }
      />

      {error && <AdminNotice tone="error" className="mb-6">{error}</AdminNotice>}

      <AdminPanel
        title="Product database"
        description={`${products.length} product tersimpan di Supabase.`}
      >
        {products.length === 0 ? (
          <AdminEmptyState label="Belum ada product. Tambah product pertama untuk mengisi halaman public." />
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="grid gap-4 rounded-3xl border border-border bg-surface p-4 transition hover:border-primary/40 md:grid-cols-[5rem_1fr_auto]"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="aspect-[4/3] w-20 rounded-2xl border border-border object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] w-20 place-items-center rounded-2xl border border-dashed border-border bg-background text-primary">
                    <ShoppingCart className="size-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-xl font-bold tracking-[-0.035em] text-foreground">
                      {product.name}
                    </h2>
                    <AdminStatusPill tone={product.is_active ? 'active' : 'muted'}>
                      {product.is_active ? 'aktif' : 'nonaktif'}
                    </AdminStatusPill>
                    {product.is_active ? (
                      <CheckCircle className="size-4 text-primary" />
                    ) : (
                      <XCircle className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  {product.tagline && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.tagline}</p>
                  )}
                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 md:justify-end">
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href={`/admin/products/${product.id}`}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    aria-label={`Hapus ${product.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
