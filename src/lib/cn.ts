/**
 * Minimal class-name joiner. Keeps the bundle dependency-free.
 *
 * Accepts `unknown` so `someReactNode && 'cls'` guards type-check — a
 * ReactNode can be a number, and `0 && 'cls'` is `0`, not `false`. Only
 * strings survive into the output.
 */
export function cn(...parts: unknown[]): string | undefined {
  const out = parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' ');
  return out.length > 0 ? out : undefined;
}
