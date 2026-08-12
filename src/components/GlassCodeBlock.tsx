import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassCodeBlock.css';

export interface GlassCodeBlockProps {
  code: string;
  /** Language label shown in the tab. */
  language?: string;
  /** Filename or title beside the traffic lights. */
  title?: ReactNode;
  /** Show line numbers in a gutter. @default false */
  lineNumbers?: boolean;
  /** Show the copy button. @default true */
  copy?: boolean;
  /** Show the three window dots. @default true */
  dots?: boolean;
  className?: string;
}

/** A code window — traffic lights, a language tab, copy button, optional gutter. */
export function GlassCodeBlock({
  code,
  language,
  title,
  lineNumbers = false,
  copy = true,
  dots = true,
  className,
}: GlassCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, '').split('\n');

  const doCopy = () =>
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  return (
    <div className={cn('ob-code', className)}>
      <div className="ob-code__bar">
        {dots ? (
          <span className="ob-code__dots" aria-hidden="true">
            <i className="ob-code__d ob-code__d--r" />
            <i className="ob-code__d ob-code__d--y" />
            <i className="ob-code__d ob-code__d--g" />
          </span>
        ) : null}
        {title ? <span className="ob-code__title">{title}</span> : null}
        <span className="ob-code__bar-spacer" />
        {language ? <span className="ob-code__lang">{language}</span> : null}
        {copy ? (
          <button type="button" className="ob-code__copy" onClick={doCopy}>
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className={cn('ob-code__body', lineNumbers && 'ob-code__body--numbered')}>
        {lineNumbers ? (
          <div className="ob-code__gutter" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        ) : null}
        <pre className="ob-code__pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
