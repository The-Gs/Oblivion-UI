import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassStatusBar.css';

export type StatusTone = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export interface StatusSegment {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
  tone?: StatusTone;
  onClick?: () => void;
  title?: string;
}

export interface GlassStatusBarProps {
  /** Left-aligned segments. */
  left?: StatusSegment[];
  /** Right-aligned segments. */
  right?: StatusSegment[];
  className?: string;
}

/** An editor-style status bar — grouped, tinted segments (branch, errors, position…). */
export function GlassStatusBar({ left = [], right = [], className }: GlassStatusBarProps) {
  const seg = (s: StatusSegment) => {
    const Tag = s.onClick ? 'button' : 'span';
    return (
      <Tag
        key={s.key}
        {...(s.onClick ? { type: 'button' as const, onClick: s.onClick } : {})}
        className={cn('ob-status__seg', `ob-status__seg--${s.tone ?? 'default'}`, s.onClick && 'ob-status__seg--btn')}
        title={s.title}
      >
        {s.icon ? <span className="ob-status__icon">{s.icon}</span> : null}
        {s.label}
      </Tag>
    );
  };

  return (
    <div className={cn('ob-status', className)}>
      <div className="ob-status__group">{left.map(seg)}</div>
      <div className="ob-status__group">{right.map(seg)}</div>
    </div>
  );
}
