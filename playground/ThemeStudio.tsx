import { useEffect, useRef, useState } from 'react';
import { GlassButton } from '../src';
import {
  applyStudio,
  DEFAULT_STUDIO,
  FEELS,
  FEEL_PRESET,
  FONTS,
  PRESETS,
  resetStudio,
  seedFromComputed,
  toStudioCss,
  type Feel,
  type InkMode,
  type StudioState,
} from './studioModel';

const STORE_KEY = 'ob-studio';
const PRESETS_KEY = 'ob-studio-presets';

interface SavedPreset {
  name: string;
  state: StudioState;
}

function load(): StudioState {
  if (typeof window === 'undefined') return DEFAULT_STUDIO;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return { ...DEFAULT_STUDIO, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt/blocked storage */
  }
  return DEFAULT_STUDIO;
}

function loadPresets(): SavedPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PRESETS_KEY);
    if (raw) return JSON.parse(raw) as SavedPreset[];
  } catch {
    /* ignore */
  }
  return [];
}

/**
 * Theme Studio — a slide-in panel that retheme the whole kit live by writing
 * `--ob-*` overrides onto <html>. Colour, gradient, material feel, roundness,
 * density and blur; copy the result as a drop-in CSS block.
 */
export function ThemeStudio() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<StudioState>(load);
  const [copied, setCopied] = useState(false);
  const [presets, setPresets] = useState<SavedPreset[]>(loadPresets);
  const [presetName, setPresetName] = useState('');
  const seeded = useRef(false);

  // Re-apply on every change; persist so the look survives a reload.
  useEffect(() => {
    applyStudio(s);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s]);

  // The dropdown theme and the Studio are mutually exclusive sources: when a
  // preset is picked there, drop our overrides so the two never overlap.
  useEffect(() => {
    const clear = () => {
      seeded.current = false;
      setS((prev) => (prev.enabled ? { ...prev, enabled: false } : prev));
    };
    window.addEventListener('ob:theme-picked', clear);
    return () => window.removeEventListener('ob:theme-picked', clear);
  }, []);

  const set = <K extends keyof StudioState>(key: K, val: StudioState[K]) =>
    setS((prev) => ({ ...prev, [key]: val }));

  const enable = () => {
    // First time on, seed colours from whatever base theme is showing.
    setS((prev) => {
      const next = prev.enabled ? prev : seeded.current ? prev : seedFromComputed(prev);
      seeded.current = true;
      return { ...next, enabled: !prev.enabled };
    });
  };

  const pickFeel = (feel: Feel) => setS((prev) => ({ ...prev, feel, ...FEEL_PRESET[feel] }));

  const applyPreset = (patch: Partial<StudioState>) => {
    seeded.current = true;
    setS((prev) => ({ ...prev, ...patch, enabled: true }));
  };

  const persistPresets = (next: SavedPreset[]) => {
    setPresets(next);
    try {
      window.localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const saveCurrent = () => {
    const name = presetName.trim();
    if (!name) return;
    const next = [...presets.filter((p) => p.name !== name), { name, state: { ...s, enabled: true } }];
    persistPresets(next);
    setPresetName('');
  };

  const deletePreset = (name: string) => persistPresets(presets.filter((p) => p.name !== name));

  const reset = () => {
    seeded.current = false;
    resetStudio();
    setS({ ...DEFAULT_STUDIO });
  };

  const copy = () => {
    const css = toStudioCss({ ...s, enabled: true });
    navigator.clipboard?.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const disabled = !s.enabled;
  const footGrad = s.gradient
    ? `linear-gradient(${s.gradAngle}deg, ${s.gradFrom}, ${s.gradTo})`
    : `linear-gradient(135deg, ${s.accent}, ${s.bg})`;

  return (
    <>
      <GlassButton variant="ghost" size="sm" onClick={() => setOpen(true)}>
        ✦ Studio
      </GlassButton>

      {open ? (
        <>
          <div className="studio__scrim" onClick={() => setOpen(false)} />
          <aside className="studio" role="dialog" aria-label="Theme Studio">
            <header className="studio__head">
              <div>
                <div className="studio__title">Theme Studio</div>
                <div className="studio__sub">Retheme the whole kit — live</div>
              </div>
              <button className="studio__x" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </header>

            <label className="studio__master">
              <span>
                <strong>Custom theme</strong>
                <small>Layer these controls over the active preset</small>
              </span>
              <button
                className="studio__sw"
                role="switch"
                aria-checked={s.enabled}
                data-on={s.enabled}
                onClick={enable}
              >
                <span />
              </button>
            </label>

            <div className="studio__body" data-off={disabled}>
              {/* ── Presets ────────────────────────────────────────────── */}
              <Section label="Presets">
                <div className="studio__presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      className="studio__preset"
                      onClick={() => applyPreset(p.patch)}
                      title={p.hint}
                    >
                      <span
                        className="studio__preset-chip"
                        style={{ background: p.patch.accent, borderColor: p.patch.bg }}
                      />
                      <strong>{p.label}</strong>
                      <small>{p.hint}</small>
                    </button>
                  ))}
                </div>
                {presets.length ? (
                  <div className="studio__saved">
                    {presets.map((p) => (
                      <span key={p.name} className="studio__saved-chip">
                        <button className="studio__saved-apply" onClick={() => applyPreset(p.state)}>
                          {p.name}
                        </button>
                        <button
                          className="studio__saved-del"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => deletePreset(p.name)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="studio__save-row">
                  <input
                    className="studio__hex"
                    placeholder="Save current as…"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveCurrent()}
                  />
                  <GlassButton variant="secondary" size="sm" onClick={saveCurrent} disabled={!presetName.trim()}>
                    Save
                  </GlassButton>
                </div>
              </Section>

              {/* ── Colour ─────────────────────────────────────────────── */}
              <Section label="Color">
                <Swatch label="Accent" value={s.accent} onChange={(v) => set('accent', v)} />
                <Swatch label="Background" value={s.bg} onChange={(v) => set('bg', v)} />
                <Field label="Text color">
                  <Segmented<InkMode>
                    value={s.ink}
                    onChange={(v) => set('ink', v)}
                    options={[
                      { id: 'auto', label: 'Auto' },
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                      { id: 'custom', label: 'Custom' },
                    ]}
                  />
                </Field>
                {s.ink === 'custom' ? (
                  <Swatch label="Text" value={s.inkColor} onChange={(v) => set('inkColor', v)} />
                ) : null}
              </Section>

              {/* ── Typography ─────────────────────────────────────────── */}
              <Section label="Typography">
                <div className="studio__fonts">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      className="studio__font"
                      data-on={s.font === f.id}
                      style={f.stack ? { fontFamily: f.stack } : undefined}
                      onClick={() => set('font', f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── Feel ───────────────────────────────────────────────── */}
              <Section label="Feel">
                <div className="studio__feels">
                  {FEELS.map((f) => (
                    <button
                      key={f.id}
                      className="studio__feel"
                      data-on={s.feel === f.id}
                      onClick={() => pickFeel(f.id)}
                      title={f.hint}
                    >
                      <strong>{f.label}</strong>
                      <small>{f.hint}</small>
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── Shape ──────────────────────────────────────────────── */}
              <Section label="Shape & spacing">
                <Range
                  label="Corners"
                  lo="Sharp"
                  hi="Rounded"
                  min={0}
                  max={26}
                  value={s.radius}
                  suffix="px"
                  onChange={(v) => set('radius', v)}
                />
                <Range
                  label="Density"
                  lo="Compact"
                  hi="Airy"
                  min={0.7}
                  max={1.3}
                  step={0.01}
                  value={s.density}
                  format={(v) => `${v.toFixed(2)}×`}
                  onChange={(v) => set('density', v)}
                />
                <Range
                  label="Blur"
                  lo="None"
                  hi="Frosted"
                  min={0}
                  max={40}
                  value={s.blur}
                  suffix="px"
                  onChange={(v) => set('blur', v)}
                />
              </Section>

              {/* ── Gradient ───────────────────────────────────────────── */}
              <Section label="Gradient">
                <label className="studio__row studio__row--toggle">
                  <span>Use a gradient</span>
                  <button
                    className="studio__sw"
                    role="switch"
                    aria-checked={s.gradient}
                    data-on={s.gradient}
                    onClick={() => set('gradient', !s.gradient)}
                  >
                    <span />
                  </button>
                </label>
                {s.gradient ? (
                  <div className="studio__grad">
                    <div className="studio__grad-swatches">
                      <Swatch label="From" value={s.gradFrom} onChange={(v) => set('gradFrom', v)} />
                      <Swatch label="To" value={s.gradTo} onChange={(v) => set('gradTo', v)} />
                    </div>
                    <Field label="Applies to">
                      <Segmented
                        value={s.gradTarget}
                        onChange={(v) => set('gradTarget', v)}
                        options={[
                          { id: 'page', label: 'Page' },
                          { id: 'surface', label: 'Surfaces' },
                        ]}
                      />
                    </Field>
                    <Range
                      label="Angle"
                      lo="0°"
                      hi="360°"
                      min={0}
                      max={360}
                      value={s.gradAngle}
                      suffix="°"
                      onChange={(v) => set('gradAngle', v)}
                    />
                    <div
                      className="studio__grad-preview"
                      style={{ backgroundImage: `linear-gradient(${s.gradAngle}deg, ${s.gradFrom}, ${s.gradTo})` }}
                    />
                  </div>
                ) : null}
              </Section>

              {/* ── Semantic colours ───────────────────────────────────── */}
              <Section label="Semantic colors">
                <Swatch label="Success" value={s.success} onChange={(v) => set('success', v)} />
                <Swatch label="Warning" value={s.warning} onChange={(v) => set('warning', v)} />
                <Swatch label="Danger" value={s.danger} onChange={(v) => set('danger', v)} />
              </Section>

              {/* ── Borders & surface ──────────────────────────────────── */}
              <Section label="Borders & surface">
                <Range
                  label="Border width"
                  lo="Hairline"
                  hi="Bold"
                  min={0}
                  max={4}
                  step={0.5}
                  value={s.borderW}
                  suffix="px"
                  onChange={(v) => set('borderW', v)}
                />
                <Range
                  label="Saturation"
                  lo="Muted"
                  hi="Vivid"
                  min={100}
                  max={220}
                  value={s.glassSat}
                  suffix="%"
                  onChange={(v) => set('glassSat', v)}
                />
                <Range
                  label="Tracking"
                  lo="Tight"
                  hi="Wide"
                  min={0}
                  max={5}
                  step={0.5}
                  value={s.tracking}
                  suffix="px"
                  onChange={(v) => set('tracking', v)}
                />
              </Section>

              {/* ── Motion ─────────────────────────────────────────────── */}
              <Section label="Motion">
                <Range
                  label="Speed"
                  lo="Instant"
                  hi="Languid"
                  min={0}
                  max={2}
                  step={0.05}
                  value={s.motion}
                  format={(v) => (v === 0 ? 'off' : `${v.toFixed(2)}×`)}
                  onChange={(v) => set('motion', v)}
                />
                <Range
                  label="Hover lift"
                  lo="Flat"
                  hi="Springy"
                  min={0}
                  max={10}
                  value={s.lift}
                  suffix="px"
                  onChange={(v) => set('lift', v)}
                />
                <label className="studio__row studio__row--toggle">
                  <span>Overshoot (springy curve)</span>
                  <button
                    className="studio__sw"
                    role="switch"
                    aria-checked={s.spring}
                    data-on={s.spring}
                    onClick={() => set('spring', !s.spring)}
                  >
                    <span />
                  </button>
                </label>
              </Section>
            </div>

            <footer className="studio__foot">
              <div className="studio__foot-grad" style={{ backgroundImage: footGrad }}>
                <span>{s.gradient ? `${s.gradAngle}° gradient` : 'accent → background'}</span>
              </div>
              <div className="studio__foot-actions">
                <GlassButton variant="ghost" size="sm" onClick={reset}>
                  Reset
                </GlassButton>
                <GlassButton variant="primary" size="sm" onClick={copy} disabled={disabled}>
                  {copied ? 'Copied ✓' : '{ } Copy CSS'}
                </GlassButton>
              </div>
            </footer>
          </aside>
        </>
      ) : null}
    </>
  );
}

/* ── Small control primitives (native inputs, styled in docs.css) ─────── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="studio__section">
      <div className="studio__section-label">{label}</div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="studio__field">
      <div className="studio__field-label">{label}</div>
      {children}
    </div>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="studio__swatch">
      <span className="studio__swatch-chip" style={{ background: value }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      </span>
      <span className="studio__swatch-meta">
        <small>{label}</small>
        <input
          className="studio__hex"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="studio__seg">
      {options.map((o) => (
        <button key={o.id} data-on={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Range({
  label,
  lo,
  hi,
  min,
  max,
  step = 1,
  value,
  suffix,
  format,
  onChange,
}: {
  label: string;
  lo: string;
  hi: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="studio__range">
      <div className="studio__field-label">
        <span>{label}</span>
        <em>{format ? format(value) : `${value}${suffix ?? ''}`}</em>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="studio__range-ends">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}
