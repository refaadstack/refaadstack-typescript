'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BlogFilter({
  categories,
  tags,
}: {
  categories: string[];
  tags: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const activeCategory = params.get('kategori') || '';
  const activeTag = params.get('tag') || '';

  function setFilter(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('tag');
    p.delete('kategori');
    if (key === 'kategori' && value) p.set('kategori', value);
    else if (key === 'tag' && value) p.set('tag', value);
    router.push(`/blog?${p.toString()}`);
  }

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Filter:</span>

          <button
            onClick={() => router.push('/blog')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition',
              !activeCategory && !activeTag
                ? 'border-primary bg-primary text-black'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            Semua
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('kategori', activeCategory === cat ? '' : cat)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold transition',
                activeCategory === cat
                  ? 'border-primary bg-primary text-black'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}

          <span className="mx-1 text-border">|</span>

          {tags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter('tag', activeTag === tag ? '' : tag)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition',
                activeTag === tag
                  ? 'border-primary bg-primary text-black'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
