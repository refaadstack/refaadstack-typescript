'use client';

import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Desktop, Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';

const OPTIONS = [
  { value: 'system', label: 'Ikuti sistem', icon: Desktop },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted ? theme || 'system' : 'system';
  const ActiveIcon =
    OPTIONS.find((option) => option.value === activeTheme)?.icon || Desktop;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Pilih tema"
        >
          <ActiveIcon className="size-[1.1rem]" weight="bold" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-[70] min-w-44 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
        >
          {OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => setTheme(option.value)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition hover:bg-surface-strong focus:bg-surface-strong"
            >
              <option.icon className="size-4 text-primary" weight="bold" />
              <span>{option.label}</span>
              {activeTheme === option.value ? (
                <span className="ml-auto size-1.5 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
