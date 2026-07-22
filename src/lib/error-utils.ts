/**
 * Extracts a human-readable error message from any error type.
 * Handles Next.js server action digest errors, Supabase errors,
 * standard JS Errors, and plain strings.
 */
export function getErrorMessage(err: unknown, fallback = 'Terjadi kesalahan. Coba lagi.'): string {
  if (!err) return fallback;

  if (typeof err === 'string') return err;

  if (err instanceof Error) {
    const msg = err.message || String(err);
    // Next.js server action errors have "NEXT_REDIRECT" or digest in them
    if (msg.includes('NEXT_REDIRECT')) return fallback;
    // Supabase errors often have "Upload failed:" prefix
    if (msg.includes('Upload failed:')) return msg;
    // Generic long messages - show them
    if (msg.length > 5) return msg;
    return fallback;
  }

  // Plain objects (e.g. { message: "...", digest: "..." })
  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message.length > 5) return obj.message;
    if (typeof obj.error === 'string') return obj.error;
  }

  return fallback;
}
