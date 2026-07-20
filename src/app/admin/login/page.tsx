'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Envelope, Lock, Sparkle } from '@phosphor-icons/react';
import { loginAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);

      if (result.success) {
        router.push('/admin/dashboard');
        return;
      }

      setError(result.error || 'Login gagal');
    } catch {
      setError('Login gagal. Cek koneksi Supabase dan tabel admins.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="absolute inset-0 surface-grid opacity-70" />
      <div className="absolute -left-24 top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 size-80 rounded-full bg-primary/15 blur-3xl" />

      <section className="relative z-10 w-full max-w-md border border-border bg-card p-6">
        <div className="mb-8">
          <div className="mb-5 inline-grid size-14 place-items-center rounded-md bg-primary text-black">
            <Sparkle className="size-6" weight="fill" />
          </div>
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-strong">
            RefaadStack admin
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-[0.95] tracking-[-0.06em]">
            Masuk ke content cockpit.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Kredensial divalidasi dari tabel{' '}
            <code className="rounded-md bg-surface px-1.5 py-0.5 text-foreground">admins</code>,
            bukan credential hardcoded.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <span className="relative block">
              <Envelope className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" weight="bold" />
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 pl-10"
                placeholder="admin@refaadstack.dev"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" weight="bold" />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 pl-10"
                placeholder="Masukkan password admin"
                required
              />
            </span>
          </label>

          <Button type="submit" disabled={loading} className="h-12 w-full rounded-full">
            {loading ? 'Memeriksa database' : 'Masuk dashboard'}
          </Button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary-strong"
        >
          <ArrowLeft className="size-4" weight="bold" />
          Kembali ke homepage
        </Link>
      </section>
    </main>
  );
}
