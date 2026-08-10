import { useState, type ReactNode } from 'react';

export interface DemoProps {
  title?: ReactNode;
  desc?: ReactNode;
  /** Optional code snippet, revealed by the </> toggle. */
  code?: string;
  /** Center the preview instead of left-aligning. */
  center?: boolean;
  /** Stack children vertically and stretch them. */
  stack?: boolean;
  children: ReactNode;
}

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/** A framed component preview: header with a </> code toggle, a canvas with a
 *  soft backdrop so glass reads, and a copyable code block. */
export function Demo({ title, desc, code, center, stack, children }: DemoProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div className="demo">
      {title || desc || code ? (
        <div className="demo__head">
          <div>
            {title ? <div className="demo__t">{title}</div> : null}
            {desc ? <div className="demo__d">{desc}</div> : null}
          </div>
          {code ? (
            <div className="demo__tools">
              {showCode ? (
                <button type="button" className="demo__tool" onClick={copy}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              ) : null}
              <button
                type="button"
                className={cx('demo__tool', showCode && 'demo__tool--on')}
                aria-pressed={showCode}
                title="Show code"
                onClick={() => setShowCode((s) => !s)}
              >
                {'</>'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={cx('demo__canvas', center && 'demo__canvas--center', stack && 'demo__canvas--stack')}>
        {children}
      </div>

      {code && showCode ? (
        <div className="demo__code">
          <pre>{code}</pre>
        </div>
      ) : null}
    </div>
  );
}
