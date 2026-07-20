'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChatCircle, List, X } from '@phosphor-icons/react';
import { Container } from '@/components/public/container';
import { ThemeToggle } from '@/components/public/theme-toggle';
import { Button } from '@/components/ui/button';
import { COMPANY, NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
      <Container>
        <nav className="flex h-16 items-center justify-between gap-5" aria-label="Navigasi utama">
          <Link href="/" className="shrink-0" aria-label="RefaadStack, halaman utama">
            <Image
              src="/images/brand/logo-light.png"
              alt="RefaadStack"
              width={497}
              height={62}
              className="h-6 w-auto object-contain dark:hidden sm:h-7"
              priority
            />
            <Image
              src="/images/brand/logo-dark.png"
              alt="RefaadStack"
              width={497}
              height={62}
              className="hidden h-6 w-auto object-contain dark:block sm:h-7"
              priority
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                !link.href.includes('#') && pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'whitespace-nowrap text-sm font-semibold text-muted-foreground transition hover:text-foreground',
                    isActive && 'text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button asChild size="sm">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatCircle className="mr-2 size-4" weight="bold" />
                Konsultasi
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" weight="bold" />
              ) : (
                <List className="size-5" weight="bold" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="border-t border-border bg-background md:hidden"
          >
            <Container className="flex min-h-[calc(100dvh-4rem)] flex-col py-8">
              <div className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-border py-4 font-heading text-2xl font-bold tracking-[-0.03em] text-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Button asChild size="lg" className="mt-auto w-full">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ChatCircle className="mr-2 size-5" weight="bold" />
                  Konsultasi
                </a>
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
