import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  Box,
  Flex,
  GlassAccordion,
  GlassAlert,
  GlassAvatar,
  GlassAvatarGroup,
  GlassBadge,
  GlassBreadcrumb,
  GlassButton,
  GlassCard,
  GlassCheckbox,
  GlassDataGrid,
  GlassInput,
  GlassKbd,
  GlassList,
  GlassMenu,
  GlassModal,
  GlassPagination,
  GlassProgress,
  GlassRadioGroup,
  GlassRating,
  GlassSegmented,
  GlassSelect,
  GlassSkeleton,
  GlassSkeletonText,
  GlassSlider,
  GlassSpinner,
  GlassStat,
  GlassSurface,
  GlassSwitch,
  GlassTable,
  GlassTabs,
  GlassTextarea,
  GlassTooltip,
  Grid,
  Orbs,
  Separator,
  Stack,
  THEMES,
  useToast,
} from '../src';
import { Demo } from './Demo';
import { Playground } from './Playground';

/* ── Page shell ──────────────────────────────────────────────────────── */

function Page({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="docs__content">
      <p className="docs__eyebrow">{eyebrow}</p>
      <h1 className="docs__title">{title}</h1>
      <p className="docs__lede">{lede}</p>
      {children}
    </article>
  );
}

const C = ({ children }: { children: ReactNode }) => <code className="docs__ic">{children}</code>;
const PgHead = () => (
  <>
    <h2 className="docs__h2">Playground</h2>
    <p className="docs__p">Tweak the props, watch it update, copy the result.</p>
  </>
);

/* ── Sample data ─────────────────────────────────────────────────────── */

interface Row {
  name: string;
  bpm: number;
  key: string;
  status: 'Mastered' | 'Mixing' | 'Draft';
}
const ROWS: Row[] = [
  { name: 'Substrata (VIP)', bpm: 174, key: 'F min', status: 'Mastered' },
  { name: 'Redline Pressure', bpm: 172, key: 'A min', status: 'Mixing' },
  { name: 'Hollow Signal', bpm: 87, key: 'D min', status: 'Draft' },
];
const STATUS_VARIANT = { Mastered: 'accent', Mixing: 'neutral', Draft: 'outline' } as const;
const GENRES = ['Liquid', 'Neurofunk', 'Halftime', 'Jungle'];
const PEOPLE = [
  { id: 'p1', name: 'Dana Kade', role: 'Sound design', status: 'Online' },
  { id: 'p2', name: 'Rui Vale', role: 'Mixing', status: 'Away' },
  { id: 'p3', name: 'Ines Cole', role: 'Mastering', status: 'Online' },
];
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specs' },
  { id: 'code', label: 'Code' },
];

/* ── Stateful demo wrappers (controlled components need their own state) ─ */

function LiveSelect({ disabled, error }: { disabled: boolean; error: boolean }) {
  const [val, setVal] = useState<string | null>('Neurofunk');
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <GlassSelect
        items={GENRES}
        getKey={(s) => s}
        value={val}
        onChange={(s) => setVal(s)}
        fieldLabel="Subgenre"
        aria-label="Subgenre"
        disabled={disabled}
        error={error ? 'Pick a valid option.' : undefined}
      />
    </div>
  );
}

function LiveTabs({ block }: { block: boolean }) {
  const [tab, setTab] = useState('overview');
  return (
    <div style={{ width: '100%' }}>
      <GlassTabs
        items={TABS}
        getKey={(t) => t.id}
        label={(t) => t.label}
        value={tab}
        onChange={(t) => setTab(t.id)}
        block={block}
        aria-label="Section"
      />
    </div>
  );
}

function LiveSlider({ showLabel }: { showLabel: boolean }) {
  const [wet, setWet] = useState(62);
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <GlassSlider value={wet} onChange={setWet} label={showLabel ? 'Wet / dry' : undefined} aria-label="Wet / dry" />
    </div>
  );
}

function LiveRadio({ column }: { column: boolean }) {
  const [feel, setFeel] = useState('Liquid');
  return (
    <GlassRadioGroup
      items={['Liquid', 'Halftime', 'Jungle']}
      getKey={(r) => r}
      value={feel}
      onChange={(r) => setFeel(r)}
      column={column}
      aria-label="Feel"
    />
  );
}

function LiveSwitch({ disabled }: { disabled: boolean }) {
  const [on, setOn] = useState(true);
  return <GlassSwitch checked={on} onChange={setOn} disabled={disabled} aria-label="Toggle" />;
}

function LiveCheckbox({ disabled }: { disabled: boolean }) {
  const [on, setOn] = useState(true);
  return (
    <GlassCheckbox checked={on} onChange={setOn} disabled={disabled}>
      Sidechain compression
    </GlassCheckbox>
  );
}

function LiveModal({ size }: { size: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GlassButton variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </GlassButton>
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        size={size as 'md'}
        title="Delete render queue?"
        description="This clears 12 queued bounces. The stems stay untouched."
        footer={
          <GlassButton size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Close
          </GlassButton>
        }
      />
    </>
  );
}

function LiveToast({ tone }: { tone: string }) {
  const { toast } = useToast();
  return (
    <GlassButton variant="primary" onClick={() => toast('Notification fired', { tone: tone as 'accent' })}>
      Fire toast
    </GlassButton>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Getting started
   ═══════════════════════════════════════════════════════════════════════ */

function IntroPage() {
  return (
    <Page
      eyebrow="Getting started"
      title="Oblivion UI"
      lede="Liquid-glass React components — frosted surfaces, a single accent, motion that breathes. Zero runtime dependencies, fully themeable from CSS variables."
    >
      <h2 className="docs__h2">Install</h2>
      <Demo code={`npm install oblivion-ui`}>
        <GlassBadge mono>npm i oblivion-ui</GlassBadge>
      </Demo>

      <h2 className="docs__h2">Use</h2>
      <p className="docs__p">
        Import the stylesheet once, wrap your app in a <C>ThemeProvider</C>, and drop components
        in. Every visual decision is a CSS variable, so five themes ship in the box — and every
        component page here has a live playground and copyable code.
      </p>
      <Demo
        center
        code={`import { ThemeProvider, GlassButton } from 'oblivion-ui';
import 'oblivion-ui/styles.css';

<ThemeProvider>
  <GlassButton variant="primary">Get started</GlassButton>
</ThemeProvider>`}
      >
        <GlassButton variant="primary">Get started</GlassButton>
        <GlassButton variant="secondary">Docs</GlassButton>
      </Demo>
    </Page>
  );
}

function ThemingPage() {
  return (
    <Page
      eyebrow="Getting started"
      title="Theming"
      lede="Five themes ship built in — distinct material languages, not recolours, driven entirely by CSS variables. The theme switch in the top bar reskins this whole site."
    >
      <Demo title="The five themes" desc="Each is a scoped set of token overrides." code={`<div data-ob-theme="futuristic">…</div>`}>
        {THEMES.map((t) => (
          <GlassBadge key={t.id} variant="neutral" mono>
            {t.label.toLowerCase()}
          </GlassBadge>
        ))}
      </Demo>

      <h2 className="docs__h2">Drive it from React</h2>
      <Demo
        code={`import { ThemeProvider, useTheme } from 'oblivion-ui';

const { theme, setTheme } = useTheme();
setTheme('futuristic');`}
      >
        <GlassBadge variant="accent" mono>
          ThemeProvider · useTheme · THEMES
        </GlassBadge>
      </Demo>
      <p className="docs__p" style={{ marginTop: 16 }}>
        <C>minimal</C> also ships a light mode — toggle <C>data-ob-mode="light"</C> (the switch in
        the top bar does this when Minimal is active).
      </p>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Layout
   ═══════════════════════════════════════════════════════════════════════ */

function SurfacePage() {
  return (
    <Page
      eyebrow="Layout"
      title="Surface"
      lede="The material primitive. Every other component is a GlassSurface plus layout — a flat translucent fill, backdrop blur, a hairline border and a brighter top edge."
    >
      <Demo title="Elevation" desc="flush · default · raised" code={`<GlassSurface elevation="raised" />`}>
        {(['flush', 'default', 'raised'] as const).map((e) => (
          <GlassSurface key={e} elevation={e} style={{ padding: 20, minWidth: 120, textAlign: 'center' }}>
            {e}
          </GlassSurface>
        ))}
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'elevation', label: 'elevation', options: ['flush', 'default', 'raised'], default: 'default' },
          { type: 'range', key: 'blur', label: 'blur', min: 0, max: 40, default: 22, unit: 'px' },
          { type: 'range', key: 'opacity', label: 'fill opacity', min: 0, max: 30, default: 6, unit: '%' },
          { type: 'range', key: 'height', label: 'height', min: 80, max: 220, default: 120, unit: 'px' },
          { type: 'toggle', key: 'interactive', label: 'interactive', default: true },
        ]}
        render={(v) => (
          <GlassSurface
            elevation={v.elevation as 'default'}
            interactive={Boolean(v.interactive)}
            style={
              {
                '--ob-glass-blur': `${v.blur}px`,
                '--ob-surface-fill': `rgb(var(--ob-white) / ${(v.opacity as number) / 100})`,
                height: `${v.height}px`,
                minWidth: 240,
                display: 'grid',
                placeItems: 'center',
                padding: '0 22px',
              } as CSSProperties
            }
          >
            glass surface
          </GlassSurface>
        )}
        code={(v) =>
          `<GlassSurface\n  elevation="${v.elevation}"${v.interactive ? '\n  interactive' : ''}\n  style={{\n    '--ob-glass-blur': '${v.blur}px',\n    '--ob-surface-fill': 'rgb(var(--ob-white) / ${(v.opacity as number) / 100})',\n    height: ${v.height},\n  }}\n/>`
        }
      />
    </Page>
  );
}

function PrimitivesPage() {
  return (
    <Page
      eyebrow="Layout"
      title="Primitives"
      lede="Polymorphic layout helpers — Box, Stack, Flex, Grid, Container, Separator — with spacing pulled from the token scale so you stop hand-writing gaps."
    >
      <Demo title="Stack + Separator" stack code={`<Stack gap={3}>\n  <Flex gap={2} wrap>…</Flex>\n  <Separator />\n</Stack>`}>
        <Stack gap={3}>
          <Flex gap={2} wrap>
            <GlassBadge>Flex</GlassBadge>
            <GlassBadge variant="neutral">gap = token</GlassBadge>
            <GlassBadge variant="outline">wrap</GlassBadge>
          </Flex>
          <Separator />
          <span className="docs-label">A Separator hairline sits between rows.</span>
        </Stack>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'columns', label: 'columns', min: 1, max: 6, default: 3 },
          { type: 'range', key: 'gap', label: 'gap (token)', min: 1, max: 7, default: 3 },
        ]}
        render={(v) => (
          <Box style={{ width: '100%' }}>
            <Grid columns={v.columns as number} gap={v.gap as 1 | 2 | 3}>
              {Array.from({ length: v.columns as number }).map((_, i) => (
                <GlassSurface key={i} style={{ padding: 16, textAlign: 'center', fontSize: 13 }}>
                  {i + 1}
                </GlassSurface>
              ))}
            </Grid>
          </Box>
        )}
        code={(v) => `<Grid columns={${v.columns}} gap={${v.gap}}>\n  …\n</Grid>`}
      />
    </Page>
  );
}

function CardPage() {
  return (
    <Page
      eyebrow="Layout"
      title="Card"
      lede="A panel with optional eyebrow, title, description, media, aside and footer slots. Compose the header from props, or drop in your own children."
    >
      <Demo center code={`<GlassCard title="Substrata" description="…" footer={<GlassButton />} />`}>
        <GlassCard
          eyebrow="EP · 174 BPM"
          title="Substrata"
          description="Deep liquid rollers with halftime switch-ups."
          aside={<GlassBadge variant="accent" size="sm" mono>new</GlassBadge>}
          footer={<GlassButton variant="primary" size="sm">Play</GlassButton>}
          dividedFooter
          style={{ maxWidth: 320 }}
        />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'elevation', label: 'elevation', options: ['flush', 'default', 'raised'], default: 'default' },
          { type: 'select', key: 'padding', label: 'padding', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
          { type: 'select', key: 'radius', label: 'radius', options: ['sm', 'md', 'lg', 'xl', '2xl'], default: 'xl' },
          { type: 'toggle', key: 'interactive', label: 'interactive', default: true },
        ]}
        render={(v) => (
          <GlassCard
            elevation={v.elevation as 'default'}
            padding={v.padding as 'md'}
            radius={v.radius as 'xl'}
            interactive={Boolean(v.interactive)}
            title="Substrata"
            description="Deep liquid rollers with halftime switch-ups."
            style={{ maxWidth: 320 }}
          />
        )}
        code={(v) =>
          `<GlassCard\n  elevation="${v.elevation}"\n  padding="${v.padding}"\n  radius="${v.radius}"${
            v.interactive ? '\n  interactive' : ''
          }\n  title="Substrata"\n  description="…"\n/>`
        }
      />
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Forms
   ═══════════════════════════════════════════════════════════════════════ */

function ButtonPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Button"
      lede="Five variants and three sizes, with loading and disabled states. Primary is the only filled surface in the system."
    >
      <Demo title="Variants" code={`<GlassButton variant="primary" />`}>
        <GlassButton variant="primary">Primary</GlassButton>
        <GlassButton variant="secondary">Secondary</GlassButton>
        <GlassButton variant="ghost">Ghost</GlassButton>
        <GlassButton variant="quiet">Quiet →</GlassButton>
        <GlassButton variant="icon" aria-label="Add">
          +
        </GlassButton>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'variant', label: 'variant', options: ['primary', 'secondary', 'ghost', 'quiet'], default: 'primary' },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
          { type: 'toggle', key: 'loading', label: 'loading', default: false },
          { type: 'toggle', key: 'disabled', label: 'disabled', default: false },
        ]}
        render={(v) => (
          <GlassButton
            variant={v.variant as 'primary'}
            size={v.size as 'md'}
            loading={Boolean(v.loading)}
            disabled={Boolean(v.disabled)}
          >
            Button
          </GlassButton>
        )}
        code={(v) =>
          `<GlassButton variant="${v.variant}" size="${v.size}"${v.loading ? ' loading' : ''}${
            v.disabled ? ' disabled' : ''
          }>\n  Button\n</GlassButton>`
        }
      />
    </Page>
  );
}

function InputPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Input"
      lede="Text fields with label, hint, error and affixes. GlassTextarea shares the same shell."
    >
      <Demo title="States" stack code={`<GlassInput label="Email" error="…" />`}>
        <GlassInput label="Email" placeholder="you@label.rec" type="email" />
        <GlassInput label="API key" mono readOnly value="grnt_••••" error="Key expired — rotate it." />
        <GlassTextarea label="Notes" placeholder="Session notes…" hint="Markdown supported." />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
          { type: 'toggle', key: 'mono', label: 'mono', default: false },
          { type: 'toggle', key: 'error', label: 'error', default: false },
          { type: 'toggle', key: 'disabled', label: 'disabled', default: false },
        ]}
        render={(v) => (
          <div style={{ width: '100%', maxWidth: 340 }}>
            <GlassInput
              label="Email"
              placeholder="you@label.rec"
              size={v.size as 'md'}
              mono={Boolean(v.mono)}
              disabled={Boolean(v.disabled)}
              error={v.error ? 'This field is required.' : undefined}
            />
          </div>
        )}
        code={(v) =>
          `<GlassInput\n  label="Email"\n  size="${v.size}"${v.mono ? '\n  mono' : ''}${
            v.disabled ? '\n  disabled' : ''
          }${v.error ? '\n  error="This field is required."' : ''}\n/>`
        }
      />
    </Page>
  );
}

function SelectPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Select"
      lede="A listbox-backed select over any array. Controlled, keyboard-driven, following the ARIA listbox pattern."
    >
      <Demo title="Single select" stack code={`<GlassSelect items={…} value={v} onChange={setV} />`}>
        <LiveSelect disabled={false} error={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'error', label: 'error', default: false },
          { type: 'toggle', key: 'disabled', label: 'disabled', default: false },
        ]}
        render={(v) => <LiveSelect disabled={Boolean(v.disabled)} error={Boolean(v.error)} />}
        code={(v) =>
          `<GlassSelect\n  items={genres}\n  value={value}\n  onChange={setValue}${
            v.disabled ? '\n  disabled' : ''
          }${v.error ? '\n  error="Pick a valid option."' : ''}\n/>`
        }
      />
    </Page>
  );
}

function CheckboxPage() {
  return (
    <Page eyebrow="Forms" title="Checkbox" lede="A checkbox with an inline label — the whole control is one hit target.">
      <Demo code={`<GlassCheckbox checked={v} onChange={setV}>Sidechain</GlassCheckbox>`}>
        <LiveCheckbox disabled={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'disabled', label: 'disabled', default: false }]}
        render={(v) => <LiveCheckbox disabled={Boolean(v.disabled)} />}
        code={(v) =>
          `<GlassCheckbox checked={v} onChange={setV}${v.disabled ? ' disabled' : ''}>\n  Sidechain\n</GlassCheckbox>`
        }
      />
    </Page>
  );
}

function RadioPage() {
  return (
    <Page eyebrow="Forms" title="Radio group" lede="A radio group over any array. One tab stop; arrow keys move the selection.">
      <Demo code={`<GlassRadioGroup items={…} value={v} onChange={setV} />`}>
        <LiveRadio column={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'column', label: 'column', default: false }]}
        render={(v) => <LiveRadio column={Boolean(v.column)} />}
        code={(v) => `<GlassRadioGroup items={…} value={v} onChange={setV}${v.column ? ' column' : ''} />`}
      />
    </Page>
  );
}

function SwitchPage() {
  return (
    <Page eyebrow="Forms" title="Switch" lede="A binary toggle rendered as role=switch, so assistive tech announces it correctly.">
      <Demo code={`<GlassSwitch checked={v} onChange={setV} aria-label="Filter" />`}>
        <LiveSwitch disabled={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'disabled', label: 'disabled', default: false }]}
        render={(v) => <LiveSwitch disabled={Boolean(v.disabled)} />}
        code={(v) => `<GlassSwitch checked={v} onChange={setV}${v.disabled ? ' disabled' : ''} aria-label="Filter" />`}
      />
    </Page>
  );
}

function SliderPage() {
  return (
    <Page eyebrow="Forms" title="Slider" lede="A draggable slider with the standard keyboard contract — arrows, Home/End, Page keys.">
      <Demo stack code={`<GlassSlider value={v} onChange={setV} label="Wet / dry" />`}>
        <LiveSlider showLabel />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'label', label: 'label', default: true }]}
        render={(v) => <LiveSlider showLabel={Boolean(v.label)} />}
        code={(v) => `<GlassSlider value={v} onChange={setV}${v.label ? ' label="Wet / dry"' : ''} />`}
      />
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Overlays
   ═══════════════════════════════════════════════════════════════════════ */

function MenuPage() {
  const { toast } = useToast();
  const items = [
    { key: 'play', label: 'Play', leading: '▶', onSelect: () => toast('Playing') },
    { key: 'queue', label: 'Add to queue', trailing: '⌘Q', onSelect: () => toast('Queued') },
    { key: 'sep', separator: true as const },
    { key: 'del', label: 'Delete', danger: true, onSelect: () => toast('Deleted', { tone: 'danger' }) },
  ];
  return (
    <Page
      eyebrow="Overlays"
      title="Dropdown menu"
      lede="A trigger plus a portalled, keyboard-navigable list of actions. Arrow keys rove, Enter selects, Escape and outside clicks dismiss, and focus returns to the trigger."
    >
      <Demo code={`<GlassMenu trigger={<GlassButton />} items={[…]} />`}>
        <GlassMenu label="Track actions" trigger={<GlassButton variant="secondary" size="sm">Actions ▾</GlassButton>} items={items} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'placement', label: 'placement', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'], default: 'bottom-start' },
        ]}
        render={(v) => (
          <GlassMenu
            label="Track actions"
            placement={v.placement as 'bottom-start'}
            trigger={<GlassButton variant="secondary" size="sm">Actions ▾</GlassButton>}
            items={items}
          />
        )}
        code={(v) => `<GlassMenu\n  placement="${v.placement}"\n  trigger={<GlassButton />}\n  items={[…]}\n/>`}
      />
    </Page>
  );
}

function ModalPage() {
  return (
    <Page
      eyebrow="Overlays"
      title="Modal"
      lede="A portalled dialog: focus trap, background scroll lock, Escape and scrim dismissal, and focus restored to the trigger on close."
    >
      <Demo code={`<GlassModal open={open} onClose={close} title="…" footer={…} />`}>
        <LiveModal size="md" />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'select', key: 'size', label: 'size', options: ['sm', 'md', 'lg'], default: 'md' }]}
        render={(v) => <LiveModal size={v.size as string} />}
        code={(v) => `<GlassModal size="${v.size}" open={open} onClose={close} title="…" />`}
      />
    </Page>
  );
}

function TooltipPage() {
  return (
    <Page eyebrow="Overlays" title="Tooltip" lede="A frosted tooltip that springs in on hover and keyboard focus.">
      <Demo center code={`<GlassTooltip content="…"><GlassButton /></GlassTooltip>`}>
        {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
          <GlassTooltip key={p} placement={p} content={`Placed ${p}`}>
            <GlassButton variant="secondary" size="sm">
              {p}
            </GlassButton>
          </GlassTooltip>
        ))}
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'select', key: 'placement', label: 'placement', options: ['top', 'bottom', 'left', 'right'], default: 'top' }]}
        render={(v) => (
          <GlassTooltip placement={v.placement as 'top'} content="Frosted tooltip">
            <GlassButton variant="secondary" size="sm">
              hover me
            </GlassButton>
          </GlassTooltip>
        )}
        code={(v) => `<GlassTooltip placement="${v.placement}" content="…">\n  <GlassButton />\n</GlassTooltip>`}
      />
    </Page>
  );
}

function ToastPage() {
  return (
    <Page eyebrow="Overlays" title="Toast" lede="Queued notifications that stack and self-dismiss. Three tones.">
      <Demo code={`const { toast } = useToast();\ntoast('Saved', { tone: 'accent' });`}>
        <LiveToast tone="accent" />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'select', key: 'tone', label: 'tone', options: ['accent', 'neutral', 'danger'], default: 'accent' }]}
        render={(v) => <LiveToast tone={v.tone as string} />}
        code={(v) => `toast('Notification fired', { tone: '${v.tone}' });`}
      />
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Navigation / Data / Feedback / Backdrop
   ═══════════════════════════════════════════════════════════════════════ */

function TabsPage() {
  return (
    <Page eyebrow="Navigation" title="Tabs" lede="A segmented control with a sliding pill, arrow-key navigation, and a controlled value.">
      <Demo stack code={`<GlassTabs items={tabs} value={tab} onChange={setTab} />`}>
        <LiveTabs block={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'block', label: 'block (fill width)', default: false }]}
        render={(v) => <LiveTabs block={Boolean(v.block)} />}
        code={(v) => `<GlassTabs items={tabs} value={tab} onChange={setTab}${v.block ? ' block' : ''} />`}
      />
    </Page>
  );
}

function TablePage() {
  const { toast } = useToast();
  return (
    <Page eyebrow="Data" title="Table" lede="Generic columns over any array, opt-in sorting, and a sticky header. The library never inspects your row shape.">
      <Demo stack code={`<GlassTable items={rows} columns={cols} />`}>
        <GlassTable
          items={ROWS}
          getKey={(r) => r.name}
          aria-label="Tracks"
          onRowClick={(r) => toast(`Opened ${r.name}`, { tone: 'neutral' })}
          columns={[
            { id: 'name', header: 'TRACK', sortBy: (r) => r.name, cell: (r) => r.name },
            { id: 'bpm', header: 'BPM', sortBy: (r) => r.bpm, cell: (r) => r.bpm },
            { id: 'key', header: 'KEY', cell: (r) => r.key },
            {
              id: 'status',
              header: 'STATUS',
              align: 'end',
              cell: (r) => (
                <GlassBadge size="sm" variant={STATUS_VARIANT[r.status]}>
                  {r.status}
                </GlassBadge>
              ),
            },
          ]}
        />
      </Demo>
    </Page>
  );
}

function ListPage() {
  return (
    <Page eyebrow="Data" title="List" lede="Renders any array as rows via accessors, or hand it a full renderItem. Supports empty and loading states.">
      <Demo stack code={`<GlassList items={people} primary={p => p.name} secondary={p => p.role} divided />`}>
        <ListDemo divided loading={false} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'divided', label: 'divided', default: true },
          { type: 'toggle', key: 'loading', label: 'loading', default: false },
        ]}
        render={(v) => <ListDemo divided={Boolean(v.divided)} loading={Boolean(v.loading)} />}
        code={(v) =>
          `<GlassList\n  items={people}\n  primary={p => p.name}\n  secondary={p => p.role}${
            v.divided ? '\n  divided' : ''
          }${v.loading ? '\n  loading' : ''}\n/>`
        }
      />
    </Page>
  );
}

function ListDemo({ divided, loading }: { divided: boolean; loading: boolean }) {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <GlassList
        items={loading ? [] : PEOPLE}
        getKey={(p) => p.id}
        loading={loading}
        leading={(p) => <GlassAvatar size="sm" name={p.name} />}
        primary={(p) => p.name}
        secondary={(p) => p.role}
        trailing={(p) => (
          <GlassBadge size="sm" variant="neutral">
            {p.status}
          </GlassBadge>
        )}
        divided={divided}
      />
    </div>
  );
}

function BadgePage() {
  return (
    <Page eyebrow="Feedback" title="Badge" lede="Compact status pills in five variants, with an optional pulsing dot.">
      <Demo code={`<GlassBadge variant="status" dot pulse>Live</GlassBadge>`}>
        <GlassBadge>Accent</GlassBadge>
        <GlassBadge variant="neutral">Neutral</GlassBadge>
        <GlassBadge variant="outline">Outline</GlassBadge>
        <GlassBadge variant="status" dot pulse>
          Live
        </GlassBadge>
        <GlassBadge variant="solid">Solid</GlassBadge>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'variant', label: 'variant', options: ['accent', 'neutral', 'outline', 'status', 'solid'], default: 'accent' },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md'], default: 'md' },
          { type: 'toggle', key: 'dot', label: 'dot', default: false },
          { type: 'toggle', key: 'pulse', label: 'pulse', default: false },
        ]}
        render={(v) => (
          <GlassBadge variant={v.variant as 'accent'} size={v.size as 'md'} dot={Boolean(v.dot)} pulse={Boolean(v.pulse)}>
            Badge
          </GlassBadge>
        )}
        code={(v) =>
          `<GlassBadge variant="${v.variant}" size="${v.size}"${v.dot ? ' dot' : ''}${
            v.pulse ? ' pulse' : ''
          }>Badge</GlassBadge>`
        }
      />
    </Page>
  );
}

function ProgressPage() {
  return (
    <Page eyebrow="Feedback" title="Progress" lede="Determinate and indeterminate bars. Omit value for the indeterminate case.">
      <Demo stack code={`<GlassProgress value={64} label="Rendering" />`}>
        <GlassProgress value={64} label="Rendering" aria-label="Rendering" />
        <GlassProgress label="Working" aria-label="Working" />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'value', label: 'value', min: 0, max: 100, default: 64, unit: '%' },
          { type: 'toggle', key: 'indeterminate', label: 'indeterminate', default: false },
        ]}
        render={(v) => (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <GlassProgress value={v.indeterminate ? undefined : (v.value as number)} label="Progress" aria-label="Progress" />
          </div>
        )}
        code={(v) => (v.indeterminate ? `<GlassProgress label="Working" />` : `<GlassProgress value={${v.value}} label="Progress" />`)}
      />
    </Page>
  );
}

function LoadingPage() {
  return (
    <Page eyebrow="Feedback" title="Spinner & skeleton" lede="Loading states — a ring spinner and shimmering placeholder blocks.">
      <Demo code={`<GlassSpinner size="lg" />`}>
        <GlassSpinner size="sm" />
        <GlassSpinner />
        <GlassSpinner size="lg" />
      </Demo>
      <Demo title="Skeleton" stack code={`<GlassSkeletonText lines={3} />`}>
        <div className="docs-row" style={{ gap: 14, alignItems: 'center' }}>
          <GlassSkeleton circle width={44} height={44} />
          <div style={{ flex: 1 }}>
            <GlassSkeletonText lines={3} />
          </div>
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'select', key: 'size', label: 'spinner size', options: ['sm', 'md', 'lg'], default: 'md' }]}
        render={(v) => <GlassSpinner size={v.size as 'md'} />}
        code={(v) => `<GlassSpinner size="${v.size}" />`}
      />
    </Page>
  );
}

function AvatarPage() {
  return (
    <Page eyebrow="Feedback" title="Avatar" lede="Image or initials, three sizes, with a group that collapses to +N.">
      <Demo code={`<GlassAvatar name="Dana Kade" />`}>
        <GlassAvatar size="sm" name="Dana Kade" />
        <GlassAvatar name="Rui Vale" neutral />
        <GlassAvatar size="lg" name="Ines Cole" />
        <GlassAvatarGroup max={2}>
          <GlassAvatar name="Dana Kade" />
          <GlassAvatar name="Rui Vale" />
          <GlassAvatar name="Ines Cole" />
          <GlassAvatar name="Theo Marsh" />
        </GlassAvatarGroup>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
          { type: 'toggle', key: 'neutral', label: 'neutral', default: false },
        ]}
        render={(v) => <GlassAvatar size={v.size as 'md'} neutral={Boolean(v.neutral)} name="Dana Kade" />}
        code={(v) => `<GlassAvatar size="${v.size}"${v.neutral ? ' neutral' : ''} name="Dana Kade" />`}
      />
    </Page>
  );
}

function OrbsPage() {
  return (
    <Page
      eyebrow="Backdrop"
      title="Orbs"
      lede="An ambient backdrop of drifting discs — the thing behind the glass that makes the blur worth having. Render one at the root of your app."
    >
      <PgHead />
      <Playground
        controls={[{ type: 'select', key: 'palette', label: 'palette', options: ['midnight', 'oxblood', 'charcoal'], default: 'oxblood' }]}
        render={(v) => (
          <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--ob-line)' }}>
            <Orbs palette={v.palette as 'oxblood'} />
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center', height: '100%' }}>
              <GlassSurface style={{ padding: '14px 22px' }}>glass over orbs</GlassSurface>
            </div>
          </div>
        )}
        code={(v) => `<Orbs palette="${v.palette}" />`}
      />
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Feedback / Disclosure: Alert & Accordion
   ═══════════════════════════════════════════════════════════════════════ */

function AlertPage() {
  const [show, setShow] = useState(true);
  return (
    <Page eyebrow="Feedback" title="Alert" lede="A banner for contextual messages, with a flat accent bar down the leading edge. Five tones, optional icon, optional dismiss.">
      <Demo stack code={`<GlassAlert tone="success" title="Saved">Your changes are live.</GlassAlert>`}>
        <GlassAlert tone="info" title="Heads up">The render farm is at 82% capacity.</GlassAlert>
        <GlassAlert tone="success" title="Bounced">Substrata.wav exported to /masters.</GlassAlert>
        <GlassAlert tone="warning" title="Clipping detected">Peaks exceed −0.1 dBFS on the master bus.</GlassAlert>
        <GlassAlert tone="danger" title="Render failed">Plugin “Valhalla” timed out.</GlassAlert>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'tone', label: 'tone', options: ['info', 'accent', 'success', 'warning', 'danger'], default: 'accent' },
          { type: 'toggle', key: 'closable', label: 'closable', default: true },
        ]}
        render={(v) =>
          show || !v.closable ? (
            <div style={{ width: '100%', maxWidth: 460 }}>
              <GlassAlert
                tone={v.tone as 'accent'}
                title="Notification"
                onClose={v.closable ? () => setShow(false) : undefined}
              >
                A contextual message on a glass surface.
              </GlassAlert>
            </div>
          ) : (
            <GlassButton size="sm" variant="ghost" onClick={() => setShow(true)}>
              Restore alert
            </GlassButton>
          )
        }
        code={(v) =>
          `<GlassAlert\n  tone="${v.tone}"\n  title="Notification"${v.closable ? '\n  onClose={dismiss}' : ''}\n>\n  A contextual message.\n</GlassAlert>`
        }
      />
    </Page>
  );
}

const FAQ = [
  { key: 'a', title: 'What is the glass made of?', content: 'A flat translucent fill, a backdrop blur, a hairline border and one brighter top edge. No gradients.' },
  { key: 'b', title: 'Can I theme it?', content: 'Every visual decision is a CSS variable. Nine themes ship in the box, and you can copy any of them from the top bar.' },
  { key: 'c', title: 'Does it need dependencies?', content: 'No runtime dependencies — just React. Positioning, focus traps and drag interactions are all hand-rolled.' },
];

function AccordionPage() {
  return (
    <Page eyebrow="Disclosure" title="Accordion" lede="A stack of collapsible panels. Single-open by default; pass multiple to let several stay open. Each header is a real button wired with aria-expanded.">
      <Demo stack code={`<GlassAccordion items={faq} />`}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <GlassAccordion items={FAQ} defaultValue={['a']} />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'multiple', label: 'multiple open', default: false }]}
        render={(v) => (
          <div style={{ width: '100%', maxWidth: 560 }}>
            <GlassAccordion items={FAQ} multiple={Boolean(v.multiple)} defaultValue={['a']} />
          </div>
        )}
        code={(v) => `<GlassAccordion items={faq}${v.multiple ? ' multiple' : ''} />`}
      />
    </Page>
  );
}

/* ── Data grid ───────────────────────────────────────────────────────── */

interface GridRow {
  id: string;
  track: string;
  bpm: number;
  key: string;
  status: string;
}
const GRID_SEED: GridRow[] = [
  { id: 'g1', track: 'Substrata (VIP)', bpm: 174, key: 'F min', status: 'Mastered' },
  { id: 'g2', track: 'Redline Pressure', bpm: 172, key: 'A min', status: 'Mixing' },
  { id: 'g3', track: 'Hollow Signal', bpm: 87, key: 'D min', status: 'Draft' },
  { id: 'g4', track: 'Blackwater Roll', bpm: 176, key: 'G min', status: 'Mastered' },
];

function DataGridPage() {
  const [rows, setRows] = useState<GridRow[]>(GRID_SEED);

  const edit = (row: GridRow, field: keyof GridRow, value: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, [field]: field === 'bpm' ? Number(value) || r.bpm : value }
          : r,
      ),
    );

  return (
    <Page
      eyebrow="Data"
      title="Data grid"
      lede="The feature-rich table. Click a header to sort, drag a header to reorder columns, drag the right edge to resize, and double-click a cell to edit it inline."
    >
      <Demo
        stack
        code={`<GlassDataGrid
  rows={rows}
  getKey={(r) => r.id}
  columns={[
    { id: 'track', header: 'Track', accessor: r => r.track,
      sortBy: r => r.track, onEdit: (r, v) => update(r, 'track', v) },
    { id: 'bpm', header: 'BPM', accessor: r => r.bpm,
      sortBy: r => r.bpm, align: 'end', onEdit: (r, v) => update(r, 'bpm', v) },
    // …
  ]}
/>`}
      >
        <div style={{ width: '100%' }}>
          <GlassDataGrid
            rows={rows}
            getKey={(r) => r.id}
            aria-label="Tracks"
            columns={[
              { id: 'track', header: 'Track', accessor: (r) => r.track, sortBy: (r) => r.track, width: 200, onEdit: (r, v) => edit(r, 'track', v) },
              { id: 'bpm', header: 'BPM', accessor: (r) => r.bpm, sortBy: (r) => r.bpm, align: 'end', width: 100, onEdit: (r, v) => edit(r, 'bpm', v) },
              { id: 'key', header: 'Key', accessor: (r) => r.key, sortBy: (r) => r.key, width: 120, onEdit: (r, v) => edit(r, 'key', v) },
              {
                id: 'status',
                header: 'Status',
                accessor: (r) => (
                  <GlassBadge size="sm" variant={r.status === 'Mastered' ? 'accent' : r.status === 'Draft' ? 'outline' : 'neutral'}>
                    {r.status}
                  </GlassBadge>
                ),
                sortBy: (r) => r.status,
                width: 150,
              },
            ]}
          />
        </div>
        <p className="docs-label" style={{ marginTop: 4 }}>
          Try it: drag “Track” past “BPM”, drag a column edge, or double-click a Track / BPM / Key cell.
        </p>
      </Demo>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   New components
   ═══════════════════════════════════════════════════════════════════════ */

function BreadcrumbPage() {
  const trail = [
    { label: 'Home', href: '#introduction' },
    { label: 'Components', href: '#introduction' },
    { label: 'Breadcrumb' },
  ];
  return (
    <Page eyebrow="Navigation" title="Breadcrumb" lede="A trail back up the hierarchy. The last crumb is the current page and never a link.">
      <Demo code={`<GlassBreadcrumb\n  items={[\n    { label: 'Home', href: '/' },\n    { label: 'Components', href: '/components' },\n    { label: 'Breadcrumb' },\n  ]}\n/>`}>
        <GlassBreadcrumb items={trail} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'separator', label: 'separator', options: ['/', '›', '·', '—'], default: '/' },
        ]}
        render={(v) => <GlassBreadcrumb items={trail} separator={String(v.separator)} />}
        code={(v) => `<GlassBreadcrumb items={trail} separator="${v.separator}" />`}
      />
    </Page>
  );
}

function PaginationPage() {
  const [page, setPage] = useState(4);
  return (
    <Page eyebrow="Navigation" title="Pagination" lede="Page through long data. Collapses to first · current ± siblings · last with ellipses.">
      <Demo code={`const [page, setPage] = useState(4);\n\n<GlassPagination page={page} count={12} onChange={setPage} />`}>
        <GlassPagination page={page} count={12} onChange={setPage} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'count', label: 'count', min: 3, max: 30, default: 12 },
          { type: 'range', key: 'siblings', label: 'siblings', min: 0, max: 3, default: 1 },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md'], default: 'sm' },
        ]}
        render={(v) => (
          <GlassPagination
            page={Math.min(page, Number(v.count))}
            count={Number(v.count)}
            siblings={Number(v.siblings)}
            size={v.size as 'sm'}
            onChange={setPage}
          />
        )}
        code={(v) => `<GlassPagination page={page} count={${v.count}} siblings={${v.siblings}} size="${v.size}" onChange={setPage} />`}
      />
    </Page>
  );
}

function SegmentedPage() {
  const items = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];
  return (
    <Page eyebrow="Forms" title="Segmented" lede="One choice from a small set, as connected pills. Controlled or uncontrolled.">
      <Demo code={`<GlassSegmented\n  defaultValue="week"\n  items={[\n    { value: 'day', label: 'Day' },\n    { value: 'week', label: 'Week' },\n    { value: 'month', label: 'Month' },\n  ]}\n/>`}>
        <GlassSegmented defaultValue="week" items={items} aria-label="Range" />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md'], default: 'md' },
          { type: 'toggle', key: 'fluid', label: 'fluid', default: false },
        ]}
        render={(v) => (
          <div style={{ width: v.fluid ? 320 : undefined }}>
            <GlassSegmented defaultValue="week" items={items} size={v.size as 'md'} fluid={Boolean(v.fluid)} aria-label="Range" />
          </div>
        )}
        code={(v) => `<GlassSegmented defaultValue="week" items={items} size="${v.size}"${v.fluid ? ' fluid' : ''} />`}
      />
    </Page>
  );
}

function RatingPage() {
  const [value, setValue] = useState(3);
  return (
    <Page eyebrow="Forms" title="Rating" lede="A star (or any glyph) rating with hover preview. Click the current star again to clear.">
      <Demo code={`const [value, setValue] = useState(3);\n\n<GlassRating value={value} onChange={setValue} />`}>
        <GlassRating value={value} onChange={setValue} />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'max', label: 'max', min: 3, max: 10, default: 5 },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
          { type: 'select', key: 'icon', label: 'icon', options: ['★', '●', '♥', '◆'], default: '★' },
          { type: 'toggle', key: 'readOnly', label: 'readOnly', default: false },
        ]}
        render={(v) => (
          <GlassRating
            value={value}
            onChange={setValue}
            max={Number(v.max)}
            size={v.size as 'md'}
            icon={String(v.icon)}
            readOnly={Boolean(v.readOnly)}
          />
        )}
        code={(v) => `<GlassRating value={value} onChange={setValue} max={${v.max}} size="${v.size}" icon="${v.icon}"${v.readOnly ? ' readOnly' : ''} />`}
      />
    </Page>
  );
}

function StatPage() {
  return (
    <Page eyebrow="Data" title="Stat" lede="A metric tile — label, big value, trend-coloured delta, optional icon and footnote.">
      <Demo code={`<GlassStat label="Revenue" value="$48.2k" delta="12.4%" trend="up" icon="$" footnote="vs last month" />`}>
        <Flex gap={4} wrap>
          <GlassStat label="Revenue" value="$48.2k" delta="12.4%" trend="up" icon="$" footnote="vs last month" />
          <GlassStat label="Churn" value="1.8%" delta="0.3%" trend="down" footnote="30-day" />
          <GlassStat label="Sessions" value="12,904" delta="0.0%" trend="flat" />
        </Flex>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'text', key: 'label', label: 'label', default: 'Revenue' },
          { type: 'text', key: 'value', label: 'value', default: '$48.2k' },
          { type: 'text', key: 'delta', label: 'delta', default: '12.4%' },
          { type: 'select', key: 'trend', label: 'trend', options: ['up', 'down', 'flat'], default: 'up' },
        ]}
        render={(v) => (
          <GlassStat label={String(v.label)} value={String(v.value)} delta={String(v.delta)} trend={v.trend as 'up'} />
        )}
        code={(v) => `<GlassStat label="${v.label}" value="${v.value}" delta="${v.delta}" trend="${v.trend}" />`}
      />
    </Page>
  );
}

function KbdPage() {
  return (
    <Page eyebrow="Feedback" title="Keyboard key" lede="A recessed key cap for shortcuts and hints. Compose several for a chord.">
      <Demo code={`Press <GlassKbd>⌘</GlassKbd> <GlassKbd>K</GlassKbd> to search.`}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ob-ink-2)' }}>
          Press <GlassKbd>⌘</GlassKbd> <GlassKbd>K</GlassKbd> to search
        </span>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'text', key: 'text', label: 'key', default: 'Esc' },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md'], default: 'md' },
        ]}
        render={(v) => <GlassKbd size={v.size as 'md'}>{String(v.text)}</GlassKbd>}
        code={(v) => `<GlassKbd size="${v.size}">${v.text}</GlassKbd>`}
      />
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Registry
   ═══════════════════════════════════════════════════════════════════════ */

export interface DocPage {
  id: string;
  label: string;
  group: string;
  render: () => ReactNode;
}

export const GROUPS = [
  'Getting started',
  'Layout',
  'Forms',
  'Overlays',
  'Navigation',
  'Data',
  'Feedback',
  'Disclosure',
  'Backdrop',
] as const;

export const PAGES: DocPage[] = [
  { id: 'introduction', label: 'Introduction', group: 'Getting started', render: () => <IntroPage /> },
  { id: 'theming', label: 'Theming', group: 'Getting started', render: () => <ThemingPage /> },

  { id: 'surface', label: 'Surface', group: 'Layout', render: () => <SurfacePage /> },
  { id: 'primitives', label: 'Primitives', group: 'Layout', render: () => <PrimitivesPage /> },
  { id: 'card', label: 'Card', group: 'Layout', render: () => <CardPage /> },

  { id: 'button', label: 'Button', group: 'Forms', render: () => <ButtonPage /> },
  { id: 'input', label: 'Input', group: 'Forms', render: () => <InputPage /> },
  { id: 'select', label: 'Select', group: 'Forms', render: () => <SelectPage /> },
  { id: 'checkbox', label: 'Checkbox', group: 'Forms', render: () => <CheckboxPage /> },
  { id: 'radio', label: 'Radio group', group: 'Forms', render: () => <RadioPage /> },
  { id: 'switch', label: 'Switch', group: 'Forms', render: () => <SwitchPage /> },
  { id: 'slider', label: 'Slider', group: 'Forms', render: () => <SliderPage /> },
  { id: 'segmented', label: 'Segmented', group: 'Forms', render: () => <SegmentedPage /> },
  { id: 'rating', label: 'Rating', group: 'Forms', render: () => <RatingPage /> },

  { id: 'menu', label: 'Dropdown menu', group: 'Overlays', render: () => <MenuPage /> },
  { id: 'modal', label: 'Modal', group: 'Overlays', render: () => <ModalPage /> },
  { id: 'tooltip', label: 'Tooltip', group: 'Overlays', render: () => <TooltipPage /> },
  { id: 'toast', label: 'Toast', group: 'Overlays', render: () => <ToastPage /> },

  { id: 'tabs', label: 'Tabs', group: 'Navigation', render: () => <TabsPage /> },
  { id: 'breadcrumb', label: 'Breadcrumb', group: 'Navigation', render: () => <BreadcrumbPage /> },
  { id: 'pagination', label: 'Pagination', group: 'Navigation', render: () => <PaginationPage /> },

  { id: 'datagrid', label: 'Data grid', group: 'Data', render: () => <DataGridPage /> },
  { id: 'table', label: 'Table', group: 'Data', render: () => <TablePage /> },
  { id: 'list', label: 'List', group: 'Data', render: () => <ListPage /> },
  { id: 'stat', label: 'Stat', group: 'Data', render: () => <StatPage /> },

  { id: 'alert', label: 'Alert', group: 'Feedback', render: () => <AlertPage /> },
  { id: 'badge', label: 'Badge', group: 'Feedback', render: () => <BadgePage /> },
  { id: 'progress', label: 'Progress', group: 'Feedback', render: () => <ProgressPage /> },
  { id: 'loading', label: 'Spinner & skeleton', group: 'Feedback', render: () => <LoadingPage /> },
  { id: 'avatar', label: 'Avatar', group: 'Feedback', render: () => <AvatarPage /> },
  { id: 'kbd', label: 'Keyboard key', group: 'Feedback', render: () => <KbdPage /> },

  { id: 'accordion', label: 'Accordion', group: 'Disclosure', render: () => <AccordionPage /> },

  { id: 'orbs', label: 'Orbs', group: 'Backdrop', render: () => <OrbsPage /> },
];
