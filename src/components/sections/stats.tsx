'use client';

import { STATS } from '@/lib/constants';

export function Stats() {
  return (
    <section className="border-y border-border bg-background-secondary">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-background-secondary p-6 md:p-8 text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold font-heading bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
