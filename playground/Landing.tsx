import { useState } from 'react';
import {
  GlassBadge,
  GlassButton,
  GlassSlider,
  GlassSurface,
  Orbs,
  useToast,
} from '../src';
import { Wordmark } from './Wordmark';

const TRACK_SECONDS = 342;

const mmss = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

const FEATURES = [
  {
    icon: '◆',
    title: 'Works on any backdrop',
    body: 'Every component carries its own blur and edge light, so it reads on photos, video, dark and light pages alike.',
  },
  {
    icon: '~',
    title: 'Liquid motion, one spring',
    body: 'A single overshoot curve — cubic-bezier(0.34, 1.56, 0.64, 1) — drives every hover, toggle and modal. Consistent, never busy.',
  },
  {
    icon: '▢',
    title: 'Zero gradients, zero deps',
    body: 'Flat translucent fills and hairline borders only. Ships as plain React with one stylesheet — no theme provider required.',
  },
];

export function Landing({ onNavigate }: { onNavigate: (page: 'components') => void }) {
  const { toast } = useToast();
  const [seek, setSeek] = useState(38);
  const [playing, setPlaying] = useState(true);

  const elapsed = Math.round((TRACK_SECONDS * seek) / 100);

  return (
    <div className="pg">
      <Orbs palette="midnight" />

      <div className="pg__inner">
        <GlassSurface as="nav" radius="lg" className="pg-nav">
          <Wordmark />
          <div className="pg-nav__links">
            <a
              className="pg-nav__link"
              href="#components"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('components');
              }}
            >
              Components
            </a>
            <span className="pg-nav__link">Docs</span>
            <span className="pg-nav__link">Motion</span>
            <GlassButton
              variant="primary"
              size="sm"
              style={{ marginLeft: 8 }}
              onClick={() => toast('Welcome — start with the component sheet')}
            >
              Get started
            </GlassButton>
          </div>
        </GlassSurface>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header className="pg-hero">
          <GlassBadge variant="neutral" mono>
            REACT · 18 COMPONENTS · 0 DEPENDENCIES
          </GlassBadge>
          <h1 className="pg-hero__title">
            Glass that moves like <em>liquid</em>.
          </h1>
          <p className="pg-hero__lede">
            Frosted React components with oxblood accents and spring-loaded motion. Drop them
            on any page — dark, light, or full-bleed imagery — and they stay legible.
          </p>
          <div className="pg-hero__actions">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => {
                void navigator.clipboard?.writeText('npm install obsidian-ui').catch(() => {});
                toast('Copied install command');
              }}
            >
              npm install obsidian-ui
            </GlassButton>
            <GlassButton
              as="a"
              href="#components"
              variant="secondary"
              size="lg"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onNavigate('components');
              }}
            >
              Browse components
            </GlassButton>
          </div>
        </header>

        {/* ── Live demo ─────────────────────────────────────────────── */}
        <GlassSurface as="section" radius="2xl" elevation="raised" className="pg-demo">
          <div className="pg-demo__copy">
            <h2 className="pg-demo__title">Every surface is real glass</h2>
            <p className="pg-demo__body">
              No gradient fakery — flat translucent fills, backdrop blur, and a single brighter
              top edge for the specular catch. This player is composed entirely of ObsidianUI
              parts.
            </p>
            <div className="pg-chips">
              {['GlassCard', 'GlassSlider', 'GlassButton', 'GlassBadge'].map((c) => (
                <GlassBadge key={c} variant="status" mono>
                  {c}
                </GlassBadge>
              ))}
            </div>
          </div>

          <GlassSurface radius="lg" elevation="overlay" className="pg-player">
            <div className="pg-player__head">
              <div className="pg-player__art">
                art
                <br />
                drop
              </div>
              <div className="pg-player__meta">
                <strong className="pg-player__track">Blackwater Roll</strong>
                <span className="pg-player__sub">Substrata · 176 BPM</span>
              </div>
              <div className="pg-eq" data-paused={!playing} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <GlassSlider
              value={seek}
              onChange={setSeek}
              format={null}
              aria-label="Seek"
            />

            <div className="pg-player__transport">
              <span className="pg-player__time">{mmss(elapsed)}</span>
              <GlassButton
                variant="icon"
                size="lg"
                noSpin
                aria-label={playing ? 'Pause' : 'Play'}
                onClick={() => setPlaying((p) => !p)}
                style={{ background: 'rgb(179 31 51 / 0.5)' }}
              >
                {playing ? '❚❚' : '▶'}
              </GlassButton>
              <span className="pg-player__time">{mmss(TRACK_SECONDS)}</span>
            </div>
          </GlassSurface>
        </GlassSurface>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section className="pg-features">
          {FEATURES.map((f) => (
            <GlassSurface key={f.title} interactive className="pg-feature">
              <div className="pg-feature__icon" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="pg-feature__title">{f.title}</h3>
              <p className="pg-feature__body">{f.body}</p>
            </GlassSurface>
          ))}
        </section>

        {/* ── Install ───────────────────────────────────────────────── */}
        <section className="pg-install">
          <h2 className="pg-install__title">Start in ten seconds</h2>
          <GlassSurface radius="lg" elevation="well" className="pg-install__row">
            <code className="pg-install__code">
              <b>$</b> npm install obsidian-ui
            </code>
            <GlassButton
              variant="quiet"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText('npm install obsidian-ui').catch(() => {});
                toast('Copied to clipboard', { tone: 'neutral', duration: 1800 });
              }}
            >
              Copy
            </GlassButton>
          </GlassSurface>
          <a
            href="#components"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('components');
            }}
          >
            See all 18 components →
          </a>
        </section>

        <footer className="pg-foot">
          <span className="pg-foot__note">OBSIDIAN UI · demo landing · mockup</span>
          <a
            href="#components"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('components');
            }}
          >
            Component sheet
          </a>
        </footer>
      </div>
    </div>
  );
}
