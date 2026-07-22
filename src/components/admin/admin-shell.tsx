'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  ChatCircle,
  Folder,
  Gear,
  Gauge,
  House,
  ImageSquare,
  List,
  Package,
  ShoppingCart,
  SignOut,
  Sparkle,
  X,
} from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';
import { logoutAdmin, type AdminUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ADMIN_NAV = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: Gauge },
  { title: 'Blog', href: '/admin/blog', icon: BookOpen },
  { title: 'Portfolio', href: '/admin/portfolio', icon: ImageSquare },
  { title: 'Products', href: '/admin/products', icon: ShoppingCart },
  { title: 'Services', href: '/admin/services', icon: Package },
  { title: 'Testimonials', href: '/admin/testimonials', icon: ChatCircle },
  { title: 'Settings', href: '/admin/settings', icon: Gear },
];

interface AdminShellProps {
  user: AdminUser | null;
  children: ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-border bg-background px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/dashboard" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md border border-primary/35 bg-primary text-black">
            <Sparkle className="size-5" weight="fill" />
          </span>
          <span>
            <span className="block font-heading text-lg font-bold tracking-[-0.04em] text-foreground">
              RefaadStack
            </span>
            <span className="text-xs text-muted-foreground">Content cockpit</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-full border border-border p-2 text-muted-foreground md:hidden"
          aria-label="Tutup menu admin"
        >
          <X className="size-4" weight="bold" />
        </button>
      </div>

      <nav className="mt-8 space-y-1.5">
        {ADMIN_NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-primary text-black'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" weight="bold" />
                {item.title}
              </span>
              {isActive && <span className="size-1.5 rounded-full bg-black" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-foreground text-sm font-bold text-background">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || 'admin'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground"
          >
            <House className="size-3.5" weight="bold" />
            Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
          >
            <SignOut className="size-3.5" weight="bold" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 md:block">{sidebar}</div>

      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[min(21rem,86vw)] transition-transform md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebar}
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/84 backdrop-blur-xl md:ml-72">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-full border border-border p-2 text-muted-foreground md:hidden"
            aria-label="Buka menu admin"
          >
            <List className="size-5" weight="bold" />
          </button>
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground md:flex">
            <House className="size-4" weight="bold" />
            Dashboard data langsung dari Supabase
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/portfolio">
              <Button variant="outline" size="sm" className="rounded-full">
                <Briefcase className="mr-2 size-4" weight="bold" />
                Lihat public
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="md:ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-muted-foreground">
        <span className="size-2.5 animate-pulse rounded-full bg-primary" />
        Memuat data admin
      </div>
    </div>
  );
}

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

interface AdminMetricCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

export function AdminMetricCard({ label, value, description, icon }: AdminMetricCardProps) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-3 font-heading text-4xl font-bold tracking-[-0.06em] text-foreground">
            {value}
          </p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-md bg-primary text-black">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

interface AdminPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AdminPanel({ title, description, children, action, className }: AdminPanelProps) {
  return (
    <section className={cn('rounded-md border border-border bg-card p-5', className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-[-0.045em] text-foreground">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminStatusPill({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'active' | 'muted';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold',
        tone === 'active' && 'border-primary/40 bg-primary/10 text-foreground',
        tone === 'muted' && 'border-border bg-surface text-muted-foreground',
        tone === 'default' && 'border-border bg-background text-foreground'
      )}
    >
      {children}
    </span>
  );
}

export function AdminEmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
