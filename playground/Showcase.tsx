import { useState } from 'react';
import {
  Emberfall,
  GlassBadge,
  GlassButton,
  GlassCard,
  GlassInput,
  GlassList,
  GlassModal,
  GlassSurface,
  GlassTable,
  GlassTabs,
  GlassTextarea,
} from '../src';

/* ── Sample data. Nothing here is known to the library. ─────────────── */

interface Acolyte {
  id: string;
  name: string;
  rank: string;
  devotion: number;
  status: 'ascended' | 'bound' | 'severed';
}

const ACOLYTES: Acolyte[] = [
  { id: 'a1', name: 'Vesper Ashgrove', rank: 'Herald', devotion: 98, status: 'ascended' },
  { id: 'a2', name: 'Corvin Hale', rank: 'Warden', devotion: 74, status: 'bound' },
  { id: 'a3', name: 'Ilya Morrow', rank: 'Scribe', devotion: 61, status: 'bound' },
  { id: 'a4', name: 'Sable Wren', rank: 'Oracle', devotion: 89, status: 'ascended' },
  { id: 'a5', name: 'Thorne Vale', rank: 'Initiate', devotion: 22, status: 'severed' },
];

const THEMES = [
  { id: 'default', label: 'Oblivion' },
  { id: 'seraph', label: 'Seraph' },
  { id: 'ichor', label: 'Ichor' },
  { id: 'ash', label: 'Ash' },
];

const initials = (n: string) =>
  n
    .split(' ')
    .map((p) => p[0])
    .join('');

const STATUS_TONE = {
  ascended: 'halo',
  bound: 'ember',
  severed: 'danger',
} as const;

export function Showcase() {
  const [theme, setTheme] = useState<string>('default');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>('a1');
  const [email, setEmail] = useState('');

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Not a vessel we recognise.' : undefined;

  return (
    <div data-ob-theme={theme === 'default' ? undefined : theme}>
      <Emberfall />

      <main className="pg">
        <header className="pg__masthead">
          <div className="pg__stamp">Oblivion · 0.2.0 · Apache-2.0</div>
          <h1 className="pg__title">
            Lit from <em>above</em>.
            <br />
            Burning from <em className="pg__title--hot">below</em>.
          </h1>
          <p className="pg__tagline">
            Smoked-glass React components hung between two lights — cold bone falling from
            overhead, ember burning up from underneath. No gradients anywhere; every edge,
            every glow, every band of light is flat colour.
          </p>
        </header>

        {/* ── Theming ────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Themes</div>
          <p className="pg__mono">
            Each preset only redefines CSS variables. No component knows a theme exists.
          </p>
          <GlassTabs
            items={THEMES}
            getKey={(t) => t.id}
            label={(t) => t.label}
            value={theme}
            onChange={(t) => setTheme(t.id)}
            aria-label="Theme"
          />
        </section>

        {/* ── Buttons ────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Buttons</div>
          <div className="pg__row">
            <GlassButton variant="solid">Summon</GlassButton>
            <GlassButton>Commune</GlassButton>
            <GlassButton variant="outline">Observe</GlassButton>
            <GlassButton variant="ghost">Dismiss</GlassButton>
            <GlassButton variant="danger">Sever</GlassButton>
          </div>
          <div className="pg__row">
            <GlassButton size="sm">Small</GlassButton>
            <GlassButton size="md" trailing="→">
              Medium
            </GlassButton>
            <GlassButton size="lg" variant="solid">
              Large
            </GlassButton>
            <GlassButton loading>Binding</GlassButton>
            <GlassButton disabled>Forbidden</GlassButton>
            <GlassButton as="a" href="#buttons" variant="outline">
              As a link
            </GlassButton>
          </div>
        </section>

        {/* ── Badges ─────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Badges</div>
          <div className="pg__row">
            <GlassBadge tone="ember" pulse>
              Awake
            </GlassBadge>
            <GlassBadge tone="cinder">Bound</GlassBadge>
            <GlassBadge tone="halo" solid>
              Ascended
            </GlassBadge>
            <GlassBadge tone="success" dot>
              Stable
            </GlassBadge>
            <GlassBadge tone="blood">Fraying</GlassBadge>
            <GlassBadge tone="danger" dot>
              Severed
            </GlassBadge>
            <GlassBadge>Neutral</GlassBadge>
          </div>
        </section>

        {/* ── Cards ──────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Cards</div>
          <div className="pg__grid">
            <GlassCard
              eyebrow="01"
              title="Surface"
              description="The material everything else is cut from. Flat translucent fill, backdrop blur, hairline border, hard shadow."
              aside={<GlassBadge tone="ember">core</GlassBadge>}
              footer={
                <GlassButton size="sm" variant="ghost">
                  Read
                </GlassButton>
              }
            />
            <GlassCard
              elevation="haloed"
              eyebrow="02"
              title="Haloed"
              description="Both registers turned up — a gold arc breaking over the top edge, heat pooling underneath. Hover it."
              interactive
              footer={
                <>
                  <GlassBadge tone="halo" dot>
                    live
                  </GlassBadge>
                  <GlassButton size="sm" variant="outline" style={{ marginLeft: 'auto' }}>
                    Open
                  </GlassButton>
                </>
              }
            />
            <GlassCard
              eyebrow="03"
              title="Dialog"
              description="Portalled, focus-trapped, scroll-locked. Closes on scrim or Escape."
              footer={
                <GlassButton size="sm" variant="solid" onClick={() => setModalOpen(true)}>
                  Open dialog
                </GlassButton>
              }
              dividedFooter
            />
          </div>
        </section>

        {/* ── Data ───────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Data — any array, any shape</div>
          <div className="pg__split">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <GlassList
                items={ACOLYTES}
                getKey={(a) => a.id}
                leading={(a) => <div className="pg__avatar">{initials(a.name)}</div>}
                primary={(a) => a.name}
                secondary={(a) => `${a.rank} · ${a.devotion}% devotion`}
                trailing={(a) => (
                  <GlassBadge tone={STATUS_TONE[a.status]} dot>
                    {a.status}
                  </GlassBadge>
                )}
                isActive={(a) => a.id === selected}
                onSelect={(a) => setSelected(a.id)}
                divided
                aria-label="Acolytes"
              />
              <GlassList items={[]} empty="The order has no members." />
              <GlassList items={[]} loading loadingRows={3} />
            </div>

            <GlassTable
              items={ACOLYTES}
              getKey={(a) => a.id}
              isActive={(a) => a.id === selected}
              onRowClick={(a) => setSelected(a.id)}
              aria-label="Acolyte roster"
              columns={[
                { id: 'name', header: 'Acolyte', cell: (a) => a.name, sortBy: (a) => a.name },
                { id: 'rank', header: 'Rank', cell: (a) => a.rank, sortBy: (a) => a.rank },
                {
                  id: 'devotion',
                  header: 'Devotion',
                  align: 'end',
                  cell: (a) => `${a.devotion}%`,
                  sortBy: (a) => a.devotion,
                },
                {
                  id: 'status',
                  header: 'State',
                  align: 'end',
                  cell: (a) => <GlassBadge tone={STATUS_TONE[a.status]}>{a.status}</GlassBadge>,
                },
              ]}
            />
          </div>
        </section>

        {/* ── Inputs ─────────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Inputs</div>
          <div className="pg__split">
            <GlassInput
              label="Designation"
              placeholder="Speak your name"
              hint="However you wish to be known."
            />
            <GlassInput
              label="Vessel"
              type="email"
              required
              placeholder="you@void.institute"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            <GlassInput label="Sealed" placeholder="Unreachable" disabled />
            <GlassInput label="Sigil" size="sm" placeholder="Small" trailing="⌘K" />
          </div>
          <GlassTextarea
            label="Petition"
            placeholder="State your business with the dark"
            hint="It is listening."
          />
        </section>

        {/* ── Surfaces ───────────────────────────────────────────────── */}
        <section className="pg__section">
          <div className="pg__label">Surfaces</div>
          <div className="pg__grid">
            {(['flush', 'default', 'raised', 'haloed'] as const).map((e) => (
              <GlassSurface
                key={e}
                elevation={e}
                interactive
                style={{ padding: 26, textAlign: 'center' }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e}</div>
                <div className="pg__mono" style={{ marginTop: 6, fontSize: 10 }}>
                  elevation
                </div>
              </GlassSurface>
            ))}
          </div>
        </section>
      </main>

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Bind yourself?"
        description="This cannot be undone by any hand but its own."
        footer={
          <>
            <GlassButton variant="ghost" onClick={() => setModalOpen(false)}>
              Withdraw
            </GlassButton>
            <GlassButton variant="solid" onClick={() => setModalOpen(false)}>
              Accept
            </GlassButton>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          The dialog portals to <code>document.body</code>, traps focus, locks background
          scroll without shifting the page, and returns focus to whatever opened it.
        </p>
      </GlassModal>
    </div>
  );
}
