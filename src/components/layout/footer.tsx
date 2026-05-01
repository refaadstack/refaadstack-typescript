'use client';

import Link from 'next/link';
import { MessageCircle, Mail, MapPin, Clock, Instagram, Github, Linkedin } from 'lucide-react';
import { COMPANY, NAV_LINKS } from '@/lib/constants';

const SERVICES_LINKS = [
  { href: '#services', label: 'Company Profile' },
  { href: '#services', label: 'Custom Dashboard' },
  { href: '#services', label: 'POS System' },
  { href: '#services', label: 'SaaS Development' },
  { href: '#services', label: 'API Integration' },
  { href: '#services', label: 'Automation' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight mb-4"
            >
              <span className="text-primary">Refaad</span>
              <span className="text-foreground">Stack</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              {COMPANY.description}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Services</h3>
            <nav className="flex flex-col gap-3">
              {SERVICES_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {COMPANY.email}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {COMPANY.phone}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {COMPANY.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {COMPANY.workingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} RefaadStack. All rights reserved.</p>
            <p>Built with ❤️ in Palembang, Indonesia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
