import { useState } from 'react';
import { GlassButton, GlassMenu, GlassModal, THEMES, useTheme } from '../src';
import { exportThemeCss } from './themeCss';

/**
 * Top-bar theme controls for the docs: a theme dropdown (dogfoods GlassMenu),
 * a light/dark toggle for Minimal, and a "Copy CSS" action that snapshots the
 * live theme tokens into a copy-pasteable block.
 */
export function ThemeSwitcher() {
  const { theme, setTheme, resolvedMode, setMode } = useTheme();
  const [cssOpen, setCssOpen] = useState(false);
  const [css, setCss] = useState('');
  const [copied, setCopied] = useState(false);
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0]!;

  const openCss = () => {
    // Read after the current paint so any just-applied theme is reflected.
    requestAnimationFrame(() => {
      setCss(exportThemeCss(`[data-ob-theme='${theme}']`));
      setCssOpen(true);
      setCopied(false);
    });
  };

  const copy = () =>
    navigator.clipboard?.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  return (
    <div className="pg-theme-switch">
      <GlassMenu
        label="Theme"
        placement="bottom-end"
        trigger={
          <GlassButton variant="secondary" size="sm">
            Theme · {current.label} ▾
          </GlassButton>
        }
        items={THEMES.map((t) => ({
          key: t.id,
          label: t.label,
          trailing: t.id === theme ? '✓' : undefined,
          onSelect: () => setTheme(t.id),
        }))}
      />

      {theme === 'minimal' ? (
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => setMode(resolvedMode === 'light' ? 'dark' : 'light')}
        >
          {resolvedMode === 'light' ? '☀' : '☾'}
        </GlassButton>
      ) : null}

      <GlassButton variant="ghost" size="sm" onClick={openCss}>
        {'{ } CSS'}
      </GlassButton>

      <GlassModal
        open={cssOpen}
        onClose={() => setCssOpen(false)}
        size="lg"
        title={`${current.label} theme`}
        description="Every resolved design token for the active theme. Paste into your stylesheet to lift the whole look."
        footer={
          <>
            <GlassButton variant="ghost" size="sm" onClick={() => setCssOpen(false)}>
              Close
            </GlassButton>
            <GlassButton variant="primary" size="sm" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy CSS'}
            </GlassButton>
          </>
        }
      >
        <pre className="pg-css">{css}</pre>
      </GlassModal>
    </div>
  );
}
