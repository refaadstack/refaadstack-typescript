import { Asterisk } from '@phosphor-icons/react/dist/ssr';

const ITEMS = [
  'Website',
  'POS System',
  'SaaS',
  'Aplikasi Web',
  'Dashboard',
  'Otomatisasi',
  'Integrasi API',
  'SEO',
] as const;

/**
 * Single keyword marquee strip under the hero. Pure CSS animation;
 * collapses to a static row under prefers-reduced-motion via the global
 * motion reset in globals.css.
 */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <div aria-hidden className="overflow-hidden border-b border-border bg-surface py-4">
      <div className="marquee-track flex w-max items-center">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-6 pr-6 font-heading text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {item}
            <Asterisk className="size-4 text-primary" weight="bold" />
          </span>
        ))}
      </div>
    </div>
  );
}
