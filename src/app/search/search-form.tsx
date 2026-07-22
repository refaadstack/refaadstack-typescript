'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, ArrowRight, CircleNotch, ArrowLeft } from '@phosphor-icons/react';

interface SearchResult {
  _type: 'blog' | 'project' | 'portfolio' | 'product';
  title?: string;
  name?: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  short_description?: string;
  tagline?: string;
  description?: string;
  category?: string;
}

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog', portfolio: 'Portfolio', product: 'Produk',
};

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setQuery(q);
    if (q) search(q);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.replaceState({}, '', url.toString());
    search(query);
  };

  const grouped: Record<string, SearchResult[]> = {};
  results.forEach((item) => {
    if (!grouped[item._type]) grouped[item._type] = [];
    grouped[item._type].push(item);
  });

  function getHref(item: SearchResult) {
    const s = item.slug;
    switch (item._type) {
      case 'blog': return `/blog/${s}`;
      case 'project': return `/projects/${s}`;
      case 'portfolio': return `/portfolio/${s}`;
      case 'product': return `/products/${s}`;
    }
  }

  function getTitle(item: SearchResult) {
    return item._type === 'product' ? (item.name || '') : (item.title || '');
  }

  function getDesc(item: SearchResult) {
    return item.excerpt || item.summary || item.short_description || item.tagline || item.description || '';
  }

  function highlight(text: string) {
    if (!query.trim() || !text) return text;
    const escaped = query.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((p, i) =>
      new RegExp(`^${escaped}$`, 'i').test(p)
        ? <mark key={i} className="bg-primary/25 text-foreground rounded-sm px-0.5">{p}</mark>
        : p
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary-strong mb-8">
        <ArrowLeft className="size-4" weight="bold" />
        Kembali ke beranda
      </Link>

      <form onSubmit={handleSubmit} className="relative">
        <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" weight="bold" />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel, project, portfolio, produk..."
          className="h-14 w-full border border-border bg-background pl-12 pr-20 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black transition hover:bg-primary/85">
          Cari
        </button>
      </form>

      {loading && (
        <div className="mt-16 flex justify-center">
          <CircleNotch className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && searched && (
        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            {results.length} hasil untuk <span className="font-semibold text-foreground">"{query}"</span>
          </p>

          {results.length === 0 ? (
            <p className="mt-8 text-muted-foreground">Tidak ada hasil. Coba kata kunci lain.</p>
          ) : (
            <div className="mt-8 space-y-12">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                    {TYPE_LABELS[type]}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <Link key={`${item._type}-${item.slug}-${i}`} href={getHref(item)}
                        className="group flex items-start justify-between gap-4 border-t border-border py-4 transition hover:bg-surface"
                      >
                        <div className="min-w-0">
                          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary-strong">
                            {highlight(getTitle(item))}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {highlight(getDesc(item))}
                          </p>
                        </div>
                        <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" weight="bold" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
