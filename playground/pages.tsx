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
  GlassCallout,
  GlassColorPicker,
  GlassCommand,
  GlassDescriptionList,
  GlassDrawer,
  GlassEmptyState,
  GlassHoverCard,
  GlassMeter,
  GlassNavMenu,
  GlassPopover,
  GlassRangeSlider,
  GlassScrollArea,
  GlassSteps,
  GlassTimeline,
  GlassToggleGroup,
  GlassWindow,
  GlassMenuBar,
  GlassDock,
  GlassTerminal,
  GlassNotification,
  GlassContextMenu,
  GlassStatusBar,
  GlassDeviceFrame,
  GlassCodeBlock,
  GlassMiniPlayer,
  GlassChatBubble,
  GlassSpotlightCard,
  GlassTiltCard,
  GlassNumberTicker,
  GlassMarquee,
  GlassSpeedDial,
  GlassActivityRings,
  GlassGauge,
  GlassSparkline,
  GlassSplitPane,
  GlassAlertDialog,
  GlassTag,
  GlassEditable,
  GlassSidebar,
  GlassCarousel,
  GlassBarChart,
  GlassLineChart,
  Center,
  AspectRatio,
  ButtonGroup,
  Heading,
  Text,
  useDisclosure,
  useClipboard,
  GlassButton,
  GlassCalendar,
  GlassCard,
  GlassCheckbox,
  GlassCombobox,
  GlassDataGrid,
  GlassDatePicker,
  GlassField,
  GlassFileDrop,
  GlassInput,
  GlassKbd,
  GlassList,
  GlassMenu,
  GlassModal,
  GlassNumberInput,
  GlassPagination,
  GlassPinInput,
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
  GlassTagInput,
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
const LABELS = [
  'Critical Music',
  'Hospital Records',
  'Metalheadz',
  'Shogun Audio',
  'Blu Mar Ten',
  'Exit Records',
  'Vision Recordings',
  'Dispatch Recordings',
];
const TAG_POOL = ['halftime', 'rollers', 'amen', 'liquid', 'neuro', 'jungle', 'dub', 'minimal'];
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

function LiveCombobox({ disabled, error, clearable }: { disabled: boolean; error: boolean; clearable: boolean }) {
  const [val, setVal] = useState<string | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <GlassCombobox
        items={LABELS}
        getKey={(s) => s}
        value={val}
        onChange={(s) => setVal(s)}
        fieldLabel="Label"
        placeholder="Search labels…"
        clearable={clearable}
        disabled={disabled}
        error={error ? 'Pick a label from the list.' : undefined}
      />
    </div>
  );
}

function LiveTagInput({ suggest, max }: { suggest: boolean; max: boolean }) {
  const [tags, setTags] = useState<string[]>(['halftime', 'rollers']);
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <GlassTagInput
        value={tags}
        onChange={setTags}
        label="Tags"
        placeholder="Add a tag…"
        suggestions={suggest ? TAG_POOL : undefined}
        max={max ? 5 : undefined}
        hint="Enter or comma to commit. Backspace clears the last one."
      />
    </div>
  );
}

function LiveNumber({ suffix, hideSteppers }: { suffix: boolean; hideSteppers: boolean }) {
  const [bpm, setBpm] = useState<number | null>(174);
  return (
    <div style={{ width: '100%', maxWidth: 220 }}>
      <GlassNumberInput
        value={bpm}
        onChange={setBpm}
        label="Tempo"
        min={40}
        max={220}
        step={1}
        suffix={suffix ? 'bpm' : undefined}
        hideSteppers={hideSteppers}
      />
    </div>
  );
}

function LivePin({ length, mask, type }: { length: number; mask: boolean; type: string }) {
  const [code, setCode] = useState('');
  const { toast } = useToast();
  return (
    <GlassPinInput
      value={code}
      onChange={setCode}
      onComplete={(v) => toast(`Code ${v} submitted`)}
      length={length}
      mask={mask}
      type={type as 'numeric'}
      label="Verification code"
      hint="Paste the whole code — it spreads across the cells."
    />
  );
}

function LiveFileDrop({ multiple }: { multiple: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <GlassFileDrop
        value={files}
        onChange={setFiles}
        label="Stems"
        accept="audio/*,.wav,.aiff"
        multiple={multiple}
        maxSize={25 * 1024 * 1024}
        maxFiles={multiple ? 4 : 1}
      />
    </div>
  );
}

function LiveDatePicker({ clearable, bounded }: { clearable: boolean; bounded: boolean }) {
  const [date, setDate] = useState<Date | null>(null);
  const today = new Date();
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <GlassDatePicker
        value={date}
        onChange={setDate}
        fieldLabel="Release date"
        clearable={clearable}
        min={bounded ? today : undefined}
        max={bounded ? new Date(today.getFullYear(), today.getMonth() + 3, 0) : undefined}
        hint={bounded ? 'Limited to the next three months.' : undefined}
      />
    </div>
  );
}

function LiveCalendar({ weekStartsOn, showToday }: { weekStartsOn: number; showToday: boolean }) {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <GlassCalendar
      value={date}
      onChange={setDate}
      weekStartsOn={weekStartsOn as 0 | 1}
      showToday={showToday}
      aria-label="Session date"
    />
  );
}

/* ── Customization demos (the render props and format hooks) ──────────── */

function CustomCombobox() {
  const [id, setId] = useState<string | null>('p2');
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <GlassCombobox
        items={PEOPLE}
        getKey={(p) => p.id}
        toText={(p) => p.name}
        value={id}
        onChange={(p) => setId(p?.id ?? null)}
        fieldLabel="Engineer"
        placeholder="Search the roster…"
        renderOption={({ item, selected }) => (
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <GlassAvatar name={item.name} size="sm" />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block' }}>{item.name}</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--ob-ink-3)' }}>
                {item.role}
              </span>
            </span>
            {selected ? <span aria-hidden="true">●</span> : null}
          </span>
        )}
        footer={`${PEOPLE.length} people on the roster`}
      />
    </div>
  );
}

function CustomTagInput() {
  const [tags, setTags] = useState<string[]>(['halftime', 'neuro']);
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <GlassTagInput
        value={tags}
        onChange={setTags}
        label="Tags"
        suggestions={TAG_POOL}
        renderTag={({ tag, remove }) => (
          <>
            <span style={{ fontFamily: 'var(--ob-font-mono)', fontSize: 11 }}>#{tag}</span>
            <button
              type="button"
              tabIndex={-1}
              className="ob-tags__x ob-reset-button"
              aria-label={`Remove ${tag}`}
              onClick={remove}
            >
              −
            </button>
          </>
        )}
      />
    </div>
  );
}

const MONEY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function CustomNumber() {
  const [price, setPrice] = useState<number | null>(1250);
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <GlassNumberInput
        value={price}
        onChange={setPrice}
        label="Licence fee"
        min={0}
        step={50}
        format={(n) => MONEY.format(n)}
        icons={{ up: '▲', down: '▼' }}
        hint="Formatted when idle, raw while you type."
      />
    </div>
  );
}

function CustomPin() {
  const [hex, setHex] = useState('');
  return (
    <GlassPinInput
      value={hex}
      onChange={setHex}
      length={6}
      allow={/[0-9a-f]/i}
      placeholder="·"
      separator={(i) => (i === 2 ? '—' : null)}
      label="Colour code"
      hint="Hex only, via allow={/[0-9a-f]/i}."
    />
  );
}

function CustomFileDrop() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <GlassFileDrop
        value={files}
        onChange={setFiles}
        label="Stems"
        multiple
        icons={{ upload: '♫' }}
        prompt={
          <>
            <strong>Drop stems</strong> or click to browse
          </>
        }
        renderFile={({ file, remove, formatSize }) => (
          <>
            <span
              style={{
                fontFamily: 'var(--ob-font-mono)',
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgb(var(--ob-white) / 0.08)',
              }}
            >
              {(file.name.split('.').pop() ?? '?').toUpperCase()}
            </span>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </span>
            <span style={{ color: 'var(--ob-ink-3)', fontSize: 12 }}>{formatSize(file.size)}</span>
            <button type="button" className="ob-drop__x ob-reset-button" onClick={remove}>
              ✕
            </button>
          </>
        )}
      />
    </div>
  );
}

/** A stand-in booking rate, so the calendar has something to render per day. */
const rateFor = (date: Date) => 60 + ((date.getDate() * 7) % 5) * 15;

function CustomCalendar() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <GlassCalendar
      value={date}
      onChange={setDate}
      showToday={false}
      isDisabled={(d) => d.getDay() === 0}
      renderDay={({ date: d, disabled }) => (
        <span style={{ display: 'grid', justifyItems: 'center', gap: 1, lineHeight: 1.1 }}>
          <span>{d.getDate()}</span>
          <span style={{ fontFamily: 'var(--ob-font-mono)', fontSize: 8, opacity: 0.7 }}>
            {disabled ? '—' : `£${rateFor(d)}`}
          </span>
        </span>
      )}
      aria-label="Studio availability"
    />
  );
}

function CustomDatePicker() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: '100%', maxWidth: 300, display: 'grid', gap: 10 }}>
      <GlassDatePicker
        value={date}
        onChange={setDate}
        open={open}
        onOpenChange={setOpen}
        fieldLabel="Session"
        weekdayFormat="narrow"
        showOutsideDays={false}
        format={(d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
        renderTrigger={({ text, placeholder, open: isOpen }) => (
          <>
            <span className="ob-date__glyph" aria-hidden="true">
              {isOpen ? '▨' : '▦'}
            </span>
            <span className={text ? 'ob-date__value' : 'ob-date__value ob-date__value--placeholder'}>
              {text ?? placeholder}
            </span>
            <GlassKbd>{isOpen ? 'Esc' : '↓'}</GlassKbd>
          </>
        )}
      />
      <GlassButton size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : 'Open'} from outside
      </GlassButton>
    </div>
  );
}

function CustomField() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <GlassField
        label="Render on save"
        orientation="horizontal"
        hint="Bounces a preview every time the project is saved."
      >
        {({ id, describedBy }) => (
          <GlassSwitch
            id={id}
            aria-describedby={describedBy}
            checked={on}
            onChange={setOn}
          />
        )}
      </GlassField>
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
        in. Every visual decision is a CSS variable, so nine themes ship in the box — and every
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
      <Demo title="The nine themes" desc="Each is a scoped set of token overrides." code={`<div data-ob-theme="futuristic">…</div>`}>
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

function ComboboxPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Combobox"
      lede="A select you can type into. Filters as you go, follows the ARIA combobox pattern, and never leaves the field showing something that was not actually chosen."
    >
      <Demo title="Searchable select" stack code={`<GlassCombobox items={labels} value={v} onChange={setV} />`}>
        <LiveCombobox disabled={false} error={false} clearable />
      </Demo>

      <p className="docs__p">
        The query is transient: Escape or clicking away restores the selected item&rsquo;s text.
        Pass <C>filter={'{false}'}</C> when the caller already filters — remote search — and{' '}
        <C>items</C> is rendered verbatim, with <C>loading</C> covering the round trip.
      </p>

      <Demo
        title="Custom options"
        stack
        code={`<GlassCombobox
  items={people}
  getKey={(p) => p.id}
  toText={(p) => p.name}
  renderOption={({ item, selected }) => (
    <>
      <GlassAvatar name={item.name} size="sm" />
      <span>{item.name}<small>{item.role}</small></span>
      {selected ? <span>●</span> : null}
    </>
  )}
  footer={\`\${people.length} people on the roster\`}
/>`}
      >
        <CustomCombobox />
      </Demo>

      <p className="docs__p">
        <C>renderOption</C> replaces a row&rsquo;s interior and leaves the listbox semantics alone —
        the <C>role</C>, the highlight and <C>aria-activedescendant</C> are still the
        component&rsquo;s job. It is handed <C>selected</C>, <C>active</C> and <C>disabled</C> so
        your markup can follow the keyboard. <C>footer</C> pins content below the scroll area,
        which is where an &ldquo;Add new&rdquo; action belongs.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'clearable', label: 'clearable', default: true },
          { type: 'toggle', key: 'error', label: 'error', default: false },
          { type: 'toggle', key: 'disabled', label: 'disabled', default: false },
        ]}
        render={(v) => (
          <LiveCombobox
            clearable={Boolean(v.clearable)}
            disabled={Boolean(v.disabled)}
            error={Boolean(v.error)}
          />
        )}
        code={(v) =>
          `<GlassCombobox\n  items={labels}\n  getKey={(s) => s}\n  value={value}\n  onChange={setValue}${
            v.clearable ? '' : '\n  clearable={false}'
          }${v.disabled ? '\n  disabled' : ''}${
            v.error ? '\n  error="Pick a label from the list."' : ''
          }\n/>`
        }
      />
    </Page>
  );
}

function TagInputPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Tag input"
      lede="A chip field. Free-form on its own; pass suggestions and it becomes a multi-select."
    >
      <Demo title="Chips" stack code={`<GlassTagInput value={tags} onChange={setTags} />`}>
        <LiveTagInput suggest max={false} />
      </Demo>

      <p className="docs__p">
        Enter or a delimiter commits the draft, Backspace on an empty draft removes the last chip.
        Rejections from <C>validate</C>, <C>max</C> and the duplicate check surface inline, so the
        field explains itself without the caller wiring up error state.
      </p>

      <Demo
        title="Custom chips"
        stack
        code={`<GlassTagInput
  value={tags}
  onChange={setTags}
  renderTag={({ tag, remove }) => (
    <>
      <span className="mono">#{tag}</span>
      <button onClick={remove}>−</button>
    </>
  )}
/>`}
      >
        <CustomTagInput />
      </Demo>

      <p className="docs__p">
        <C>renderTag</C> owns the inside of a chip and is handed <C>remove</C> already wired to
        refocus the draft input. Pasting <C>a, b, c</C> splits on your <C>delimiters</C> and adds
        each piece — turn that off with <C>splitPaste={'{false}'}</C>.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'suggest', label: 'suggestions', default: true },
          { type: 'toggle', key: 'max', label: 'max={5}', default: false },
        ]}
        render={(v) => <LiveTagInput suggest={Boolean(v.suggest)} max={Boolean(v.max)} />}
        code={(v) =>
          `<GlassTagInput\n  value={tags}\n  onChange={setTags}\n  label="Tags"${
            v.suggest ? '\n  suggestions={TAG_POOL}' : ''
          }${v.max ? '\n  max={5}' : ''}\n/>`
        }
      />
    </Page>
  );
}

function NumberInputPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Number input"
      lede="A numeric field with steppers, range clamping and the full keyboard contract — arrows step, Page keys step ten, Home and End jump to the bounds."
    >
      <Demo title="Tempo" stack code={`<GlassNumberInput value={bpm} onChange={setBpm} min={40} max={220} />`}>
        <LiveNumber suffix hideSteppers={false} />
      </Demo>

      <p className="docs__p">
        Press and hold a stepper to repeat. Typing is left unclamped until blur so half-written
        values like <C>-</C> and <C>1.</C> stay editable; the steppers and arrow keys always clamp.
      </p>

      <Demo
        title="Currency"
        stack
        code={`const money = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD',
});

<GlassNumberInput
  value={price}
  onChange={setPrice}
  min={0}
  step={50}
  format={(n) => money.format(n)}
  icons={{ up: '▲', down: '▼' }}
/>`}
      >
        <CustomNumber />
      </Demo>

      <p className="docs__p">
        <C>format</C> only applies while the field is idle — focus it and the raw number comes
        back, because formatting fights the caret the moment a separator moves. On blur the text is
        read back by <C>parse</C>, which defaults to stripping everything that is not a digit,
        sign, dot or exponent, so <C>$1,250.00</C> round-trips without your writing a parser.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'suffix', label: 'suffix', default: true },
          { type: 'toggle', key: 'hideSteppers', label: 'hideSteppers', default: false },
        ]}
        render={(v) => (
          <LiveNumber suffix={Boolean(v.suffix)} hideSteppers={Boolean(v.hideSteppers)} />
        )}
        code={(v) =>
          `<GlassNumberInput\n  value={bpm}\n  onChange={setBpm}\n  min={40}\n  max={220}${
            v.suffix ? '\n  suffix="bpm"' : ''
          }${v.hideSteppers ? '\n  hideSteppers' : ''}\n/>`
        }
      />
    </Page>
  );
}

function PinInputPage() {
  return (
    <Page
      eyebrow="Forms"
      title="PIN input"
      lede="A segmented code field for one-time codes and PINs. Typing advances, Backspace steps back, and a paste of any length spreads across the cells."
    >
      <Demo title="Six digits" stack code={`<GlassPinInput value={code} onChange={setCode} onComplete={submit} />`}>
        <LivePin length={6} mask={false} type="numeric" />
      </Demo>

      <p className="docs__p">
        Characters that do not match <C>type</C> are dropped on the way in, so pasting{' '}
        <C>123-456</C> still lands as <C>123456</C>. The first cell carries{' '}
        <C>autocomplete=&quot;one-time-code&quot;</C>, which is what lets iOS and Android offer the
        SMS code straight from the keyboard.
      </p>

      <Demo
        title="A hex field"
        stack
        code={`<GlassPinInput
  value={hex}
  onChange={setHex}
  allow={/[0-9a-f]/i}
  placeholder="·"
  separator={(i) => (i === 2 ? '—' : null)}
/>`}
      >
        <CustomPin />
      </Demo>

      <p className="docs__p">
        <C>allow</C> takes over from <C>type</C> and is tested one character at a time, so any
        alphabet you can write a character class for works — and it governs pasting as much as
        typing. <C>separator</C> takes a node for every gap, or a function of the cell index to its
        left so you can place just the one.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'length', label: 'length', min: 4, max: 8, default: 6 },
          { type: 'select', key: 'type', label: 'type', options: ['numeric', 'alphanumeric'], default: 'numeric' },
          { type: 'toggle', key: 'mask', label: 'mask', default: false },
        ]}
        render={(v) => (
          <LivePin length={Number(v.length)} mask={Boolean(v.mask)} type={String(v.type)} />
        )}
        code={(v) =>
          `<GlassPinInput\n  value={code}\n  onChange={setCode}\n  onComplete={submit}\n  length={${v.length}}${
            v.type === 'alphanumeric' ? '\n  type="alphanumeric"' : ''
          }${v.mask ? '\n  mask' : ''}\n/>`
        }
      />
    </Page>
  );
}

function FileDropPage() {
  return (
    <Page
      eyebrow="Forms"
      title="File drop"
      lede="A drop target and file list in one field. Click or press Enter to browse, or drag files onto it."
    >
      <Demo title="Stems" stack code={`<GlassFileDrop value={files} onChange={setFiles} accept="audio/*" multiple />`}>
        <LiveFileDrop multiple />
      </Demo>

      <p className="docs__p">
        <C>accept</C>, <C>maxSize</C> and <C>maxFiles</C> are enforced on dropped files too — the
        browser only applies <C>accept</C> to the picker dialog, so dropping is otherwise a hole.
        Refusals explain themselves under the field and also fire <C>onReject</C>.
      </p>

      <Demo
        title="Custom rows"
        stack
        code={`<GlassFileDrop
  value={files}
  onChange={setFiles}
  multiple
  icons={{ upload: '♫' }}
  renderFile={({ file, remove, formatSize }) => (
    <>
      <span className="ext">{ext(file.name)}</span>
      <span className="name">{file.name}</span>
      <span>{formatSize(file.size)}</span>
      <button onClick={remove}>✕</button>
    </>
  )}
/>`}
      >
        <CustomFileDrop />
      </Demo>

      <p className="docs__p">
        <C>renderFile</C> is handed the <C>File</C>, a wired <C>remove</C>, and the active{' '}
        <C>formatSize</C> so custom rows stay consistent with the terms line above them. It is the
        hook for thumbnails and upload progress; swap <C>formatSize</C> alone if all you want is
        different units.
      </p>

      <PgHead />
      <Playground
        controls={[{ type: 'toggle', key: 'multiple', label: 'multiple', default: true }]}
        render={(v) => <LiveFileDrop multiple={Boolean(v.multiple)} />}
        code={(v) =>
          `<GlassFileDrop\n  value={files}\n  onChange={setFiles}\n  accept="audio/*,.wav"\n  maxSize={25 * 1024 * 1024}${
            v.multiple ? '\n  multiple' : ''
          }\n/>`
        }
      />
    </Page>
  );
}

function DatePickerPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Date picker"
      lede="A trigger that reads as an input well, with a portalled calendar anchored under it. Focus moves into the grid on open and returns to the trigger on close."
    >
      <Demo title="Release date" stack code={`<GlassDatePicker value={date} onChange={setDate} />`}>
        <LiveDatePicker clearable bounded={false} />
      </Demo>

      <p className="docs__p">
        Everything reasons in local calendar fields rather than UTC timestamps, so the day you
        click is the day you get. Pass <C>name</C> to emit <C>YYYY-MM-DD</C> into a plain form post.
      </p>

      <Demo
        title="Custom trigger, controlled open"
        stack
        code={`<GlassDatePicker
  value={date}
  onChange={setDate}
  open={open}
  onOpenChange={setOpen}
  weekdayFormat="narrow"
  showOutsideDays={false}
  renderTrigger={({ text, placeholder, open }) => (
    <>
      <span>{open ? '▨' : '▦'}</span>
      <span>{text ?? placeholder}</span>
      <GlassKbd>{open ? 'Esc' : '↓'}</GlassKbd>
    </>
  )}
/>`}
      >
        <CustomDatePicker />
      </Demo>

      <p className="docs__p">
        <C>renderTrigger</C> replaces what is inside the button, not the button itself, so the
        focus handling and <C>aria-expanded</C> survive whatever you put there. Pass <C>open</C>{' '}
        with <C>onOpenChange</C> to drive the popover from outside; omit both and the picker owns
        it. Every calendar prop — <C>renderDay</C>, <C>formatMonth</C>, <C>weekdayFormat</C>,{' '}
        <C>header</C> — passes straight through to the grid inside.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'clearable', label: 'clearable', default: true },
          { type: 'toggle', key: 'bounded', label: 'min / max', default: false },
        ]}
        render={(v) => (
          <LiveDatePicker clearable={Boolean(v.clearable)} bounded={Boolean(v.bounded)} />
        )}
        code={(v) =>
          `<GlassDatePicker\n  value={date}\n  onChange={setDate}\n  fieldLabel="Release date"${
            v.clearable ? '' : '\n  clearable={false}'
          }${v.bounded ? '\n  min={today}\n  max={inThreeMonths}' : ''}\n/>`
        }
      />
    </Page>
  );
}

function CalendarPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Calendar"
      lede="The month grid on its own, for when you want it inline rather than in a popover."
    >
      <Demo center code={`<GlassCalendar value={date} onChange={setDate} />`}>
        <LiveCalendar weekStartsOn={1} showToday />
      </Demo>

      <p className="docs__p">
        A roving tabindex makes the grid one tab stop: arrows move a day, Home and End reach the
        ends of the week, Page keys change month, Shift+Page changes year. Arrowing off the edge
        pages the calendar, so the visible month always follows the focused day.
      </p>

      <Demo
        center
        title="Booking grid"
        code={`<GlassCalendar
  value={date}
  onChange={setDate}
  isDisabled={(d) => d.getDay() === 0}
  renderDay={({ date, disabled }) => (
    <span className="stack">
      <span>{date.getDate()}</span>
      <small>{disabled ? '—' : \`£\${rateFor(date)}\`}</small>
    </span>
  )}
/>`}
      >
        <CustomCalendar />
      </Demo>

      <p className="docs__p">
        <C>renderDay</C> fills the cell and is handed <C>selected</C>, <C>today</C>, <C>outside</C>{' '}
        and <C>disabled</C>, so the state stays the grid&rsquo;s to track. For a tweak rather than a
        takeover there is <C>dayClassName</C>, and <C>header</C> swaps the caption and arrows for
        month and year dropdowns without touching the grid below.
      </p>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'weekStartsOn', label: 'weekStartsOn', options: ['0', '1'], default: '1' },
          { type: 'toggle', key: 'showToday', label: 'showToday', default: true },
        ]}
        render={(v) => (
          <LiveCalendar weekStartsOn={Number(v.weekStartsOn)} showToday={Boolean(v.showToday)} />
        )}
        code={(v) =>
          `<GlassCalendar\n  value={date}\n  onChange={setDate}\n  weekStartsOn={${v.weekStartsOn}}${
            v.showToday ? '' : '\n  showToday={false}'
          }\n/>`
        }
      />
    </Page>
  );
}

function FieldPage() {
  return (
    <Page
      eyebrow="Forms"
      title="Field"
      lede="The label, hint, error and a11y wiring every field in the kit wears — exposed so your own controls can wear it too."
    >
      <Demo title="Wrapping a native control" stack code={`<GlassField label="Webhook" hint="…">
  {({ id, describedBy }) => (
    <input id={id} aria-describedby={describedBy} />
  )}
</GlassField>`}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <GlassField label="Render quality" hint="Higher settings take longer to bounce.">
            {({ id, describedBy }) => (
              <div className="ob-input">
                <select id={id} aria-describedby={describedBy} className="ob-input__control">
                  <option>Draft</option>
                  <option>Standard</option>
                  <option>Mastering</option>
                </select>
              </div>
            )}
          </GlassField>
        </div>
      </Demo>

      <p className="docs__p">
        Children can be a plain node or a function receiving <C>id</C>, <C>describedBy</C> and{' '}
        <C>invalid</C>. The ids are generated once and stay stable across renders, and{' '}
        <C>describedBy</C> points at the error when there is one and the hint otherwise — a screen
        reader should hear the failure, not the advice.
      </p>

      <Demo
        title="Horizontal"
        stack
        code={`<GlassField label="Render on save" orientation="horizontal" hint="…">
  {({ id, describedBy }) => (
    <GlassSwitch id={id} aria-describedby={describedBy} … />
  )}
</GlassField>`}
      >
        <CustomField />
      </Demo>

      <p className="docs__p">
        <C>orientation=&quot;horizontal&quot;</C> puts the label in a column beside the control and
        keeps the note lined up under the control rather than the label. Size that column with the{' '}
        <C>--ob-field-label-w</C> custom property. Every field in the kit takes this prop, because
        they all wear this shell.
      </p>

      <Demo title="Invalid" stack code={`<GlassField label="Webhook" error="Must be https." />`}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <GlassField label="Webhook" error="Must be an https:// URL." required>
            {({ id, describedBy, invalid }) => (
              <div className={invalid ? 'ob-input ob-input--invalid' : 'ob-input'}>
                <input
                  id={id}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  className="ob-input__control"
                  defaultValue="http://hooks.label.rec/bounce"
                />
              </div>
            )}
          </GlassField>
        </div>
      </Demo>
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
   Overlays, navigation, feedback, forms — the expansion batch
   ═══════════════════════════════════════════════════════════════════════ */

function PopoverPage() {
  return (
    <Page eyebrow="Overlays" title="Popover" lede="A click-triggered floating panel for rich content — positioned, flipped, and dismissed for you.">
      <Demo center code={`<GlassPopover trigger={<GlassButton>Open</GlassButton>}>\n  <strong>Filters</strong>\n  <p>Any content — forms, detail cards, actions.</p>\n</GlassPopover>`}>
        <GlassPopover
          placement="bottom"
          trigger={<GlassButton variant="secondary">Open popover</GlassButton>}
        >
          <strong style={{ display: 'block', marginBottom: 6, color: 'var(--ob-ink-strong)' }}>Filters</strong>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ob-ink-2)' }}>
            Any content fits here — forms, detail cards, quick actions.
          </p>
        </GlassPopover>
      </Demo>
    </Page>
  );
}

function HoverCardPage() {
  return (
    <Page eyebrow="Overlays" title="Hover card" lede="A preview card that opens on hover or focus and stays put while you're over it.">
      <Demo center code={`<GlassHoverCard trigger={<a href="#">@dana</a>}>\n  <ProfilePreview />\n</GlassHoverCard>`}>
        <span style={{ color: 'var(--ob-ink-2)' }}>
          Follows{' '}
          <GlassHoverCard
            placement="top"
            trigger={<a href="#hovercard" style={{ color: 'rgb(var(--ob-accent-hot))' }}>@dana</a>}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <GlassAvatar name="Dana Kade" />
              <div>
                <strong style={{ color: 'var(--ob-ink-strong)' }}>Dana Kade</strong>
                <div style={{ fontSize: 12, color: 'var(--ob-ink-3)' }}>Sound design · 2.1k followers</div>
              </div>
            </div>
          </GlassHoverCard>
        </span>
      </Demo>
    </Page>
  );
}

function LiveDrawer() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['left', 'right', 'top', 'bottom'] as const).map((sd) => (
        <GlassButton key={sd} variant="secondary" size="sm" onClick={() => { setSide(sd); setOpen(true); }}>
          {sd}
        </GlassButton>
      ))}
      <GlassDrawer open={open} onClose={() => setOpen(false)} side={side} title="Panel"
        footer={<GlassButton variant="primary" size="sm" onClick={() => setOpen(false)}>Done</GlassButton>}>
        <p style={{ marginTop: 0 }}>A slide-in sheet from the {side}. Focus is trapped and scroll is locked.</p>
      </GlassDrawer>
    </div>
  );
}

function DrawerPage() {
  return (
    <Page eyebrow="Overlays" title="Drawer" lede="A sheet that slides in from any edge, on the modal overlay plate. Focus-trapped, scroll-locked, Escape-dismissible.">
      <Demo center code={`const [open, setOpen] = useState(false);\n\n<GlassDrawer open={open} onClose={() => setOpen(false)} side="right" title="Panel">\n  …\n</GlassDrawer>`}>
        <LiveDrawer />
      </Demo>
    </Page>
  );
}

function LiveCommand() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const items = [
    { id: 'new', label: 'New track', hint: '⌘N', icon: '✚', onSelect: () => toast('New track') },
    { id: 'import', label: 'Import audio', icon: '↧', onSelect: () => toast('Import audio') },
    { id: 'export', label: 'Export master', icon: '↥', onSelect: () => toast('Export master') },
    { id: 'settings', label: 'Open settings', hint: '⌘,', icon: '⚙', onSelect: () => toast('Open settings') },
    { id: 'theme', label: 'Toggle theme', icon: '◐', onSelect: () => toast('Toggle theme') },
  ];
  return (
    <>
      <GlassButton variant="secondary" onClick={() => setOpen(true)}>
        Open palette <GlassKbd size="sm">⌘K</GlassKbd>
      </GlassButton>
      <GlassCommand open={open} onClose={() => setOpen(false)} items={items} />
    </>
  );
}

function CommandPage() {
  return (
    <Page eyebrow="Overlays" title="Command palette" lede="A ⌘K-style filterable, keyboard-driven action list. Arrows move, Enter selects, Escape closes.">
      <Demo center code={`<GlassCommand open={open} onClose={close} items={[\n  { id: 'new', label: 'New track', hint: '⌘N', onSelect: create },\n]} />`}>
        <LiveCommand />
      </Demo>
    </Page>
  );
}

function StepsPage() {
  const steps = [
    { label: 'Upload', description: 'Add your stems' },
    { label: 'Arrange', description: 'Build the timeline' },
    { label: 'Master', description: 'Polish & export' },
  ];
  return (
    <Page eyebrow="Navigation" title="Steps" lede="A progress stepper with complete / active / upcoming states. Horizontal or vertical.">
      <Demo code={`<GlassSteps current={1} steps={[\n  { label: 'Upload' }, { label: 'Arrange' }, { label: 'Master' },\n]} />`}>
        <div style={{ width: '100%' }}>
          <GlassSteps current={1} steps={steps} />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'current', label: 'current', min: 0, max: 2, default: 1 },
          { type: 'select', key: 'orientation', label: 'orientation', options: ['horizontal', 'vertical'], default: 'horizontal' },
        ]}
        render={(v) => (
          <div style={{ width: v.orientation === 'vertical' ? 240 : '100%' }}>
            <GlassSteps current={Number(v.current)} orientation={v.orientation as 'horizontal'} steps={steps} />
          </div>
        )}
        code={(v) => `<GlassSteps current={${v.current}} orientation="${v.orientation}" steps={steps} />`}
      />
    </Page>
  );
}

function TimelinePage() {
  const items = [
    { title: 'Session created', time: '09:12', tone: 'accent' as const, description: 'Project “Substrata” opened.' },
    { title: 'Stems imported', time: '09:40', tone: 'success' as const },
    { title: 'Render queued', time: '11:02', tone: 'warning' as const, description: 'Waiting on the mix bus.' },
    { title: 'Mastered', time: '13:20', tone: 'success' as const },
  ];
  return (
    <Page eyebrow="Navigation" title="Timeline" lede="A connected column of dated events, each node coloured by a semantic tone.">
      <Demo code={`<GlassTimeline items={[\n  { title: 'Session created', time: '09:12', tone: 'accent' },\n  { title: 'Mastered', time: '13:20', tone: 'success' },\n]} />`}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <GlassTimeline items={items} />
        </div>
      </Demo>
    </Page>
  );
}

function NavMenuPage() {
  const items = [
    { label: 'Overview', icon: '◈', active: true, trailing: '' },
    { label: 'Tracks', icon: '♪', trailing: '12' },
    { label: 'Effects', icon: '✦' },
    { label: 'Settings', icon: '⚙' },
  ];
  return (
    <Page eyebrow="Navigation" title="Nav menu" lede="A navigation list of links or buttons with an active state, vertical or horizontal.">
      <Demo code={`<GlassNavMenu items={[\n  { label: 'Overview', icon: '◈', active: true },\n  { label: 'Tracks', icon: '♪', trailing: '12' },\n]} />`}>
        <div style={{ width: 240 }}>
          <GlassNavMenu items={items} />
        </div>
      </Demo>
    </Page>
  );
}

function ScrollAreaPage() {
  return (
    <Page eyebrow="Layout" title="Scroll area" lede="A styled overflow container with a slim, themed scrollbar and soft edge fades.">
      <Demo code={`<GlassScrollArea maxHeight={180}>\n  {/* long content */}\n</GlassScrollArea>`}>
        <GlassScrollArea maxHeight={180} style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 12 }}>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgb(var(--ob-white) / 0.05)', color: 'var(--ob-ink-2)', fontSize: 13 }}>
                Row {i + 1}
              </div>
            ))}
          </div>
        </GlassScrollArea>
      </Demo>
    </Page>
  );
}

function MeterPage() {
  return (
    <Page eyebrow="Data" title="Meter" lede="A labelled progress meter with semantic tones and optional auto-colouring thresholds.">
      <Demo code={`<GlassMeter label="Disk" value={82} showValue thresholds={{ 0.7: 'warning', 0.9: 'danger' }} />`}>
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GlassMeter label="CPU" value={42} showValue />
          <GlassMeter label="Memory" value={68} showValue thresholds={{ 0.6: 'warning' }} />
          <GlassMeter label="Disk" value={92} showValue thresholds={{ 0.7: 'warning', 0.9: 'danger' }} />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'value', label: 'value', min: 0, max: 100, default: 64 },
          { type: 'select', key: 'tone', label: 'tone', options: ['accent', 'success', 'warning', 'danger'], default: 'accent' },
          { type: 'toggle', key: 'showValue', label: 'showValue', default: true },
        ]}
        render={(v) => (
          <div style={{ width: 320 }}>
            <GlassMeter label="Usage" value={Number(v.value)} tone={v.tone as 'accent'} showValue={Boolean(v.showValue)} />
          </div>
        )}
        code={(v) => `<GlassMeter label="Usage" value={${v.value}} tone="${v.tone}"${v.showValue ? ' showValue' : ''} />`}
      />
    </Page>
  );
}

function EmptyStatePage() {
  return (
    <Page eyebrow="Feedback" title="Empty state" lede="A centred placeholder for empty lists, zero-results, and first-run screens.">
      <Demo center code={`<GlassEmptyState icon="🎧" title="No tracks yet" description="Import stems to get started." action={<GlassButton variant="primary" size="sm">Import</GlassButton>} />`}>
        <GlassEmptyState
          icon="◎"
          title="No tracks yet"
          description="Import your stems or start from a template to fill this space."
          action={<GlassButton variant="primary" size="sm">Import audio</GlassButton>}
        />
      </Demo>
    </Page>
  );
}

function CalloutPage() {
  return (
    <Page eyebrow="Feedback" title="Callout" lede="A lightweight inline note with a coloured left rail — lighter than an alert.">
      <Demo code={`<GlassCallout tone="warning" title="Heads up" icon="⚠">\n  Renders are queued behind the mix bus.\n</GlassCallout>`}>
        <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GlassCallout tone="info" icon="ℹ" title="Note">Bounces are 24-bit by default.</GlassCallout>
          <GlassCallout tone="success" icon="✓">Master exported to your library.</GlassCallout>
          <GlassCallout tone="warning" icon="⚠" title="Heads up">Renders are queued behind the mix bus.</GlassCallout>
          <GlassCallout tone="danger" icon="✕" title="Clipping">The master bus is over 0 dB.</GlassCallout>
        </div>
      </Demo>
    </Page>
  );
}

function DescriptionListPage() {
  const items = [
    { term: 'Format', description: 'WAV · 24-bit / 48 kHz' },
    { term: 'Duration', description: '4:12' },
    { term: 'Tempo', description: '174 BPM' },
    { term: 'Key', description: 'F minor' },
  ];
  return (
    <Page eyebrow="Data" title="Description list" lede="A term/value list for specs, metadata, and detail panels. Horizontal or stacked.">
      <Demo code={`<GlassDescriptionList items={[\n  { term: 'Format', description: 'WAV · 24-bit' },\n  { term: 'Tempo', description: '174 BPM' },\n]} />`}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <GlassDescriptionList items={items} />
        </div>
      </Demo>
    </Page>
  );
}

function LiveRangeSlider() {
  const [range, setRange] = useState<[number, number]>([28, 72]);
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <GlassRangeSlider value={range} onChange={setRange} label="Price" format={(r) => `$${r[0]} – $${r[1]}`} />
    </div>
  );
}

function RangeSliderPage() {
  return (
    <Page eyebrow="Forms" title="Range slider" lede="A dual-handle slider that selects a low/high range. Drag either thumb or the track; arrow keys step.">
      <Demo code={`const [range, setRange] = useState([28, 72]);\n\n<GlassRangeSlider value={range} onChange={setRange} label="Price" />`}>
        <LiveRangeSlider />
      </Demo>
    </Page>
  );
}

function LiveToggleGroup() {
  const [value, setValue] = useState<string[]>(['bold']);
  const items = [
    { value: 'bold', label: 'B' },
    { value: 'italic', label: 'I' },
    { value: 'underline', label: 'U' },
    { value: 'strike', label: 'S' },
  ];
  return <GlassToggleGroup items={items} value={value} onChange={setValue} aria-label="Text style" />;
}

function ToggleGroupPage() {
  return (
    <Page eyebrow="Forms" title="Toggle group" lede="A multi-select sibling of Segmented — turn any number of the connected pills on.">
      <Demo center code={`const [value, setValue] = useState(['bold']);\n\n<GlassToggleGroup value={value} onChange={setValue} items={[\n  { value: 'bold', label: 'B' }, { value: 'italic', label: 'I' },\n]} />`}>
        <LiveToggleGroup />
      </Demo>
    </Page>
  );
}

function LiveColorPicker() {
  const [color, setColor] = useState('#b31f33');
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <GlassColorPicker value={color} onChange={setColor} alpha />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 60, height: 60, borderRadius: 14, background: color, boxShadow: 'var(--ob-shadow)' }} />
        <code style={{ fontSize: 12, color: 'var(--ob-ink-2)' }}>{color}</code>
      </div>
    </div>
  );
}

function ColorPickerPage() {
  return (
    <Page eyebrow="Forms" title="Color picker" lede="A hand-rolled HSV picker — saturation/value square, hue and opacity sliders, hex field. Zero dependencies.">
      <Demo center code={`const [color, setColor] = useState('#b31f33');\n\n<GlassColorPicker value={color} onChange={setColor} alpha />`}>
        <LiveColorPicker />
      </Demo>
    </Page>
  );
}

function LiveWindow() {
  const [tab, setTab] = useState('substrata');
  const tabs = [
    { id: 'substrata', label: 'Substrata', icon: '♪' },
    { id: 'redline', label: 'Redline Pressure', icon: '♪' },
    { id: 'hollow', label: 'Hollow Signal', icon: '♪' },
  ];
  return (
    <GlassWindow
      chrome="browser"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onClose={() => {}}
      onMinimize={() => {}}
      onZoom={() => {}}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <GlassKbd size="sm">←</GlassKbd>
          <GlassKbd size="sm">→</GlassKbd>
          <div style={{ flex: 1, padding: '6px 12px', borderRadius: 999, background: 'var(--ob-well)', border: '1px solid var(--ob-line)', fontSize: 12.5, color: 'var(--ob-ink-3)', fontFamily: 'var(--ob-font-mono)' }}>
            oblivion.ui / {tab}
          </div>
        </div>
      }
      style={{ width: '100%', maxWidth: 520 }}
    >
      <div style={{ minHeight: 120 }}>
        <h3 style={{ margin: '0 0 6px', color: 'var(--ob-ink-strong)' }}>{tabs.find((t) => t.id === tab)?.label}</h3>
        <p style={{ margin: 0, color: 'var(--ob-ink-2)', fontSize: 13.5 }}>
          Tab content renders here — the window is pure chrome around whatever you drop in.
        </p>
      </div>
    </GlassWindow>
  );
}

function WindowPage() {
  return (
    <Page eyebrow="Layout" title="Window" lede="A desktop-window frame in glass — traffic-light controls, a mac title or a browser tab strip, and a toolbar row. Pure chrome for demos and app shells.">
      <Demo center code={`<GlassWindow chrome="mac" title="Mixer">\n  …\n</GlassWindow>`}>
        <GlassWindow chrome="mac" title="Mixer.app" onClose={() => {}} onMinimize={() => {}} onZoom={() => {}} style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ minHeight: 100, color: 'var(--ob-ink-2)', fontSize: 14 }}>
            A macOS-style window: three traffic lights, a centred title, your content below.
          </div>
        </GlassWindow>
      </Demo>

      <Demo center title="Browser chrome" desc="Pass `tabs` for a browser-like frame with a tab strip and a toolbar row." code={`<GlassWindow\n  chrome="browser"\n  tabs={[{ id: 'a', label: 'Substrata' }, …]}\n  activeTab={tab}\n  onTabChange={setTab}\n  toolbar={<AddressBar />}\n/>`}>
        <LiveWindow />
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'os', label: 'os', options: ['mac', 'windows', 'linux'], default: 'mac' },
          { type: 'select', key: 'chrome', label: 'chrome', options: ['mac', 'browser'], default: 'mac' },
        ]}
        render={(v) => (
          <GlassWindow
            os={v.os as 'mac'}
            chrome={v.chrome as 'mac'}
            title="Mixer.app"
            tabs={v.chrome === 'browser' ? [{ id: 'a', label: 'Substrata' }, { id: 'b', label: 'Redline' }] : undefined}
            onClose={() => {}}
            onMinimize={() => {}}
            onZoom={() => {}}
            style={{ width: 380 }}
          >
            <div style={{ minHeight: 70, color: 'var(--ob-ink-2)', fontSize: 13.5 }}>
              {v.os} · {v.chrome} — the traffic lights and tab shape follow the OS.
            </div>
          </GlassWindow>
        )}
        code={(v) => `<GlassWindow os="${v.os}" chrome="${v.chrome}" title="Mixer.app" … />`}
      />
    </Page>
  );
}

function MenuBarPage() {
  return (
    <Page eyebrow="Chrome" title="Menu bar" lede="A macOS-style top menu bar — brand, app menus, right-aligned status glyphs and a live clock.">
      <Demo code={`<GlassMenuBar brand="◆" menus={['File', 'Edit', 'View']} status={['🔊', '📶', '🔋']} />`}>
        <div style={{ width: '100%' }}>
          <GlassMenuBar brand="◆" menus={['Oblivion', 'File', 'Edit', 'View', 'Window']} status={['◐', '⇅', '▮']} />
        </div>
      </Demo>
    </Page>
  );
}

function DockPage() {
  return (
    <Page eyebrow="Chrome" title="Dock" lede="A macOS dock — icons swell toward the cursor and settle when it leaves.">
      <Demo center code={`<GlassDock items={[{ id: 'finder', icon: '🗂', label: 'Finder' }, …]} />`}>
        <GlassDock
          items={[
            { id: 'finder', icon: '◈', label: 'Finder', active: true },
            { id: 'notes', icon: '✎', label: 'Notes' },
            { id: 'music', icon: '♪', label: 'Music' },
            { id: 'term', icon: '❯', label: 'Terminal' },
            { id: 'trash', icon: '🗑', label: 'Trash' },
          ]}
        />
      </Demo>
    </Page>
  );
}

function TerminalPage() {
  return (
    <Page eyebrow="Chrome" title="Terminal" lede="A terminal window with a prompt, output lines, a blinking cursor, and an optional type-on.">
      <Demo center code={`<GlassTerminal typing title="zsh" lines={[\n  { cmd: 'npm i oblivion-ui', out: 'added 1 package in 1.2s' },\n]} />`}>
        <GlassTerminal
          title="zsh — oblivion"
          typing
          lines={[
            { cmd: 'npm i oblivion-ui', out: '＋ oblivion-ui@0.3.0' },
            { cmd: 'npm run build', out: 'built dist/ in 574ms ✓' },
          ]}
        />
      </Demo>
    </Page>
  );
}

function NotificationPage() {
  const [show, setShow] = useState(true);
  return (
    <Page eyebrow="Chrome" title="Notification" lede="An OS-style notification banner — app icon, title, body, timestamp.">
      <Demo center code={`<GlassNotification app="Mixer" icon="♪" title="Render complete" body="Substrata (VIP) mastered." time="now" />`}>
        {show ? (
          <GlassNotification
            app="Mixer"
            icon="♪"
            title="Render complete"
            body="Substrata (VIP) mastered and exported to your library."
            time="now"
            onClose={() => setShow(false)}
            actions={
              <>
                <GlassButton size="sm" variant="secondary">View</GlassButton>
                <GlassButton size="sm" variant="ghost" onClick={() => setShow(false)}>Dismiss</GlassButton>
              </>
            }
          />
        ) : (
          <GlassButton variant="secondary" size="sm" onClick={() => setShow(true)}>Show again</GlassButton>
        )}
      </Demo>
    </Page>
  );
}

function ContextMenuPage() {
  const { toast } = useToast();
  const items = [
    { key: 'open', label: 'Open', icon: '↗', hint: '⏎', onSelect: () => toast('Open') },
    { key: 'rename', label: 'Rename', icon: '✎', onSelect: () => toast('Rename') },
    { key: 'dup', label: 'Duplicate', icon: '⧉', onSelect: () => toast('Duplicate') },
    { key: 's1', separator: true },
    { key: 'del', label: 'Delete', icon: '🗑', danger: true, onSelect: () => toast('Delete') },
  ];
  return (
    <Page eyebrow="Chrome" title="Context menu" lede="A right-click menu, portalled at the cursor and clamped to the viewport.">
      <Demo center code={`<GlassContextMenu items={items}>\n  <div>Right-click me</div>\n</GlassContextMenu>`}>
        <GlassContextMenu items={items}>
          <div style={{ display: 'grid', placeItems: 'center', width: 260, height: 120, borderRadius: 14, border: '1.5px dashed var(--ob-line-lit)', color: 'var(--ob-ink-3)', fontSize: 13.5 }}>
            Right-click anywhere here
          </div>
        </GlassContextMenu>
      </Demo>
    </Page>
  );
}

function StatusBarPage() {
  return (
    <Page eyebrow="Chrome" title="Status bar" lede="An editor-style status bar — grouped, tinted segments (branch, errors, position).">
      <Demo code={`<GlassStatusBar left={[{ key: 'br', icon: '⎇', label: 'main' }]} right={[…]} />`}>
        <div style={{ width: '100%' }}>
          <GlassStatusBar
            left={[
              { key: 'br', icon: '⎇', label: 'main', onClick: () => {} },
              { key: 'err', icon: '✕', label: '0', tone: 'danger' },
              { key: 'warn', icon: '⚠', label: '2', tone: 'warning' },
            ]}
            right={[
              { key: 'pos', label: 'Ln 42, Col 8' },
              { key: 'enc', label: 'UTF-8' },
              { key: 'lang', label: 'TypeScript', tone: 'accent' },
            ]}
          />
        </div>
      </Demo>
    </Page>
  );
}

function DeviceFramePage() {
  return (
    <Page eyebrow="Chrome" title="Device frame" lede="A phone bezel with a dynamic island or notch and a home indicator, to wrap mobile screens.">
      <Demo center code={`<GlassDeviceFrame notch="island" width={280}>\n  <YourMobileScreen />\n</GlassDeviceFrame>`}>
        <GlassDeviceFrame width={260}>
          <div style={{ padding: '54px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--ob-ink-strong)' }}>Now Playing</h3>
            <GlassMiniPlayer title="Substrata" artist="Oblivion" artwork="♪" progress={0.42} playing elapsed="1:44" duration="4:12" />
          </div>
        </GlassDeviceFrame>
      </Demo>
    </Page>
  );
}

function CodeBlockPage() {
  return (
    <Page eyebrow="Chrome" title="Code block" lede="A code window — traffic lights, a language tab, a copy button, and an optional line-number gutter.">
      <Demo code={`<GlassCodeBlock language="tsx" title="App.tsx" lineNumbers code={source} />`}>
        <GlassCodeBlock
          language="tsx"
          title="App.tsx"
          lineNumbers
          code={`import { GlassButton } from 'oblivion-ui';\n\nexport function App() {\n  return <GlassButton variant="primary">Ship it</GlassButton>;\n}`}
        />
      </Demo>
    </Page>
  );
}

function LiveMiniPlayer() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.42);
  return (
    <GlassMiniPlayer
      title="Substrata (VIP)"
      artist="Oblivion"
      artwork="♪"
      progress={progress}
      onSeek={setProgress}
      elapsed="1:44"
      duration="4:12"
      playing={playing}
      onPlayPause={() => setPlaying((p) => !p)}
    />
  );
}

function MiniPlayerPage() {
  return (
    <Page eyebrow="Chrome" title="Mini player" lede="A compact music player — artwork, a click-to-seek scrubber, and transport controls.">
      <Demo center code={`<GlassMiniPlayer title="Substrata" artist="Oblivion" progress={0.42} playing onPlayPause={toggle} onSeek={setProgress} />`}>
        <LiveMiniPlayer />
      </Demo>
    </Page>
  );
}

function ChatBubblePage() {
  return (
    <Page eyebrow="Chrome" title="Chat bubble" lede="iMessage-style bubbles — sent (me) and received (them), with tails.">
      <Demo code={`<GlassChatBubble from="them">Bounce ready?</GlassChatBubble>\n<GlassChatBubble from="me" time="now">Mastering now ✨</GlassChatBubble>`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 420 }}>
          <GlassChatBubble from="them" author="Rui">Is the VIP bounce ready?</GlassChatBubble>
          <GlassChatBubble from="me">Mastering it now — 2 min.</GlassChatBubble>
          <GlassChatBubble from="me" time="now">Sent ✨</GlassChatBubble>
        </div>
      </Demo>
    </Page>
  );
}

function SpotlightCardPage() {
  return (
    <Page eyebrow="Delight" title="Spotlight card" lede="A card with an accent glow that follows the cursor. Move your pointer across it.">
      <Demo center code={`<GlassSpotlightCard>\n  <h3>Substrata</h3>\n  <p>Deep liquid rollers.</p>\n</GlassSpotlightCard>`}>
        <GlassSpotlightCard style={{ maxWidth: 320 }}>
          <h3 style={{ margin: '0 0 6px', color: 'var(--ob-ink-strong)' }}>Substrata</h3>
          <p style={{ margin: 0, color: 'var(--ob-ink-2)', fontSize: 13.5 }}>
            Deep liquid rollers with halftime switch-ups. Hover to light it up.
          </p>
        </GlassSpotlightCard>
      </Demo>
    </Page>
  );
}

function TiltCardPage() {
  return (
    <Page eyebrow="Delight" title="Tilt card" lede="A card that tilts in 3D toward the cursor, with a moving sheen.">
      <Demo center code={`<GlassTiltCard>\n  <h3>174 BPM</h3>\n</GlassTiltCard>`}>
        <GlassTiltCard style={{ width: 260 }}>
          <div style={{ fontFamily: 'var(--ob-font-mono)', fontSize: 12, color: 'var(--ob-ink-3)' }}>NOW RENDERING</div>
          <h3 style={{ margin: '6px 0 0', fontSize: 32, color: 'var(--ob-ink-strong)' }}>174 BPM</h3>
          <p style={{ margin: '6px 0 0', color: 'var(--ob-ink-2)', fontSize: 13 }}>Hover and move your cursor.</p>
        </GlassTiltCard>
      </Demo>
    </Page>
  );
}

function NumberTickerPage() {
  const [n, setN] = useState(48200);
  return (
    <Page eyebrow="Delight" title="Number ticker" lede="A number that animates whenever its value changes.">
      <Demo center code={`<GlassNumberTicker value={value} prefix="$" />`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 44 }}>
            <GlassNumberTicker value={n} prefix="$" />
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <GlassButton size="sm" variant="secondary" onClick={() => setN(Math.round(Math.random() * 90000))}>Randomize</GlassButton>
            <GlassButton size="sm" variant="ghost" onClick={() => setN((v) => v + 5000)}>+5,000</GlassButton>
          </div>
        </div>
      </Demo>
    </Page>
  );
}

function MarqueePage() {
  const tags = ['GLASS', 'NO GRADIENTS', 'ONE ACCENT', 'SPRING MOTION', 'ZERO DEPS', 'THEME STUDIO'];
  return (
    <Page eyebrow="Delight" title="Marquee" lede="A seamless scrolling strip — logos, tags, a ticker. Pauses on hover.">
      <Demo code={`<GlassMarquee speed={16}>{items}</GlassMarquee>`}>
        <GlassMarquee speed={16}>
          {tags.map((t) => (
            <GlassBadge key={t} variant="outline" mono>{t}</GlassBadge>
          ))}
        </GlassMarquee>
      </Demo>
    </Page>
  );
}

function SpeedDialPage() {
  const { toast } = useToast();
  return (
    <Page eyebrow="Delight" title="Speed dial" lede="A floating action button that fans its actions out on open.">
      <Demo center code={`<GlassSpeedDial actions={[{ id: 'track', icon: '♪', label: 'New track', onClick }]} />`}>
        <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <GlassSpeedDial
            actions={[
              { id: 'track', icon: '♪', label: 'New track', onClick: () => toast('New track') },
              { id: 'import', icon: '↧', label: 'Import', onClick: () => toast('Import') },
              { id: 'record', icon: '●', label: 'Record', onClick: () => toast('Record') },
            ]}
          />
        </div>
      </Demo>
    </Page>
  );
}

function ActivityRingsPage() {
  return (
    <Page eyebrow="Data" title="Activity rings" lede="Apple-Watch-style concentric progress rings, drawn in SVG and tinted by semantic tone.">
      <Demo center code={`<GlassActivityRings rings={[{ value: 0.8, tone: 'accent' }, { value: 0.6, tone: 'success' }, { value: 0.4, tone: 'warning' }]}>\n  <span>3/5</span>\n</GlassActivityRings>`}>
        <GlassActivityRings
          rings={[
            { value: 0.82, tone: 'accent', label: 'Mixing' },
            { value: 0.6, tone: 'success', label: 'Mastered' },
            { value: 0.4, tone: 'warning', label: 'Pending' },
          ]}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>61%</div>
            <div style={{ fontSize: 10, color: 'var(--ob-ink-3)' }}>done</div>
          </div>
        </GlassActivityRings>
      </Demo>
    </Page>
  );
}

function GaugePage() {
  return (
    <Page eyebrow="Data" title="Gauge" lede="A radial dial for a single KPI, with an open sweep and threshold auto-colouring.">
      <Demo center code={`<GlassGauge value={82} label="Disk" thresholds={{ 0.7: 'warning', 0.9: 'danger' }} />`}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <GlassGauge value={42} label="CPU" />
          <GlassGauge value={82} label="Disk" thresholds={{ 0.7: 'warning', 0.9: 'danger' }} />
          <GlassGauge value={96} label="Heat" thresholds={{ 0.9: 'danger' }} />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'range', key: 'value', label: 'value', min: 0, max: 100, default: 64 },
          { type: 'range', key: 'sweep', label: 'sweep', min: 180, max: 360, default: 270 },
          { type: 'select', key: 'tone', label: 'tone', options: ['accent', 'success', 'warning', 'danger'], default: 'accent' },
        ]}
        render={(v) => <GlassGauge value={Number(v.value)} sweep={Number(v.sweep)} tone={v.tone as 'accent'} label="KPI" />}
        code={(v) => `<GlassGauge value={${v.value}} sweep={${v.sweep}} tone="${v.tone}" label="KPI" />`}
      />
    </Page>
  );
}

function SparklinePage() {
  const data = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 16];
  return (
    <Page eyebrow="Data" title="Sparkline" lede="A tiny inline SVG chart to drop into stat tiles and table rows.">
      <Demo code={`<GlassSparkline data={[4, 6, 5, 8, 7, 10, …]} tone="success" />`}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <GlassSparkline data={data} tone="accent" />
          <GlassSparkline data={[...data].reverse()} tone="danger" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ fontSize: 20, color: 'var(--ob-ink-strong)' }}>+18%</strong>
            <GlassSparkline data={data} width={80} height={24} tone="success" />
          </span>
        </div>
      </Demo>
    </Page>
  );
}

function SplitPanePage() {
  return (
    <Page eyebrow="Layout" title="Split pane" lede="Two resizable panes with a draggable divider. Drag the handle, or focus it and use arrows.">
      <Demo code={`<GlassSplitPane defaultSplit={0.4}>\n  <Sidebar />\n  <Editor />\n</GlassSplitPane>`}>
        <div style={{ width: '100%', height: 200 }}>
          <GlassSplitPane defaultSplit={0.4} style={{ height: '100%' }}>
            <div style={{ padding: 16, color: 'var(--ob-ink-2)', fontSize: 13 }}>Sidebar — drag the divider →</div>
            <div style={{ padding: 16, color: 'var(--ob-ink-2)', fontSize: 13 }}>Editor pane fills the rest.</div>
          </GlassSplitPane>
        </div>
      </Demo>
    </Page>
  );
}

function CustomizingPage() {
  return (
    <Page eyebrow="Getting started" title="Customizing" lede="Four layers of control, from a whole-kit reskin down to a single element.">
      <Demo
        title="1 · Theme tokens"
        desc="Override any --ob-* variable on :root or a subtree to reskin everything. This is what the Theme Studio writes."
        code={`:root {\n  --ob-accent: 34 197 94;   /* bare RGB triplet */\n  --ob-r-md: 6px;           /* tighter corners  */\n  --ob-border-w: 2px;       /* bolder rims      */\n}`}
      >
        <GlassCallout tone="accent" icon="✦" title="Theme Studio">
          The ✦ Studio panel in the top bar writes these live, then copies them as a CSS block.
        </GlassCallout>
      </Demo>

      <Demo
        title="2 · Per-component CSS-var hooks"
        desc="Reshape one instance without a theme. Each hook falls back to the global token."
        code={`<GlassSegmented style={{ '--ob-seg-radius': '999px' }} items={items} />\n<GlassButton style={{ '--ob-btn-radius': '4px' }}>Square</GlassButton>\n<GlassStat style={{ '--ob-stat-value-size': '44px' }} … />`}
      >
        <GlassSegmented
          defaultValue="a"
          style={{ ['--ob-seg-radius' as string]: '999px' }}
          items={[{ value: 'a', label: 'Pill' }, { value: 'b', label: 'Shape' }]}
        />
      </Demo>

      <Demo
        title="3 · Slot classNames"
        desc="Reach an inner part directly — no wrapper selectors, no !important."
        code={`<GlassCard\n  classNames={{ title: 'font-serif', footer: 'justify-center' }}\n  title="…" footer={<…/>}\n/>`}
      >
        <GlassBadge>classNames on Card, Stat, Breadcrumb, Steps, Timeline…</GlassBadge>
      </Demo>

      <Demo
        title="4 · Tone prop"
        desc="Buttons and badges remap their accent to a semantic token in one prop."
        code={`<GlassButton variant="primary" tone="success">Save</GlassButton>\n<GlassBadge tone="danger">Failing</GlassBadge>`}
      >
        <div className="docs-row">
          <GlassButton variant="primary" tone="success" size="sm">Success</GlassButton>
          <GlassButton variant="primary" tone="warning" size="sm">Warning</GlassButton>
          <GlassButton variant="primary" tone="danger" size="sm">Danger</GlassButton>
          <GlassBadge tone="success">ok</GlassBadge>
          <GlassBadge tone="danger">error</GlassBadge>
        </div>
      </Demo>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Parity batch — Chakra/shadcn staples
   ═══════════════════════════════════════════════════════════════════════ */

function TypographyPage() {
  return (
    <Page eyebrow="Layout" title="Typography" lede="Heading and Text primitives — sized, toned, and polymorphic via `as`.">
      <Demo code={`<Heading level={1} size="3xl">Smoked glass</Heading>\n<Text tone="muted">Frosted surfaces, one accent.</Text>`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Heading level={1} size="3xl">Smoked glass</Heading>
          <Heading level={3}>A quieter subhead</Heading>
          <Text tone="muted">Body text in the muted tone — frosted surfaces, a single accent, motion that breathes.</Text>
          <Text size="sm" tone="subtle" mono>--ob-ink-3 · mono · small</Text>
        </div>
      </Demo>
    </Page>
  );
}

function LayoutExtrasPage() {
  return (
    <Page eyebrow="Layout" title="Center · Ratio · ButtonGroup" lede="The small structural helpers Chakra users reach for constantly.">
      <Demo title="Center" desc="Centres children on both axes." code={`<Center style={{ height: 100 }}>Centered</Center>`}>
        <Center style={{ height: 90, width: '100%', border: '1px dashed var(--ob-line-lit)', borderRadius: 12, color: 'var(--ob-ink-2)' }}>
          Perfectly centered
        </Center>
      </Demo>
      <Demo title="AspectRatio" desc="Locks a child to a ratio." code={`<AspectRatio ratio={16 / 9}><img … /></AspectRatio>`}>
        <div style={{ width: 260 }}>
          <AspectRatio ratio={16 / 9} style={{ border: '1px solid var(--ob-line)' }}>
            <Center style={{ background: 'rgb(var(--ob-accent) / 0.14)', color: 'var(--ob-ink-2)', fontSize: 12 }}>16 : 9</Center>
          </AspectRatio>
        </div>
      </Demo>
      <Demo title="ButtonGroup" desc="Spaced, or `attached` into one connected control." code={`<ButtonGroup attached>\n  <GlassButton>Day</GlassButton>\n  <GlassButton>Week</GlassButton>\n</ButtonGroup>`}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <ButtonGroup>
            <GlassButton variant="secondary" size="sm">Save</GlassButton>
            <GlassButton variant="ghost" size="sm">Cancel</GlassButton>
          </ButtonGroup>
          <ButtonGroup attached>
            <GlassButton variant="secondary" size="sm">Day</GlassButton>
            <GlassButton variant="secondary" size="sm">Week</GlassButton>
            <GlassButton variant="secondary" size="sm">Month</GlassButton>
          </ButtonGroup>
        </div>
      </Demo>
    </Page>
  );
}

function HooksPage() {
  const disc = useDisclosure();
  const clip = useClipboard('npm i oblivion-ui');
  return (
    <Page eyebrow="Getting started" title="Hooks" lede="The DX hooks you already know from Chakra — controlled state, disclosure, clipboard, media queries.">
      <Demo title="useDisclosure" desc="Boolean open/close state for overlays." code={`const { open, onOpen, onClose } = useDisclosure();`}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <GlassButton variant="secondary" size="sm" onClick={disc.onToggle}>Toggle</GlassButton>
          <GlassBadge variant={disc.open ? 'status' : 'neutral'} dot>{disc.open ? 'open' : 'closed'}</GlassBadge>
        </div>
      </Demo>
      <Demo title="useClipboard" desc="Copy text and get a `copied` flag that auto-resets." code={`const { copied, copy } = useClipboard('npm i oblivion-ui');`}>
        <GlassButton variant="primary" size="sm" onClick={clip.copy}>{clip.copied ? 'Copied ✓' : 'Copy install command'}</GlassButton>
      </Demo>
      <Demo title="useMediaQuery" desc="Track a media query, SSR-safe." code={`const isWide = useMediaQuery('(min-width: 900px)');`}>
        <Text tone="muted" size="sm">Also exported: <code>useControllableState</code>, <code>useOnEscape</code>, <code>useOutsideClick</code>.</Text>
      </Demo>
    </Page>
  );
}

function LiveAlertDialog() {
  const { open, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      toast('Deleted', { tone: 'danger' });
    }, 900);
  };
  return (
    <>
      <GlassButton variant="primary" tone="danger" onClick={onOpen}>Delete project</GlassButton>
      <GlassAlertDialog
        open={open}
        onClose={onClose}
        title="Delete “Substrata”?"
        description="This permanently removes the project and all its bounces. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirm}
        loading={loading}
      />
    </>
  );
}

function AlertDialogPage() {
  return (
    <Page eyebrow="Overlays" title="Alert dialog" lede="A confirmation dialog — a focused modal with a cancel + confirm pair and an async-loading state.">
      <Demo center code={`const { open, onOpen, onClose } = useDisclosure();\n\n<GlassAlertDialog open={open} onClose={onClose} title="Delete?" onConfirm={remove} />`}>
        <LiveAlertDialog />
      </Demo>
    </Page>
  );
}

function TagPage() {
  const [tags, setTags] = useState(['synthwave', 'neurofunk', 'ambient', 'halftime']);
  return (
    <Page eyebrow="Feedback" title="Tag" lede="A compact, optionally removable tag — like a badge you can dismiss.">
      <Demo code={`<GlassTag tone="accent" onClose={() => remove(t)}>{t}</GlassTag>`}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.map((t) => (
            <GlassTag key={t} tone="accent" onClose={() => setTags((xs) => xs.filter((x) => x !== t))}>
              {t}
            </GlassTag>
          ))}
          {tags.length === 0 ? <Text tone="subtle" size="sm">All removed — refresh to reset.</Text> : null}
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'select', key: 'tone', label: 'tone', options: ['neutral', 'accent', 'success', 'warning', 'danger'], default: 'neutral' },
          { type: 'select', key: 'size', label: 'size', options: ['sm', 'md'], default: 'md' },
          { type: 'toggle', key: 'closable', label: 'closable', default: true },
        ]}
        render={(v) => (
          <GlassTag tone={v.tone as 'neutral'} size={v.size as 'md'} onClose={v.closable ? () => {} : undefined}>
            Label
          </GlassTag>
        )}
        code={(v) => `<GlassTag tone="${v.tone}" size="${v.size}"${v.closable ? ' onClose={remove}' : ''}>Label</GlassTag>`}
      />
    </Page>
  );
}

function EditablePage() {
  const [name, setName] = useState('Substrata (VIP)');
  return (
    <Page eyebrow="Forms" title="Editable" lede="Click-to-edit text — a label that swaps to an input on focus. Enter commits, Escape cancels.">
      <Demo code={`const [name, setName] = useState('Substrata');\n\n<GlassEditable value={name} onChange={setName} />`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text tone="subtle" size="sm">Track name:</Text>
          <GlassEditable value={name} onChange={setName} aria-label="Track name" />
        </div>
      </Demo>
    </Page>
  );
}

function SidebarPage() {
  const [collapsed, setCollapsed] = useState(false);
  const sections = [
    { label: 'Workspace', items: [
      { id: 'over', label: 'Overview', icon: '◈', active: true },
      { id: 'tracks', label: 'Tracks', icon: '♪', badge: '12' },
      { id: 'fx', label: 'Effects', icon: '✦' },
    ] },
    { label: 'Account', items: [
      { id: 'set', label: 'Settings', icon: '⚙' },
      { id: 'help', label: 'Help', icon: '?' },
    ] },
  ];
  return (
    <Page eyebrow="Navigation" title="Sidebar" lede="A collapsible application sidebar — sections of nav items that fold to an icon rail.">
      <Demo code={`<GlassSidebar sections={sections} header={<Brand />} footer={<User />} />`}>
        <div style={{ height: 320 }}>
          <GlassSidebar
            sections={sections}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<strong style={{ color: 'var(--ob-ink-strong)' }}>◆ Oblivion</strong>}
            footer={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GlassAvatar name="Dana Kade" size="sm" /><Text size="sm" truncate>Dana Kade</Text></div>}
          />
        </div>
      </Demo>
    </Page>
  );
}

function CarouselPage() {
  const slides = ['Substrata', 'Redline Pressure', 'Hollow Signal'];
  const tones = ['accent', 'success', 'info'] as const;
  return (
    <Page eyebrow="Disclosure" title="Carousel" lede="A one-slide-at-a-time carousel with arrows and dot indicators.">
      <Demo code={`<GlassCarousel>\n  <Slide /> <Slide /> <Slide />\n</GlassCarousel>`}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <GlassCarousel>
            {slides.map((s, i) => (
              <Center key={s} style={{ height: 160, background: `rgb(var(--ob-${tones[i]}) / 0.16)`, borderRadius: 14 }}>
                <Heading level={3}>{s}</Heading>
              </Center>
            ))}
          </GlassCarousel>
        </div>
      </Demo>
    </Page>
  );
}

function BarChartPage() {
  const data = [
    { label: 'Mon', value: 42, color: '#7c5cff' },
    { label: 'Tue', value: 68, color: '#22d3ee' },
    { label: 'Wed', value: 55, color: '#4cc882' },
    { label: 'Thu', value: 91, color: '#f5a524' },
    { label: 'Fri', value: 74, color: '#ff5f8f' },
    { label: 'Sat', value: 30, tone: 'danger' as const },
  ];
  return (
    <Page eyebrow="Data" title="Bar chart" lede="A responsive vertical bar chart. Name each point, print its value, and colour bars by semantic tone or any hex.">
      <Demo title="Single value" desc="One bar per point, coloured per datum." code={`<GlassBarChart\n  showValues\n  data={[\n    { label: 'Mon', value: 42, color: '#7c5cff' },\n    { label: 'Tue', value: 68, color: '#22d3ee' },\n  ]}\n/>`}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <GlassBarChart data={data} showValues />
        </div>
      </Demo>

      <Demo title="Multiple values (grouped)" desc="Several series per point, side by side, with a legend from the series names." code={`<GlassBarChart\n  labels={['Q1', 'Q2', 'Q3', 'Q4']}\n  series={[\n    { name: 'Revenue', data: [40, 72, 58, 90], color: '#22d3ee' },\n    { name: 'Costs', data: [28, 40, 35, 52], color: '#ff5f8f' },\n  ]}\n/>`}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <GlassBarChart
            labels={['Q1', 'Q2', 'Q3', 'Q4']}
            series={[
              { name: 'Revenue', data: [40, 72, 58, 90], color: '#22d3ee' },
              { name: 'Costs', data: [28, 40, 35, 52], color: '#ff5f8f' },
              { name: 'Profit', data: [12, 32, 23, 38], color: '#4cc882' },
            ]}
          />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'toggle', key: 'stacked', label: 'stacked', default: false },
          { type: 'toggle', key: 'showValues', label: 'showValues', default: false },
          { type: 'range', key: 'height', label: 'height', min: 100, max: 260, default: 180, unit: 'px' },
        ]}
        render={(v) => (
          <div style={{ width: 380 }}>
            <GlassBarChart
              stacked={Boolean(v.stacked)}
              showValues={Boolean(v.showValues)}
              height={Number(v.height)}
              labels={['Q1', 'Q2', 'Q3', 'Q4']}
              series={[
                { name: 'Revenue', data: [40, 72, 58, 90], color: '#22d3ee' },
                { name: 'Costs', data: [28, 40, 35, 52], color: '#ff5f8f' },
              ]}
            />
          </div>
        )}
        code={(v) => `<GlassBarChart${v.stacked ? ' stacked' : ''}${v.showValues ? ' showValues' : ''} labels={labels} series={[\n  { name: 'Revenue', data, color: '#22d3ee' },\n  { name: 'Costs', data, color: '#ff5f8f' },\n]} />`}
      />
    </Page>
  );
}

function LineChartPage() {
  const a = [8, 12, 9, 16, 14, 20, 18, 24, 22, 27];
  const b = [4, 6, 7, 9, 8, 12, 13, 15, 14, 19];
  const names = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
  return (
    <Page eyebrow="Data" title="Line chart" lede="A responsive SVG line/area chart. One or many series, point names on the axis, value labels, and any colour per series.">
      <Demo code={`<GlassLineChart\n  area dots\n  labels={['W1', 'W2', …]}\n  series={[\n    { data: revenue, color: '#22d3ee' },\n    { data: costs, color: '#ff5f8f' },\n  ]}\n/>`}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <GlassLineChart
            area
            dots
            series={[{ data: a, color: '#22d3ee', name: 'Revenue' }, { data: b, color: '#ff5f8f', name: 'Costs' }]}
            labels={names}
          />
        </div>
      </Demo>

      <PgHead />
      <Playground
        controls={[
          { type: 'text', key: 'color', label: 'line color', default: '#7c5cff' },
          { type: 'toggle', key: 'area', label: 'area', default: true },
          { type: 'toggle', key: 'dots', label: 'dots', default: true },
          { type: 'toggle', key: 'showValues', label: 'showValues', default: false },
        ]}
        render={(v) => (
          <div style={{ width: 380 }}>
            <GlassLineChart
              series={a}
              color={String(v.color)}
              labels={names}
              area={Boolean(v.area)}
              dots={Boolean(v.dots)}
              showValues={Boolean(v.showValues)}
            />
          </div>
        )}
        code={(v) => `<GlassLineChart series={data} color="${v.color}"${v.area ? ' area' : ''}${v.dots ? ' dots' : ''}${v.showValues ? ' showValues' : ''} labels={names} />`}
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
  'Chrome',
  'Delight',
  'Backdrop',
] as const;

export const PAGES: DocPage[] = [
  { id: 'introduction', label: 'Introduction', group: 'Getting started', render: () => <IntroPage /> },
  { id: 'theming', label: 'Theming', group: 'Getting started', render: () => <ThemingPage /> },
  { id: 'customizing', label: 'Customizing', group: 'Getting started', render: () => <CustomizingPage /> },
  { id: 'hooks', label: 'Hooks', group: 'Getting started', render: () => <HooksPage /> },

  { id: 'surface', label: 'Surface', group: 'Layout', render: () => <SurfacePage /> },
  { id: 'primitives', label: 'Primitives', group: 'Layout', render: () => <PrimitivesPage /> },
  { id: 'typography', label: 'Typography', group: 'Layout', render: () => <TypographyPage /> },
  { id: 'layout-extras', label: 'Center · Ratio · Group', group: 'Layout', render: () => <LayoutExtrasPage /> },
  { id: 'card', label: 'Card', group: 'Layout', render: () => <CardPage /> },
  { id: 'window', label: 'Window', group: 'Layout', render: () => <WindowPage /> },
  { id: 'splitpane', label: 'Split pane', group: 'Layout', render: () => <SplitPanePage /> },

  { id: 'button', label: 'Button', group: 'Forms', render: () => <ButtonPage /> },
  { id: 'field', label: 'Field', group: 'Forms', render: () => <FieldPage /> },
  { id: 'input', label: 'Input', group: 'Forms', render: () => <InputPage /> },
  { id: 'number', label: 'Number input', group: 'Forms', render: () => <NumberInputPage /> },
  { id: 'pin', label: 'PIN input', group: 'Forms', render: () => <PinInputPage /> },
  { id: 'select', label: 'Select', group: 'Forms', render: () => <SelectPage /> },
  { id: 'combobox', label: 'Combobox', group: 'Forms', render: () => <ComboboxPage /> },
  { id: 'taginput', label: 'Tag input', group: 'Forms', render: () => <TagInputPage /> },
  { id: 'datepicker', label: 'Date picker', group: 'Forms', render: () => <DatePickerPage /> },
  { id: 'calendar', label: 'Calendar', group: 'Forms', render: () => <CalendarPage /> },
  { id: 'filedrop', label: 'File drop', group: 'Forms', render: () => <FileDropPage /> },
  { id: 'checkbox', label: 'Checkbox', group: 'Forms', render: () => <CheckboxPage /> },
  { id: 'radio', label: 'Radio group', group: 'Forms', render: () => <RadioPage /> },
  { id: 'switch', label: 'Switch', group: 'Forms', render: () => <SwitchPage /> },
  { id: 'slider', label: 'Slider', group: 'Forms', render: () => <SliderPage /> },
  { id: 'segmented', label: 'Segmented', group: 'Forms', render: () => <SegmentedPage /> },
  { id: 'togglegroup', label: 'Toggle group', group: 'Forms', render: () => <ToggleGroupPage /> },
  { id: 'editable', label: 'Editable', group: 'Forms', render: () => <EditablePage /> },
  { id: 'rating', label: 'Rating', group: 'Forms', render: () => <RatingPage /> },
  { id: 'rangeslider', label: 'Range slider', group: 'Forms', render: () => <RangeSliderPage /> },
  { id: 'colorpicker', label: 'Color picker', group: 'Forms', render: () => <ColorPickerPage /> },

  { id: 'menu', label: 'Dropdown menu', group: 'Overlays', render: () => <MenuPage /> },
  { id: 'modal', label: 'Modal', group: 'Overlays', render: () => <ModalPage /> },
  { id: 'alertdialog', label: 'Alert dialog', group: 'Overlays', render: () => <AlertDialogPage /> },
  { id: 'popover', label: 'Popover', group: 'Overlays', render: () => <PopoverPage /> },
  { id: 'hovercard', label: 'Hover card', group: 'Overlays', render: () => <HoverCardPage /> },
  { id: 'drawer', label: 'Drawer', group: 'Overlays', render: () => <DrawerPage /> },
  { id: 'command', label: 'Command palette', group: 'Overlays', render: () => <CommandPage /> },
  { id: 'tooltip', label: 'Tooltip', group: 'Overlays', render: () => <TooltipPage /> },
  { id: 'toast', label: 'Toast', group: 'Overlays', render: () => <ToastPage /> },

  { id: 'tabs', label: 'Tabs', group: 'Navigation', render: () => <TabsPage /> },
  { id: 'breadcrumb', label: 'Breadcrumb', group: 'Navigation', render: () => <BreadcrumbPage /> },
  { id: 'pagination', label: 'Pagination', group: 'Navigation', render: () => <PaginationPage /> },
  { id: 'steps', label: 'Steps', group: 'Navigation', render: () => <StepsPage /> },
  { id: 'navmenu', label: 'Nav menu', group: 'Navigation', render: () => <NavMenuPage /> },
  { id: 'sidebar', label: 'Sidebar', group: 'Navigation', render: () => <SidebarPage /> },
  { id: 'timeline', label: 'Timeline', group: 'Navigation', render: () => <TimelinePage /> },

  { id: 'scrollarea', label: 'Scroll area', group: 'Layout', render: () => <ScrollAreaPage /> },

  { id: 'datagrid', label: 'Data grid', group: 'Data', render: () => <DataGridPage /> },
  { id: 'table', label: 'Table', group: 'Data', render: () => <TablePage /> },
  { id: 'list', label: 'List', group: 'Data', render: () => <ListPage /> },
  { id: 'stat', label: 'Stat', group: 'Data', render: () => <StatPage /> },
  { id: 'meter', label: 'Meter', group: 'Data', render: () => <MeterPage /> },
  { id: 'gauge', label: 'Gauge', group: 'Data', render: () => <GaugePage /> },
  { id: 'rings', label: 'Activity rings', group: 'Data', render: () => <ActivityRingsPage /> },
  { id: 'sparkline', label: 'Sparkline', group: 'Data', render: () => <SparklinePage /> },
  { id: 'barchart', label: 'Bar chart', group: 'Data', render: () => <BarChartPage /> },
  { id: 'linechart', label: 'Line chart', group: 'Data', render: () => <LineChartPage /> },
  { id: 'description', label: 'Description list', group: 'Data', render: () => <DescriptionListPage /> },

  { id: 'alert', label: 'Alert', group: 'Feedback', render: () => <AlertPage /> },
  { id: 'badge', label: 'Badge', group: 'Feedback', render: () => <BadgePage /> },
  { id: 'progress', label: 'Progress', group: 'Feedback', render: () => <ProgressPage /> },
  { id: 'loading', label: 'Spinner & skeleton', group: 'Feedback', render: () => <LoadingPage /> },
  { id: 'avatar', label: 'Avatar', group: 'Feedback', render: () => <AvatarPage /> },
  { id: 'kbd', label: 'Keyboard key', group: 'Feedback', render: () => <KbdPage /> },
  { id: 'callout', label: 'Callout', group: 'Feedback', render: () => <CalloutPage /> },
  { id: 'empty', label: 'Empty state', group: 'Feedback', render: () => <EmptyStatePage /> },

  { id: 'accordion', label: 'Accordion', group: 'Disclosure', render: () => <AccordionPage /> },
  { id: 'carousel', label: 'Carousel', group: 'Disclosure', render: () => <CarouselPage /> },

  { id: 'tag', label: 'Tag', group: 'Feedback', render: () => <TagPage /> },

  { id: 'menubar', label: 'Menu bar', group: 'Chrome', render: () => <MenuBarPage /> },
  { id: 'dock', label: 'Dock', group: 'Chrome', render: () => <DockPage /> },
  { id: 'terminal', label: 'Terminal', group: 'Chrome', render: () => <TerminalPage /> },
  { id: 'notification', label: 'Notification', group: 'Chrome', render: () => <NotificationPage /> },
  { id: 'contextmenu', label: 'Context menu', group: 'Chrome', render: () => <ContextMenuPage /> },
  { id: 'statusbar', label: 'Status bar', group: 'Chrome', render: () => <StatusBarPage /> },
  { id: 'device', label: 'Device frame', group: 'Chrome', render: () => <DeviceFramePage /> },
  { id: 'codeblock', label: 'Code block', group: 'Chrome', render: () => <CodeBlockPage /> },
  { id: 'miniplayer', label: 'Mini player', group: 'Chrome', render: () => <MiniPlayerPage /> },
  { id: 'chat', label: 'Chat bubble', group: 'Chrome', render: () => <ChatBubblePage /> },

  { id: 'spotlight', label: 'Spotlight card', group: 'Delight', render: () => <SpotlightCardPage /> },
  { id: 'tilt', label: 'Tilt card', group: 'Delight', render: () => <TiltCardPage /> },
  { id: 'ticker', label: 'Number ticker', group: 'Delight', render: () => <NumberTickerPage /> },
  { id: 'marquee', label: 'Marquee', group: 'Delight', render: () => <MarqueePage /> },
  { id: 'speeddial', label: 'Speed dial', group: 'Delight', render: () => <SpeedDialPage /> },

  { id: 'orbs', label: 'Orbs', group: 'Backdrop', render: () => <OrbsPage /> },
];
