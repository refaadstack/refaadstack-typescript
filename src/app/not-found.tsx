import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { PublicShell } from '@/components/public/public-shell';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PublicShell>
      <Container className="flex min-h-[80dvh] flex-col items-start justify-center pb-20 pt-32">
        <p className="font-mono text-sm font-bold text-primary">404</p>
        <h1 className="mt-5 max-w-3xl text-balance font-heading text-5xl font-bold leading-[0.98] tracking-[-0.05em] text-foreground sm:text-7xl">
          Halaman ini tidak ditemukan.
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-8 text-muted-foreground">
          Tautannya mungkin berubah atau kontennya sudah tidak tersedia.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 size-5" weight="bold" />
            Kembali ke beranda
          </Link>
        </Button>
      </Container>
    </PublicShell>
  );
}
