'use client';

import Link from 'next/link';
import type { ChangeEvent, ReactNode } from 'react';
import { FloppyDisk } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function AdminField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="text-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AdminToggleRow({
  name,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4 transition hover:border-primary/40">
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
      </span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-border bg-background accent-primary"
      />
    </label>
  );
}

export function AdminNotice({
  tone,
  children,
  className,
}: {
  tone: 'error' | 'success';
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-md border p-4 text-sm font-medium',
        tone === 'error' && 'border-destructive/30 bg-destructive/10 text-destructive',
        tone === 'success' && 'border-primary/30 bg-primary/10 text-foreground',
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminFormActions({
  saving,
  submitLabel,
  savingLabel = 'Menyimpan...',
  cancelHref,
}: {
  saving: boolean;
  submitLabel: string;
  savingLabel?: string;
  cancelHref: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit" disabled={saving} className="rounded-full">
        <FloppyDisk className="mr-2 size-4" weight="bold" />
        {saving ? savingLabel : submitLabel}
      </Button>
      <Button asChild variant="outline" className="rounded-full">
        <Link href={cancelHref}>Batal</Link>
      </Button>
    </div>
  );
}

export function AdminImagePlaceholder({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface p-8 text-center">
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-md bg-background text-primary">
        {icon}
      </div>
      <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}
