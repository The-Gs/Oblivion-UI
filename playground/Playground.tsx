import { useMemo, useState, type ReactNode } from 'react';

/* Control definitions. Each yields one knob in the right-hand panel. */
export type Control =
  | { type: 'select'; key: string; label: string; options: string[]; default: string }
  | { type: 'toggle'; key: string; label: string; default: boolean }
  | {
      type: 'range';
      key: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      unit?: string;
      default: number;
    };

export type Values = Record<string, string | number | boolean>;

export interface PlaygroundProps {
  controls: Control[];
  /** Render the live component from the current values. */
  render: (v: Values) => ReactNode;
  /** Generate the code string shown beneath the stage. */
  code: (v: Values) => string;
}

/**
 * A live component customizer: knobs on the right drive a real component on
 * the stage, and the generated code updates with every change. This is the
 * "try it in our UI" surface — variant, size, opacity, blur, height, etc.
 */
export function Playground({ controls, render, code }: PlaygroundProps) {
  const [v, setV] = useState<Values>(() =>
    Object.fromEntries(controls.map((c) => [c.key, c.default])),
  );
  const [copied, setCopied] = useState(false);
  const snippet = useMemo(() => code(v), [code, v]);

  const set = (key: string, value: string | number | boolean) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const copy = () =>
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });

  return (
    <div className="pg2">
      <div className="pg2__body">
        <div className="pg2__stage">{render(v)}</div>

        <div className="pg2__controls">
          {controls.map((c) => (
            <div className="pg2__ctrl" key={c.key}>
              <div className="pg2__ctrl-label">
                <span>{c.label}</span>
                {c.type === 'range' ? (
                  <span className="pg2__ctrl-val">
                    {v[c.key] as number}
                    {c.unit ?? ''}
                  </span>
                ) : null}
              </div>

              {c.type === 'select' ? (
                <div className="pg2__seg">
                  {c.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      data-on={v[c.key] === opt}
                      onClick={() => set(c.key, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : null}

              {c.type === 'toggle' ? (
                <button
                  type="button"
                  className="pg2__toggle"
                  data-on={Boolean(v[c.key])}
                  onClick={() => set(c.key, !v[c.key])}
                >
                  {v[c.key] ? 'on' : 'off'}
                </button>
              ) : null}

              {c.type === 'range' ? (
                <input
                  className="pg2__range"
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step ?? 1}
                  value={v[c.key] as number}
                  onChange={(e) => set(c.key, Number(e.target.value))}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="pg2__code">
        <pre>{snippet}</pre>
        <button type="button" className="demo__tool" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
