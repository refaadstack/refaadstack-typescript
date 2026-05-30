'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/auth';
import { getAdminStats } from '@/lib/crud';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  Settings, 
  ShoppingCart, 
  MessageSquare, 
  LogOut,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalPortfolios: number;
  totalProducts: number;
  activeProducts: number;
  totalTestimonials: number;
  totalServices: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalPortfolios: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalTestimonials: 0,
    totalServices: 0,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionUser = await getAdminSession();
      if (!sessionUser) {
        router.push('/admin/login');
        return;
      }
      setUser(sessionUser);
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Session error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Portfolio',
      value: stats.totalPortfolios,
      icon: Package,
      color: 'text-cyan-500',
    },
    {
      title: 'Produk Aktif',
      value: stats.activeProducts,
      icon: ShoppingCart,
      color: 'text-violet-500',
    },
    {
      title: 'Testimonial',
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: 'text-emerald-500',
    },
    {
      title: 'Layanan',
      value: stats.totalServices,
      icon: Eye,
      color: 'text-amber-500',
    },
  ];

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', active: true },
    { title: 'Portfolios', icon: Image, href: '/admin/portfolio' },
    { title: 'Products', icon: ShoppingCart, href: '/admin/products' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { title: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-white font-bold">RefaadStack</h1>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full mt-auto absolute bottom-4 left-4 right-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Selamat datang, {user?.name || 'Admin'}.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-slate-800 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">
                Shortcut untuk pekerjaan yang paling sering dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/portfolio/new">
                <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Package className="w-4 h-4 mr-2" />
                  Tambah Portfolio
                </Button>
              </Link>
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Tambah Produk
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Ringkasan Konten</CardTitle>
              <CardDescription className="text-slate-400">
                Snapshot data yang tampil di website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <p className="text-slate-300 text-sm">
                    {stats.totalPortfolios} portfolio siap ditampilkan.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  <p className="text-slate-300 text-sm">
                    {stats.totalProducts} produk tersimpan, {stats.activeProducts} aktif.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-slate-300 text-sm">
                    {stats.totalTestimonials} testimonial tersedia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
