import type { ReactNode } from 'react';
import {
  GlassAlert,
  GlassAvatar,
  GlassBadge,
  GlassButton,
  GlassCard,
  GlassInput,
  GlassProgress,
  GlassSurface,
  Separator,
} from '../../src';

/* ── Field schema — one entry per editable prop in the inspector ──────── */
export type Field =
  | { type: 'text'; key: string; label: string }
  | { type: 'select'; key: string; label: string; options: string[] }
  | { type: 'toggle'; key: string; label: string }
  | { type: 'range'; key: string; label: string; min: number; max: number; step?: number; unit?: string };

export type Props = Record<string, string | number | boolean>;

export interface BlockDef {
  type: string;
  label: string;
  group: string;
  /** Named imports this block needs from `oblivion-ui`. */
  imports: string[];
  defaults: Props;
  fields: Field[];
  render: (p: Props) => ReactNode;
  /** JSX string for the generated page (no outer indentation). */
  toCode: (p: Props) => string;
}

const attr = (name: string, v: string | number | boolean | undefined) =>
  typeof v === 'boolean'
    ? v
      ? ` ${name}`
      : ''
    : typeof v === 'number'
      ? ` ${name}={${v}}`
      : v
        ? ` ${name}="${v}"`
        : '';

/* ─────────────────────────────────────────────────────────────────────────
   The blocks. Each maps to real library components, so the canvas preview is
   pixel-identical to what the generated code will render.
   ───────────────────────────────────────────────────────────────────────── */

export const BLOCKS: BlockDef[] = [
  {
    type: 'header',
    label: 'Header',
    group: 'Sections',
    imports: ['GlassSurface', 'GlassButton'],
    defaults: { brand: 'Acme', cta: 'Get started' },
    fields: [
      { type: 'text', key: 'brand', label: 'Brand' },
      { type: 'text', key: 'cta', label: 'CTA label' },
    ],
    render: (p) => (
      <GlassSurface
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', width: '100%' }}
      >
        <strong style={{ fontFamily: 'var(--ob-font-display)', fontSize: 16 }}>{String(p.brand)}</strong>
        <GlassButton variant="primary" size="sm">
          {String(p.cta)}
        </GlassButton>
      </GlassSurface>
    ),
    toCode: (p) =>
      `<GlassSurface style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>\n  <strong>${p.brand}</strong>\n  <GlassButton variant="primary" size="sm">${p.cta}</GlassButton>\n</GlassSurface>`,
  },
  {
    type: 'heading',
    label: 'Heading',
    group: 'Typography',
    imports: [],
    defaults: { text: 'Beautiful glass UI', size: '2xl', align: 'start' },
    fields: [
      { type: 'text', key: 'text', label: 'Text' },
      { type: 'select', key: 'size', label: 'Size', options: ['lg', 'xl', '2xl', '3xl'] },
      { type: 'select', key: 'align', label: 'Align', options: ['start', 'center', 'end'] },
    ],
    render: (p) => {
      const size = { lg: 22, xl: 30, '2xl': 40, '3xl': 54 }[String(p.size)] ?? 40;
      return (
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--ob-font-display)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: size,
            textAlign: p.align as 'start',
            color: 'var(--ob-ink-strong)',
            width: '100%',
          }}
        >
          {String(p.text)}
        </h2>
      );
    },
    toCode: (p) => {
      const size = { lg: 22, xl: 30, '2xl': 40, '3xl': 54 }[String(p.size)] ?? 40;
      return `<h2 style={{ fontSize: ${size}, fontWeight: 700, textAlign: '${p.align}' }}>${p.text}</h2>`;
    },
  },
  {
    type: 'text',
    label: 'Paragraph',
    group: 'Typography',
    imports: [],
    defaults: { text: 'Frosted surfaces, a single accent, motion that breathes.', align: 'start' },
    fields: [
      { type: 'text', key: 'text', label: 'Text' },
      { type: 'select', key: 'align', label: 'Align', options: ['start', 'center', 'end'] },
    ],
    render: (p) => (
      <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--ob-ink-2)', textAlign: p.align as 'start', maxWidth: '62ch', width: '100%' }}>
        {String(p.text)}
      </p>
    ),
    toCode: (p) => `<p style={{ textAlign: '${p.align}' }}>${p.text}</p>`,
  },
  {
    type: 'button',
    label: 'Button',
    group: 'Components',
    imports: ['GlassButton'],
    defaults: { text: 'Click me', variant: 'primary', size: 'md', loading: false, disabled: false },
    fields: [
      { type: 'text', key: 'text', label: 'Label' },
      { type: 'select', key: 'variant', label: 'Variant', options: ['primary', 'secondary', 'ghost', 'quiet'] },
      { type: 'select', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { type: 'toggle', key: 'loading', label: 'Loading' },
      { type: 'toggle', key: 'disabled', label: 'Disabled' },
    ],
    render: (p) => (
      <GlassButton variant={p.variant as 'primary'} size={p.size as 'md'} loading={Boolean(p.loading)} disabled={Boolean(p.disabled)}>
        {String(p.text)}
      </GlassButton>
    ),
    toCode: (p) =>
      `<GlassButton${attr('variant', p.variant)}${attr('size', p.size)}${attr('loading', p.loading)}${attr('disabled', p.disabled)}>${p.text}</GlassButton>`,
  },
  {
    type: 'badge',
    label: 'Badge',
    group: 'Components',
    imports: ['GlassBadge'],
    defaults: { text: 'New', variant: 'accent', dot: false, pulse: false },
    fields: [
      { type: 'text', key: 'text', label: 'Label' },
      { type: 'select', key: 'variant', label: 'Variant', options: ['accent', 'neutral', 'outline', 'status', 'solid'] },
      { type: 'toggle', key: 'dot', label: 'Dot' },
      { type: 'toggle', key: 'pulse', label: 'Pulse' },
    ],
    render: (p) => (
      <GlassBadge variant={p.variant as 'accent'} dot={Boolean(p.dot)} pulse={Boolean(p.pulse)}>
        {String(p.text)}
      </GlassBadge>
    ),
    toCode: (p) => `<GlassBadge${attr('variant', p.variant)}${attr('dot', p.dot)}${attr('pulse', p.pulse)}>${p.text}</GlassBadge>`,
  },
  {
    type: 'alert',
    label: 'Alert',
    group: 'Components',
    imports: ['GlassAlert'],
    defaults: { tone: 'accent', title: 'Heads up', text: 'A contextual message on glass.' },
    fields: [
      { type: 'select', key: 'tone', label: 'Tone', options: ['info', 'accent', 'success', 'warning', 'danger'] },
      { type: 'text', key: 'title', label: 'Title' },
      { type: 'text', key: 'text', label: 'Body' },
    ],
    render: (p) => (
      <div style={{ width: '100%' }}>
        <GlassAlert tone={p.tone as 'accent'} title={String(p.title)}>
          {String(p.text)}
        </GlassAlert>
      </div>
    ),
    toCode: (p) => `<GlassAlert${attr('tone', p.tone)} title="${p.title}">${p.text}</GlassAlert>`,
  },
  {
    type: 'card',
    label: 'Card',
    group: 'Components',
    imports: ['GlassCard', 'GlassButton'],
    defaults: { title: 'Substrata', description: 'Deep liquid rollers with halftime switch-ups.', cta: 'Play', interactive: true },
    fields: [
      { type: 'text', key: 'title', label: 'Title' },
      { type: 'text', key: 'description', label: 'Description' },
      { type: 'text', key: 'cta', label: 'Footer button' },
      { type: 'toggle', key: 'interactive', label: 'Interactive' },
    ],
    render: (p) => (
      <GlassCard
        title={String(p.title)}
        description={String(p.description)}
        interactive={Boolean(p.interactive)}
        footer={p.cta ? <GlassButton variant="primary" size="sm">{String(p.cta)}</GlassButton> : undefined}
        dividedFooter={Boolean(p.cta)}
        style={{ maxWidth: 340, width: '100%' }}
      />
    ),
    toCode: (p) =>
      `<GlassCard\n  title="${p.title}"\n  description="${p.description}"${attr('interactive', p.interactive)}${
        p.cta ? `\n  footer={<GlassButton variant="primary" size="sm">${p.cta}</GlassButton>}\n  dividedFooter` : ''
      }\n/>`,
  },
  {
    type: 'input',
    label: 'Input',
    group: 'Components',
    imports: ['GlassInput'],
    defaults: { label: 'Email', placeholder: 'you@label.rec', size: 'md', mono: false },
    fields: [
      { type: 'text', key: 'label', label: 'Label' },
      { type: 'text', key: 'placeholder', label: 'Placeholder' },
      { type: 'select', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { type: 'toggle', key: 'mono', label: 'Mono' },
    ],
    render: (p) => (
      <div style={{ width: '100%', maxWidth: 340 }}>
        <GlassInput label={String(p.label)} placeholder={String(p.placeholder)} size={p.size as 'md'} mono={Boolean(p.mono)} />
      </div>
    ),
    toCode: (p) => `<GlassInput label="${p.label}" placeholder="${p.placeholder}"${attr('size', p.size)}${attr('mono', p.mono)} />`,
  },
  {
    type: 'avatar',
    label: 'Avatar',
    group: 'Components',
    imports: ['GlassAvatar'],
    defaults: { name: 'Dana Kade', size: 'md', neutral: false },
    fields: [
      { type: 'text', key: 'name', label: 'Name' },
      { type: 'select', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { type: 'toggle', key: 'neutral', label: 'Neutral' },
    ],
    render: (p) => <GlassAvatar name={String(p.name)} size={p.size as 'md'} neutral={Boolean(p.neutral)} />,
    toCode: (p) => `<GlassAvatar name="${p.name}"${attr('size', p.size)}${attr('neutral', p.neutral)} />`,
  },
  {
    type: 'progress',
    label: 'Progress',
    group: 'Components',
    imports: ['GlassProgress'],
    defaults: { value: 64, label: 'Rendering' },
    fields: [
      { type: 'range', key: 'value', label: 'Value', min: 0, max: 100, unit: '%' },
      { type: 'text', key: 'label', label: 'Label' },
    ],
    render: (p) => (
      <div style={{ width: '100%', maxWidth: 420 }}>
        <GlassProgress value={p.value as number} label={String(p.label)} aria-label={String(p.label)} />
      </div>
    ),
    toCode: (p) => `<GlassProgress value={${p.value}} label="${p.label}" />`,
  },
  {
    type: 'divider',
    label: 'Divider',
    group: 'Sections',
    imports: ['Separator'],
    defaults: {},
    fields: [],
    render: () => (
      <div style={{ width: '100%' }}>
        <Separator />
      </div>
    ),
    toCode: () => `<Separator />`,
  },
];

export const BLOCK_MAP: Record<string, BlockDef> = Object.fromEntries(BLOCKS.map((b) => [b.type, b]));

export const BLOCK_GROUPS = ['Sections', 'Typography', 'Components'] as const;

/** Fonts the builder can apply to the whole canvas via --ob-font. */
export const FONTS = [
  { id: 'default', label: 'Theme default', stack: '' },
  { id: 'system', label: 'System', stack: 'system-ui, -apple-system, sans-serif' },
  { id: 'geometric', label: 'Geometric', stack: '"Century Gothic", "Futura", system-ui, sans-serif' },
  { id: 'serif', label: 'Serif', stack: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono', stack: 'ui-monospace, "SF Mono", Menlo, monospace' },
  { id: 'rounded', label: 'Rounded', stack: '"Trebuchet MS", Verdana, sans-serif' },
] as const;
