import { useState } from 'react';
import {
  Flex,
  GlassAvatar,
  GlassAvatarGroup,
  GlassBadge,
  GlassButton,
  GlassCard,
  GlassCheckbox,
  GlassInput,
  GlassMenu,
  GlassModal,
  GlassProgress,
  GlassRadioGroup,
  GlassSelect,
  GlassSkeletonText,
  GlassSlider,
  GlassSpinner,
  GlassSurface,
  GlassSwitch,
  GlassTable,
  GlassTabs,
  GlassTooltip,
  Grid,
  Orbs,
  Separator,
  Stack,
  useToast,
} from '../src';
import { Wordmark } from './Wordmark';

/* ── Sample data. The library knows nothing about any of it. ────────── */

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
  { name: 'Blackwater Roll', bpm: 176, key: 'G min', status: 'Mastered' },
];

const STATUS_VARIANT = {
  Mastered: 'accent',
  Mixing: 'neutral',
  Draft: 'outline',
} as const;

const SUBGENRES = ['Liquid', 'Neurofunk', 'Halftime', 'Jungle'];

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    body: 'The segmented control doubles as page-level tabs. The active pill is red glass with a soft glow; inactive tabs are pure text so the surface stays quiet.',
  },
  {
    id: 'specs',
    label: 'Specs',
    body: 'Track: rgb(0 0 0 / 0.32) on a 1px hairline. Pill: rgb(179 31 51 / 0.4) with the shared spring. Radius 10 inside 14.',
  },
  {
    id: 'code',
    label: 'Code',
    body: '<GlassTabs items={…} value={tab} onChange={setTab} /> — controlled, keyboard-navigable, arrow keys included.',
  },
];

const TOAST_MESSAGES = [
  'Render queued — 174 BPM',
  'Patch saved to library',
  'Copied component snippet',
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function Components({ onNavigate }: { onNavigate: (page: 'landing') => void }) {
  const { toast } = useToast();

  const [lowPass, setLowPass] = useState(true);
  const [sidechain, setSidechain] = useState(true);
  const [feel, setFeel] = useState<string>('Liquid');
  const [wet, setWet] = useState(62);
  const [tab, setTab] = useState<string>('overview');
  const [subgenre, setSubgenre] = useState<string | null>('Neurofunk');
  const [modalOpen, setModalOpen] = useState(false);

  const fireToast = () =>
    toast(TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)]!);

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0]!;

  return (
    <div className="pg">
      <Orbs palette="midnight" />

      <div className="pg__inner pg__inner--sheet">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="pg-sheet-head">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Wordmark large />
              <h1 className="pg-sheet-head__title">
                Obsidian<em>UI</em>
              </h1>
            </div>
            <p className="pg-sheet-head__lede">
              Liquid glass components for React — frosted surfaces, oxblood accents, motion
              that breathes.
            </p>
          </div>
          <div className="pg-chips">
            <GlassBadge variant="neutral" mono>
              v0.3.0
            </GlassBadge>
            <GlassBadge variant="neutral" mono>
              React 18+
            </GlassBadge>
            <GlassBadge variant="accent" mono>
              zero-dependency
            </GlassBadge>
            <a
              href="#landing"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('landing');
              }}
            >
              <GlassBadge variant="neutral" mono>
                demo landing page →
              </GlassBadge>
            </a>
          </div>
        </header>

        <div className="pg-notes">
          <strong>Design notes:</strong> glass = flat translucent fills + backdrop blur + a
          brighter top edge for the specular highlight — no gradients anywhere. Accent is a
          single oxblood red used sparingly (primary actions, states, glow). Motion is one
          spring curve, cubic-bezier(0.34, 1.56, 0.64, 1); ambient motion lives only in the
          backdrop orbs.
        </div>

        <div className="pg-grid">
          {/* ── 01 Buttons ──────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec pg-sec--wide">
            <h2 className="ob-eyebrow">01 · BUTTON</h2>
            <div className="pg-row">
              <GlassButton variant="primary" onClick={fireToast}>
                Primary action
              </GlassButton>
              <GlassButton variant="secondary">Secondary</GlassButton>
              <GlassButton variant="ghost">Ghost</GlassButton>
              <GlassButton variant="quiet">Quiet →</GlassButton>
              <GlassButton variant="icon" aria-label="Add">
                +
              </GlassButton>
              <GlassButton disabled>Disabled</GlassButton>
              <GlassButton loading>Rendering</GlassButton>
            </div>
            <p className="pg-api">
              &lt;GlassButton variant="primary|secondary|ghost|quiet|icon" /&gt; — primary
              fires a toast, try it
            </p>
          </GlassSurface>

          {/* ── 02 Inputs ───────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">02 · INPUT &amp; SELECT</h2>
            <GlassInput label="Email" placeholder="you@label.rec" type="email" />
            <GlassSelect
              items={SUBGENRES}
              getKey={(s) => s}
              value={subgenre}
              onChange={setSubgenre}
              fieldLabel="Subgenre"
              aria-label="Subgenre"
            />
            <GlassInput
              label="API key"
              mono
              readOnly
              value="grnt_••••"
              error="Key expired — rotate it in settings."
            />
          </GlassSurface>

          {/* ── 03 Toggles ──────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">03 · SWITCH · CHECK · SLIDER</h2>
            <div className="pg-between">
              <span className="pg-label">Enable low-pass filter</span>
              <GlassSwitch
                checked={lowPass}
                onChange={setLowPass}
                aria-label="Enable low-pass filter"
              />
            </div>
            <div className="pg-row" style={{ gap: 22 }}>
              <GlassCheckbox checked={sidechain} onChange={setSidechain}>
                Sidechain
              </GlassCheckbox>
              <GlassRadioGroup
                items={['Liquid', 'Halftime']}
                getKey={(r) => r}
                value={feel}
                onChange={setFeel}
                aria-label="Feel"
              />
            </div>
            <GlassSlider value={wet} onChange={setWet} label="Wet / dry" aria-label="Wet / dry" />
          </GlassSurface>

          {/* ── 04 Tabs ─────────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">04 · TABS</h2>
            <GlassTabs
              items={TABS}
              getKey={(t) => t.id}
              label={(t) => t.label}
              value={tab}
              onChange={(t) => setTab(t.id)}
              aria-label="Documentation section"
              className="pg-self-start"
              style={{ alignSelf: 'flex-start' }}
            />
            <p className="pg-tabbody">{activeTab.body}</p>
          </GlassSurface>

          {/* ── 05 Card ─────────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">05 · CARD</h2>
            <GlassCard
              interactive
              radius="lg"
              padding="none"
              media={<div className="pg-democard__cover">[ cover art drop zone ]</div>}
            >
              <div style={{ padding: '16px 18px', display: 'grid', gap: 6 }}>
                <div className="pg-between">
                  <strong
                    style={{
                      fontFamily: 'var(--ob-font-display)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--ob-ink-strong)',
                    }}
                  >
                    Substrata EP
                  </strong>
                  <GlassBadge variant="accent" size="sm" mono>
                    174 BPM
                  </GlassBadge>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'rgb(239 236 235 / 0.55)' }}>
                  Deep liquid rollers with halftime switch-ups. Hover the card — the lift and
                  red edge-glow are the shared card hover recipe.
                </p>
              </div>
            </GlassCard>
          </GlassSurface>

          {/* ── 06 Feedback ─────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">06 · PROGRESS &amp; LOADING</h2>
            <GlassProgress
              value={wet}
              label="Determinate — bound to the slider"
              aria-label="Render progress"
            />
            <GlassProgress label="Indeterminate" aria-label="Working" />
            <div className="pg-row" style={{ gap: 24 }}>
              <div className="pg-row" style={{ gap: 10 }}>
                <GlassSpinner />
                <span style={{ fontSize: 13, color: 'var(--ob-ink-2)' }}>Spinner</span>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <GlassSkeletonText lines={3} />
              </div>
            </div>
          </GlassSurface>

          {/* ── 07 Badges ───────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">07 · BADGE · AVATAR · TOOLTIP</h2>
            <div className="pg-row" style={{ gap: 10 }}>
              <GlassBadge>New</GlassBadge>
              <GlassBadge variant="neutral">Stable</GlassBadge>
              <GlassBadge variant="outline">Beta</GlassBadge>
              <GlassBadge variant="status" dot pulse>
                Live
              </GlassBadge>
              <GlassBadge variant="solid">Pro</GlassBadge>
            </div>
            <div className="pg-row">
              <GlassAvatarGroup max={2}>
                <GlassAvatar name="Dana Kade" />
                <GlassAvatar name="Rui Vale" neutral />
                <GlassAvatar name="Ines Cole" />
                <GlassAvatar name="Theo Marsh" />
                <GlassAvatar name="Sam Okafor" />
                <GlassAvatar name="Lena Ford" />
              </GlassAvatarGroup>
              <GlassTooltip content="Frosted, springs in, dismisses on Escape">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  style={{ borderStyle: 'dashed', cursor: 'help' }}
                >
                  Hover for tooltip
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassSurface>

          {/* ── 08 Overlay ──────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">08 · MODAL &amp; TOAST</h2>
            <div className="pg-row">
              <GlassButton variant="primary" onClick={() => setModalOpen(true)}>
                Open modal
              </GlassButton>
              <GlassButton onClick={fireToast}>Fire toast</GlassButton>
            </div>
            <p className="pg-api">
              The dialog springs from below; toasts stack bottom-right and self-dismiss.
            </p>
          </GlassSurface>

          {/* ── 09 Table ────────────────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec pg-sec--wide">
            <h2 className="ob-eyebrow">09 · TABLE / LIST</h2>
            <GlassTable
              items={ROWS}
              getKey={(r) => r.name}
              aria-label="Track list"
              onRowClick={(r) => toast(`Opened ${r.name}`, { tone: 'neutral' })}
              columns={[
                {
                  id: 'track',
                  header: 'TRACK',
                  sortBy: (r) => r.name,
                  cell: (r) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <GlassAvatar size="sm" initials={initials(r.name)} style={{ borderRadius: 9 }} />
                      <span style={{ fontWeight: 500 }}>{r.name}</span>
                    </div>
                  ),
                },
                {
                  id: 'bpm',
                  header: 'BPM',
                  sortBy: (r) => r.bpm,
                  cell: (r) => <span className="ob-table__mono">{r.bpm}</span>,
                },
                {
                  id: 'key',
                  header: 'KEY',
                  sortBy: (r) => r.key,
                  cell: (r) => <span className="ob-table__mono">{r.key}</span>,
                },
                {
                  id: 'status',
                  header: 'STATUS',
                  align: 'end',
                  cell: (r) => (
                    <GlassBadge variant={STATUS_VARIANT[r.status]} size="sm">
                      {r.status}
                    </GlassBadge>
                  ),
                },
              ]}
            />
            <p className="pg-api">
              &lt;GlassTable columns={'{cols}'} items={'{data}'} /&gt; — hairline rows on
              near-transparent glass; hover tints red, headers sort.
            </p>
          </GlassSurface>

          {/* ── 10 Dropdown & Menu ──────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">10 · DROPDOWN &amp; MENU</h2>
            <div className="pg-row">
              <GlassMenu
                label="Track actions"
                trigger={
                  <GlassButton variant="secondary" size="sm">
                    Actions ▾
                  </GlassButton>
                }
                items={[
                  { key: 'play', label: 'Play', leading: '▶', onSelect: () => toast('Playing') },
                  { key: 'queue', label: 'Add to queue', trailing: '⌘Q', onSelect: fireToast },
                  { key: 'rename', label: 'Rename', onSelect: fireToast },
                  { key: 'sep', separator: true },
                  { key: 'share', label: 'Share', onSelect: fireToast },
                  {
                    key: 'del',
                    label: 'Delete',
                    danger: true,
                    onSelect: () => toast('Deleted', { tone: 'danger' }),
                  },
                ]}
              />
              <GlassMenu
                label="Sort by"
                placement="bottom-start"
                trigger={
                  <GlassButton variant="ghost" size="sm">
                    Sort by ▾
                  </GlassButton>
                }
                items={SUBGENRES.map((s) => ({
                  key: s,
                  label: s,
                  trailing: s === subgenre ? '✓' : undefined,
                  onSelect: () => setSubgenre(s),
                }))}
              />
            </div>
            <p className="pg-api">
              &lt;GlassMenu trigger={'{…}'} items={'{…}'} /&gt; — portalled, arrow-key roving,
              Esc &amp; outside-click dismiss, focus returns to the trigger.
            </p>
          </GlassSurface>

          {/* ── 11 Layout primitives ────────────────────────────────── */}
          <GlassSurface as="section" className="pg-sec">
            <h2 className="ob-eyebrow">11 · LAYOUT PRIMITIVES</h2>
            <Stack gap={4}>
              <Flex gap={2} wrap>
                <GlassBadge>Flex</GlassBadge>
                <GlassBadge variant="neutral">token gaps</GlassBadge>
                <GlassBadge variant="outline">wrap</GlassBadge>
              </Flex>
              <Separator />
              <Grid minColumnWidth="110px" gap={3}>
                {['Stack', 'Flex', 'Grid', 'Container'].map((n) => (
                  <GlassSurface
                    key={n}
                    style={{ padding: 16, textAlign: 'center', fontSize: 13 }}
                  >
                    {n}
                  </GlassSurface>
                ))}
              </Grid>
            </Stack>
            <p className="pg-api">
              &lt;Stack gap={'{4}'}&gt; · &lt;Flex wrap&gt; · &lt;Grid minColumnWidth="110px"&gt; ·
              &lt;Separator /&gt; — polymorphic, spacing off the token scale.
            </p>
          </GlassSurface>

          {/* ── 12 Light theme ──────────────────────────────────────── */}
          <section
            data-ob-theme="light"
            className="pg-sec pg-sec--wide pg-light"
            style={{ borderRadius: 'var(--ob-r-xl)' }}
          >
            <div className="pg-light__wash pg-light__wash--a" />
            <div className="pg-light__wash pg-light__wash--b" />
            <h2 className="ob-eyebrow">12 · LIGHT THEME — same tokens, airy surface</h2>
            <div className="pg-row" style={{ gap: 16 }}>
              <GlassButton variant="primary">Primary</GlassButton>
              <GlassButton variant="secondary">Secondary</GlassButton>
              <GlassInput placeholder="Search patches…" style={{ minWidth: 200 }} />
              <GlassBadge>New</GlassBadge>
              <GlassBadge variant="status" dot>
                Live
              </GlassBadge>
            </div>
            <p className="pg-api">
              Light glass flips the recipe: white translucency, bright top edge, shadow does
              the lifting. The accent deepens to #8b1123 for contrast.
            </p>
          </section>
        </div>

        <footer className="pg-foot" style={{ border: 0 }}>
          <span className="pg-foot__note">
            OBSIDIAN UI · component sheet · not affiliated with any brand
          </span>
          <span style={{ fontSize: 12, color: 'var(--ob-ink-3)' }}>
            Next: data table filters · date picker · nav bar
          </span>
        </footer>
      </div>

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete render queue?"
        description="This clears 12 queued bounces. The stems stay untouched — only the queue is removed."
        footer={
          <>
            <GlassButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                toast('Render queue deleted', { tone: 'danger' });
              }}
            >
              Delete queue
            </GlassButton>
          </>
        }
      />
    </div>
  );
}
