'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Image,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { AdminLoading, AdminMetricCard, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { getAdminOverviewData } from '@/lib/crud';
import { formatDate } from '@/lib/utils';

interface AdminStats {
  totalPortfolios: number;
  totalProducts: number;
  activeProducts: number;
  totalTestimonials: number;
  totalServices: number;
  totalProjects: number;
  activeProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
}

interface OverviewData {
  stats: AdminStats;
  recent: {
    projects: any[];
    blogPosts: any[];
    portfolios: any[];
    products: any[];
    services: any[];
    testimonials: any[];
  };
}

const EMPTY_OVERVIEW: OverviewData = {
  stats: {
    totalPortfolios: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalTestimonials: 0,
    totalServices: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
  },
  recent: {
    projects: [],
    blogPosts: [],
    portfolios: [],
    products: [],
    services: [],
    testimonials: [],
  },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [overview, setOverview] = useState<OverviewData>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
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

        const data = await getAdminOverviewData();
        if (!mounted) return;

        setUser(sessionUser);
        setOverview(data as OverviewData);
      } catch (caught) {
        console.error('Dashboard error:', caught);
        if (mounted) {
          setError('Dashboard belum bisa membaca sebagian tabel. Pastikan schema terbaru sudah dipush ke Supabase.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const health = useMemo(() => {
    const contentSlots = [
      overview.stats.totalProjects,
      overview.stats.totalPortfolios,
      overview.stats.totalProducts,
      overview.stats.totalServices,
      overview.stats.totalTestimonials,
      overview.stats.totalBlogPosts,
    ];
    const filled = contentSlots.filter((value) => value > 0).length;
    return Math.round((filled / contentSlots.length) * 100);
  }, [overview]);

  if (loading) return <AdminLoading />;

  const stats = overview.stats;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Database cockpit"
        title={`Halo, ${user?.name || 'Admin'}. Semua konten ada di satu ruang kendali.`}
        description="Dashboard ini membaca data langsung dari Supabase: project, blog, portfolio, produk, layanan, testimonial, dan SEO settings."
        actions={
          <>
            <Link href="/admin/projects/new">
              <Button className="rounded-full">
                <Plus className="mr-2 size-4" />
                Project
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="rounded-full">
                <Plus className="mr-2 size-4" />
                Blog
              </Button>
            </Link>
          </>
        }
      />

      {error && (
        <div className="mb-6 rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Projects"
          value={`${stats.activeProjects}/${stats.totalProjects}`}
          description="Project aktif yang mengisi halaman studi kasus public."
          icon={<FolderKanban className="size-5" />}
        />
        <AdminMetricCard
          label="Blog posts"
          value={`${stats.publishedBlogPosts}/${stats.totalBlogPosts}`}
          description="Artikel published yang masuk blog dan sitemap."
          icon={<BookOpen className="size-5" />}
        />
        <AdminMetricCard
          label="Products"
          value={`${stats.activeProducts}/${stats.totalProducts}`}
          description="Produk aktif yang tampil di landing page dan detail product."
          icon={<ShoppingCart className="size-5" />}
        />
        <AdminMetricCard
          label="Content health"
          value={`${health}%`}
          description="Kelengkapan modul konten utama yang sudah punya data."
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPanel
          title="Alur cepat"
          description="Aksi yang paling sering dipakai setelah update homepage."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Tambah project', href: '/admin/projects/new', icon: FolderKanban },
              { title: 'Tulis blog', href: '/admin/blog/new', icon: BookOpen },
              { title: 'Tambah portfolio', href: '/admin/portfolio/new', icon: Image },
              { title: 'Tambah produk', href: '/admin/products/new', icon: ShoppingCart },
              { title: 'Kelola services', href: '/admin/services', icon: Package },
              { title: 'SEO settings', href: '/admin/settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-3xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:bg-primary/10"
                >
                  <span className="flex items-center gap-3 font-semibold text-foreground">
                    <span className="grid size-11 place-items-center rounded-2xl bg-background text-primary transition group-hover:bg-primary group-hover:text-black">
                      <Icon className="size-5" />
                    </span>
                    {item.title}
                  </span>
                  <Plus className="size-4 text-muted-foreground transition group-hover:text-foreground" />
                </Link>
              );
            })}
          </div>
        </AdminPanel>

        <AdminPanel
          title="Public sync"
          description="Modul yang sekarang sudah dibaca dari database."
        >
          <div className="space-y-3">
            {[
              ['Projects page', stats.activeProjects, '/projects'],
              ['Blog page', stats.publishedBlogPosts, '/blog'],
              ['Portfolio page', stats.totalPortfolios, '/portfolio'],
              ['Products page', stats.activeProducts, '/products'],
              ['Services section', stats.totalServices, '/#services'],
              ['Testimonials section', stats.totalTestimonials, '/#testimonials'],
            ].map(([label, value, href]) => (
              <Link
                key={String(label)}
                href={String(href)}
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/40"
              >
                <span className="font-semibold text-foreground">{label}</span>
                <AdminStatusPill tone={Number(value) > 0 ? 'active' : 'muted'}>
                  {Number(value) > 0 ? `${value} item` : 'kosong'}
                </AdminStatusPill>
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecentList
          title="Project terbaru"
          items={overview.recent.projects}
          empty="Belum ada project di database."
          getTitle={(item) => item.title}
          getMeta={(item) => `${item.category || 'Project'} | ${item.is_active ? 'Aktif' : 'Draft'}`}
          getHref={(item) => `/admin/projects/${item.id}`}
        />
        <RecentList
          title="Blog terbaru"
          items={overview.recent.blogPosts}
          empty="Belum ada blog post di database."
          getTitle={(item) => item.title}
          getMeta={(item) =>
            `${item.category || 'Article'} | ${item.is_published ? 'Published' : 'Draft'}`
          }
          getHref={(item) => `/admin/blog/${item.id}`}
        />
        <RecentList
          title="Portfolio terbaru"
          items={overview.recent.portfolios}
          empty="Belum ada portfolio di database."
          getTitle={(item) => item.title}
          getMeta={(item) => `${item.category || 'Portfolio'} | ${formatDate(item.created_at)}`}
          getHref={(item) => `/admin/portfolio/${item.id}`}
        />
        <RecentList
          title="Produk terbaru"
          items={overview.recent.products}
          empty="Belum ada produk di database."
          getTitle={(item) => item.name}
          getMeta={(item) => `${item.is_active ? 'Aktif' : 'Nonaktif'} | ${item.price || 'Hubungi'}`}
          getHref={(item) => `/admin/products/${item.id}`}
        />
      </div>
    </AdminShell>
  );
}

function RecentList({
  title,
  items,
  empty,
  getTitle,
  getMeta,
  getHref,
}: {
  title: string;
  items: any[];
  empty: string;
  getTitle: (item: any) => string;
  getMeta: (item: any) => string;
  getHref: (item: any) => string;
}) {
  return (
    <AdminPanel title={title}>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
          {empty}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={getHref(item)}
              className="flex items-start justify-between gap-4 rounded-3xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:bg-primary/10"
            >
              <span>
                <span className="block font-semibold text-foreground">{getTitle(item)}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{getMeta(item)}</span>
              </span>
              <Sparkles className="mt-1 size-4 text-primary" />
            </Link>
          ))}
        </div>
      )}
    </AdminPanel>
  );
}
