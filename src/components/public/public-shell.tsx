'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

const TRANSITION = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[80] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main-content"
          key={pathname}
          style={{ minHeight: 'calc(100dvh - 4rem)' }}
          initial={
            reduceMotion ? false : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion ? undefined : { opacity: 0, y: -8 }
          }
          transition={TRANSITION}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
