import Link from 'next/link';
import {
  ChatCircle,
  Envelope,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
} from '@phosphor-icons/react/dist/ssr';
import { Container } from '@/components/public/container';
import { COMPANY, NAV_LINKS } from '@/lib/constants';

const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/refaadstack/',
    label: 'Instagram',
    icon: InstagramLogo,
  },
  {
    href: 'https://github.com/refaadstack',
    label: 'GitHub',
    icon: GithubLogo,
  },
  {
    href: 'https://www.linkedin.com/in/redho-fadillah-adha/',
    label: 'LinkedIn',
    icon: LinkedinLogo,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="font-heading text-lg font-extrabold tracking-[0.14em] text-foreground"
            >
              REFAA<span className="text-primary">D</span>STACK
            </Link>
            <p className="mt-5 text-pretty leading-7 text-muted-foreground">
              {COMPANY.description}
            </p>
            <div className="mt-7 flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/60 hover:text-primary"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" weight="bold" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground">Jelajahi</h2>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Navigasi footer">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground">Kontak</h2>
            <div className="mt-5 flex flex-col gap-4">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition hover:text-primary"
              >
                <Envelope className="size-4 shrink-0" weight="bold" />
                {COMPANY.email}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition hover:text-primary"
              >
                <ChatCircle className="size-4 shrink-0" weight="bold" />
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} RefaadStack.</p>
          <p>Software house dan pengembangan web di Jambi.</p>
        </div>
      </Container>
    </footer>
  );
}
