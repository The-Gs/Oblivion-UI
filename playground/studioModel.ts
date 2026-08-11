/* ═══════════════════════════════════════════════════════════════════════
   Theme Studio — a live, token-level theme customizer.

   Everything the library renders reads from CSS custom properties, so we can
   retheme the *entire* kit by writing a handful of `--ob-*` values inline onto
   <html>. Those inline props win over whatever base theme is active, so the
   Studio layers on top of any preset and the preview is instant and global.

   This module is pure model + math:
     · a small state shape (color, feel, roundness, density, blur, gradient)
     · derivation (accent ramp, ink pick, material tokens, geometry scales)
     · apply()  — write/remove the inline props on <html>
     · toCss()  — the same override set as a copy-pasteable block
   The React panel in ThemeStudio.tsx just edits the state and calls these.
   ═══════════════════════════════════════════════════════════════════════ */

export type Feel = 'glass' | 'sleek' | 'minimal' | 'compact';
export type InkMode = 'auto' | 'light' | 'dark' | 'custom';
export type GradientTarget = 'surface' | 'page';

export interface StudioState {
  enabled: boolean;
  accent: string; // hex
  bg: string; // hex
  ink: InkMode;
  inkColor: string; // hex, used when ink === 'custom'
  font: string; // FONTS id
  feel: Feel;
  radius: number; // px, drives --ob-r-md; others scale off it
  density: number; // spacing multiplier, 0.75 (tight) … 1.3 (airy)
  blur: number; // px, for glass/sleek feels
  gradient: boolean;
  gradFrom: string;
  gradTo: string;
  gradAngle: number; // deg
  gradTarget: GradientTarget;
}

export const DEFAULT_STUDIO: StudioState = {
  enabled: false,
  accent: '#b31f33',
  bg: '#0a0908',
  ink: 'auto',
  inkColor: '#efeceb',
  font: 'default',
  feel: 'glass',
  radius: 14,
  density: 1,
  blur: 22,
  gradient: false,
  gradFrom: '#b31f33',
  gradTo: '#1a1216',
  gradAngle: 135,
  gradTarget: 'page',
};

/** Feel presets also nudge the sliders, so picking one gives an instant,
 *  coherent look the user can then fine-tune. */
export const FEEL_PRESET: Record<Feel, Partial<StudioState>> = {
  glass: { blur: 22, radius: 14, density: 1 },
  sleek: { blur: 12, radius: 12, density: 1 },
  minimal: { blur: 0, radius: 10, density: 1 },
  compact: { blur: 0, radius: 8, density: 0.8 },
};

export const FEELS: { id: Feel; label: string; hint: string }[] = [
  { id: 'glass', label: 'Glass', hint: 'Translucent, blurred, lifts on hover' },
  { id: 'sleek', label: 'Sleek', hint: 'Refined glass, softer depth' },
  { id: 'minimal', label: 'Minimal', hint: 'Opaque, flat, hairline borders' },
  { id: 'compact', label: 'Compact', hint: 'Minimal + tight spacing & radius' },
];

/** Font stacks the Studio can apply to the whole kit (--ob-font + display). */
export const FONTS: { id: string; label: string; stack: string }[] = [
  { id: 'default', label: 'Default', stack: '' },
  { id: 'system', label: 'System', stack: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
  { id: 'geometric', label: 'Geometric', stack: '"Century Gothic", Futura, system-ui, sans-serif' },
  { id: 'humanist', label: 'Humanist', stack: '"Segoe UI", Tahoma, Verdana, sans-serif' },
  { id: 'serif', label: 'Serif', stack: 'Georgia, "Times New Roman", serif' },
  { id: 'slab', label: 'Slab', stack: '"Rockwell", "Roboto Slab", Georgia, serif' },
  { id: 'rounded', label: 'Rounded', stack: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif' },
  { id: 'mono', label: 'Mono', stack: 'ui-monospace, "SF Mono", Menlo, monospace' },
];

const FONT_MAP: Record<string, string> = Object.fromEntries(FONTS.map((f) => [f.id, f.stack]));

/* ── Colour math ──────────────────────────────────────────────────────── */

type RGB = [number, number, number];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n);

function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [128, 128, 128];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: RGB): string {
  const to = (v: number) => clamp(round(v), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

const triplet = ([r, g, b]: RGB) => `${round(r)} ${round(g)} ${round(b)}`;

/** Mix toward white (amt > 0) — used to build the accent ramp. */
function lighten([r, g, b]: RGB, amt: number): RGB {
  return [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt];
}

/** Mix toward black — used to strengthen a light custom ink. */
function darken([r, g, b]: RGB, amt: number): RGB {
  return [r * (1 - amt), g * (1 - amt), b * (1 - amt)];
}

/** Perceived luminance 0…1, to pick ink and derive the sunk surface. */
function luminance([r, g, b]: RGB): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Best-effort parse of a computed token — hex, `r g b` triplet, or rgb(). */
export function parseColor(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith('#')) return rgbToHex(hexToRgb(v));
  const nums = v.match(/\d+(\.\d+)?/g);
  if (nums && nums.length >= 3) {
    return rgbToHex([Number(nums[0]), Number(nums[1]), Number(nums[2])]);
  }
  return null;
}

/** Seed the Studio from the live theme so it opens on the current look. */
export function seedFromComputed(base: StudioState): StudioState {
  if (typeof window === 'undefined') return base;
  const cs = getComputedStyle(document.documentElement);
  const accent = parseColor(cs.getPropertyValue('--ob-accent'));
  const bg = parseColor(cs.getPropertyValue('--ob-bg'));
  return {
    ...base,
    accent: accent ?? base.accent,
    bg: bg ?? base.bg,
    gradFrom: accent ?? base.gradFrom,
  };
}

/* ── Derivation → the override set ────────────────────────────────────── */

const INK = {
  light: { rgb: '239 236 235', strong: '#f4f1f0', ink: '#efeceb' },
  dark: { rgb: '20 16 16', strong: '#14100f', ink: '#2a2626' },
};

/** All props the Studio can set — the removal list, so disabling cleanly
 *  reverts to the underlying theme with nothing left behind. */
export const STUDIO_KEYS = [
  '--ob-accent', '--ob-accent-lit', '--ob-accent-bright', '--ob-accent-hot',
  '--ob-accent-soft', '--ob-accent-pale', '--ob-accent-edge', '--ob-accent-edge-lit',
  '--ob-bg', '--ob-bg-sunk',
  '--ob-ink-rgb', '--ob-ink-strong', '--ob-ink',
  '--ob-font', '--ob-font-display',
  '--ob-surface-fill', '--ob-glass-fill', '--ob-glass-fill-lit', '--ob-glass-blur',
  '--ob-lift', '--ob-surface-glow',
  '--ob-line', '--ob-line-top', '--ob-line-lit', '--ob-line-lit-top',
  '--ob-shadow-sm', '--ob-shadow', '--ob-shadow-lg', '--ob-shadow-xl', '--ob-inset-top',
  '--ob-r-xs', '--ob-r-sm', '--ob-r-md', '--ob-r-lg', '--ob-r-xl', '--ob-r-2xl',
  '--ob-space-1', '--ob-space-2', '--ob-space-3', '--ob-space-4',
  '--ob-space-5', '--ob-space-6', '--ob-space-7',
  '--ob-glow', '--ob-glow-lg', '--ob-ring',
] as const;

export interface Overrides {
  props: Record<string, string>;
  pageGradient?: string;
}

export function buildOverrides(s: StudioState): Overrides {
  const props: Record<string, string> = {};
  const accent = hexToRgb(s.accent);
  const bg = hexToRgb(s.bg);
  const lightBg = luminance(bg) > 0.5;

  /* Accent ramp — one hue, brightened in steps toward white. */
  props['--ob-accent'] = triplet(accent);
  props['--ob-accent-lit'] = triplet(lighten(accent, 0.1));
  props['--ob-accent-bright'] = triplet(lighten(accent, 0.24));
  props['--ob-accent-hot'] = triplet(lighten(accent, 0.46));
  props['--ob-accent-soft'] = triplet(lighten(accent, 0.62));
  props['--ob-accent-pale'] = triplet(lighten(accent, 0.82));
  props['--ob-accent-edge'] = triplet(lighten(accent, 0.32));
  props['--ob-accent-edge-lit'] = triplet(lighten(accent, 0.56));

  /* Ground. Sunk pane pops up on light, sinks on dark. */
  props['--ob-bg'] = s.bg;
  props['--ob-bg-sunk'] = rgbToHex(lighten(bg, lightBg ? 0.55 : 0.06));

  /* Ink — auto follows background luminance; custom uses a picked colour. */
  if (s.ink === 'custom') {
    const c = hexToRgb(s.inkColor);
    props['--ob-ink-rgb'] = triplet(c);
    props['--ob-ink'] = rgbToHex(c);
    props['--ob-ink-strong'] = rgbToHex(luminance(c) > 0.5 ? lighten(c, 0.25) : darken(c, 0.35));
  } else {
    const ink = INK[s.ink === 'dark' ? 'dark' : s.ink === 'light' ? 'light' : lightBg ? 'dark' : 'light'];
    props['--ob-ink-rgb'] = ink.rgb;
    props['--ob-ink-strong'] = ink.strong;
    props['--ob-ink'] = ink.ink;
  }

  /* Typography — swap the display + body stack across the whole kit. */
  const stack = FONT_MAP[s.font];
  if (stack) {
    props['--ob-font'] = stack;
    props['--ob-font-display'] = stack;
  }

  /* Material — the "feel". */
  const flat = s.feel === 'minimal' || s.feel === 'compact';
  const blur = flat ? 0 : Math.max(0, s.blur);
  props['--ob-glass-blur'] = `${blur}px`;
  props['--ob-lift'] = s.feel === 'glass' ? '4px' : s.feel === 'sleek' ? '2px' : '0px';
  props['--ob-surface-glow'] = '0 0 #0000';

  if (flat) {
    props['--ob-surface-fill'] = 'var(--ob-bg-sunk)';
    props['--ob-glass-fill'] = 'var(--ob-bg-sunk)';
    props['--ob-glass-fill-lit'] = 'rgb(var(--ob-ink-rgb) / 0.06)';
    props['--ob-line'] = 'rgb(var(--ob-ink-rgb) / 0.14)';
    props['--ob-line-top'] = 'rgb(var(--ob-ink-rgb) / 0.2)';
    props['--ob-line-lit'] = 'rgb(var(--ob-ink-rgb) / 0.22)';
    props['--ob-line-lit-top'] = 'rgb(var(--ob-ink-rgb) / 0.3)';
  } else {
    const fill = s.feel === 'glass' ? (lightBg ? 0.55 : 0.06) : lightBg ? 0.72 : 0.1;
    const fillLit = s.feel === 'glass' ? (lightBg ? 0.75 : 0.1) : lightBg ? 0.9 : 0.15;
    props['--ob-surface-fill'] = `rgb(var(--ob-white) / ${fill})`;
    props['--ob-glass-fill'] = `rgb(var(--ob-white) / ${fill})`;
    props['--ob-glass-fill-lit'] = `rgb(var(--ob-white) / ${fillLit})`;
    // White-based rims read as specular on dark, as frost on light.
    const rim = lightBg ? [0.8, 1, 0.9, 1] : [0.11, 0.22, 0.16, 0.32];
    props['--ob-line'] = `rgb(var(--ob-white) / ${rim[0]})`;
    props['--ob-line-top'] = `rgb(var(--ob-white) / ${rim[1]})`;
    props['--ob-line-lit'] = `rgb(var(--ob-white) / ${rim[2]})`;
    props['--ob-line-lit-top'] = `rgb(var(--ob-white) / ${rim[3]})`;
  }

  /* Depth — scale shadows to the background, or a light theme floats. Oblivion's
     defaults are heavy dark shadows for a near-black ground; on a light bg they
     read as everything lifting off the page. Flat feels barely cast at all. */
  const shadow = flat
    ? { sm: '0 1px 2px rgb(0 0 0 / 0.05)', base: '0 1px 3px rgb(0 0 0 / 0.06)', lg: '0 8px 20px rgb(0 0 0 / 0.08)', xl: '0 14px 34px rgb(0 0 0 / 0.1)' }
    : lightBg
      ? { sm: '0 2px 8px rgb(0 0 0 / 0.06)', base: '0 4px 14px rgb(0 0 0 / 0.08)', lg: '0 12px 36px rgb(0 0 0 / 0.12)', xl: '0 24px 60px rgb(0 0 0 / 0.16)' }
      : { sm: '0 5px 16px rgb(0 0 0 / 0.35)', base: '0 12px 40px rgb(0 0 0 / 0.4)', lg: '0 20px 60px rgb(0 0 0 / 0.5)', xl: '0 30px 80px rgb(0 0 0 / 0.6)' };
  props['--ob-shadow-sm'] = shadow.sm;
  props['--ob-shadow'] = shadow.base;
  props['--ob-shadow-lg'] = shadow.lg;
  props['--ob-shadow-xl'] = shadow.xl;
  props['--ob-inset-top'] = lightBg ? 'inset 0 1px 0 #fff' : 'inset 0 1px 0 rgb(255 255 255 / 0.15)';

  /* Geometry — roundness scales off the base radius. */
  const r = Math.max(0, s.radius);
  props['--ob-r-xs'] = `${round(r * 0.6)}px`;
  props['--ob-r-sm'] = `${round(r * 0.85)}px`;
  props['--ob-r-md'] = `${round(r)}px`;
  props['--ob-r-lg'] = `${round(r * 1.3)}px`;
  props['--ob-r-xl'] = `${round(r * 1.45)}px`;
  props['--ob-r-2xl'] = `${round(r * 1.7)}px`;

  /* Density — every spacing step scales together. */
  const base = [4, 8, 12, 16, 22, 28, 40];
  base.forEach((v, i) => {
    props[`--ob-space-${i + 1}`] = `${round(v * s.density)}px`;
  });

  /* Accent-tinted depth. */
  props['--ob-glow'] = '0 6px 20px rgb(var(--ob-accent) / 0.28)';
  props['--ob-glow-lg'] = '0 12px 30px rgb(var(--ob-accent) / 0.45)';
  props['--ob-ring'] = '0 0 0 3px rgb(var(--ob-accent) / 0.2)';

  /* Gradient — an explicit opt-out of the "no gradients" house rule, applied
     either as the surface fill or the page backdrop. */
  let pageGradient: string | undefined;
  if (s.gradient) {
    const grad = `linear-gradient(${s.gradAngle}deg, ${s.gradFrom}, ${s.gradTo})`;
    if (s.gradTarget === 'surface') {
      props['--ob-surface-fill'] = grad;
      props['--ob-glass-fill'] = grad;
    } else {
      pageGradient = grad;
    }
  }

  return { props, pageGradient };
}

/* ── Apply / reset ────────────────────────────────────────────────────── */

export function applyStudio(s: StudioState): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (!s.enabled) {
    resetStudio();
    return;
  }
  const { props, pageGradient } = buildOverrides(s);
  for (const key of STUDIO_KEYS) {
    if (props[key] != null) root.style.setProperty(key, props[key]);
    else root.style.removeProperty(key);
  }
  root.style.backgroundImage = pageGradient ?? '';
}

export function resetStudio(): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  for (const key of STUDIO_KEYS) root.style.removeProperty(key);
  root.style.backgroundImage = '';
}

/* ── Export ───────────────────────────────────────────────────────────── */

export function toStudioCss(s: StudioState, selector = ':root'): string {
  const { props, pageGradient } = buildOverrides(s);
  const lines = STUDIO_KEYS.filter((k) => props[k] != null).map((k) => `  ${k}: ${props[k]};`);
  if (pageGradient) lines.push(`  background-image: ${pageGradient};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
