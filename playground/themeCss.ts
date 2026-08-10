/* The full list of design tokens the library reads. Kept in declaration order
   so an exported theme block reads top-to-bottom like the source tokens.css. */
const TOKEN_NAMES = [
  '--ob-bg',
  '--ob-bg-sunk',
  '--ob-ink-rgb',
  '--ob-ink-strong',
  '--ob-ink',
  '--ob-ink-2',
  '--ob-ink-3',
  '--ob-ink-4',
  '--ob-accent',
  '--ob-accent-lit',
  '--ob-accent-bright',
  '--ob-accent-hot',
  '--ob-accent-soft',
  '--ob-accent-pale',
  '--ob-accent-edge',
  '--ob-accent-edge-lit',
  '--ob-glass-fill',
  '--ob-glass-fill-lit',
  '--ob-glass-blur',
  '--ob-glass-sat',
  '--ob-surface-fill',
  '--ob-lift',
  '--ob-surface-glow',
  '--ob-line',
  '--ob-line-top',
  '--ob-line-lit',
  '--ob-line-lit-top',
  '--ob-well',
  '--ob-well-deep',
  '--ob-well-top',
  '--ob-shadow-sm',
  '--ob-shadow',
  '--ob-shadow-lg',
  '--ob-shadow-xl',
  '--ob-inset-top',
  '--ob-glow',
  '--ob-glow-lg',
  '--ob-ring',
  '--ob-r-sm',
  '--ob-r-md',
  '--ob-r-lg',
  '--ob-r-xl',
  '--ob-spring',
  '--ob-ease',
  '--ob-dur',
];

/**
 * Read the *resolved* value of every design token from the document root and
 * emit a copy-pasteable CSS block. This is a live snapshot of the active
 * theme — including any custom overrides — so a user can lift the whole look
 * into their own stylesheet.
 */
export function exportThemeCss(selector = ':root'): string {
  if (typeof window === 'undefined') return '';
  const cs = getComputedStyle(document.documentElement);
  const lines = TOKEN_NAMES.map((name) => {
    const value = cs.getPropertyValue(name).trim();
    return value ? `  ${name}: ${value};` : null;
  }).filter(Boolean);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
