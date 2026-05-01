'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { Services } from '@/components/sections/services';
import { WhyUs } from '@/components/sections/why-us';
import { Products } from '@/components/sections/products';
import { Process } from '@/components/sections/process';
import { Portfolio } from '@/components/sections/portfolio';
import { Testimonials } from '@/components/sections/testimonials';
import { CTA } from '@/components/sections/cta';

export default function HomePage() {
  return (
    <>
      <Navbar />
<main>
        <Hero />
        <Stats />
        <Services />
        <WhyUs />
        <Products />
        <Process />
        <Portfolio />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
