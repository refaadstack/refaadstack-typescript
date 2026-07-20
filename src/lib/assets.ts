import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Legacy abstract fallback image baked into the data layer. Treated as
 * "no real image" by the public redesign so slots fall through to local
 * files or designed placeholders.
 */
export const ABSTRACT_STILL = '/images/refaadstack-system-still.png';

/**
 * Checks whether a file exists under /public at request time (server-side
 * only). Used so the site can ship designed placeholders until real
 * screenshots are dropped into public/images/.
 */
export function publicImageExists(publicPath: string): boolean {
  try {
    return existsSync(path.join(process.cwd(), 'public', publicPath));
  } catch {
    return false;
  }
}

/**
 * Resolution order for content imagery:
 * 1. Real image from the database (Supabase storage or any URL)
 * 2. Local file dropped into public/images/... (e.g. /images/work/<slug>.png)
 * 3. null → caller renders a designed placeholder
 */
export function resolveImageSrc(dbImage: string | null | undefined): string | null {
  if (!dbImage || dbImage === ABSTRACT_STILL) return null;
  return dbImage;
}

export function resolveImage(
  dbImage: string | null | undefined,
  localSlot: string
): string | null {
  if (dbImage && dbImage !== ABSTRACT_STILL) return dbImage;
  if (publicImageExists(localSlot)) return localSlot;
  return null;
}
