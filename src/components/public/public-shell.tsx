import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[80] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
