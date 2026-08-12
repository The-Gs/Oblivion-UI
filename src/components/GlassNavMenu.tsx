import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassNavMenu.css';

export interface NavItem {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  /** Trailing slot — a count, a badge, a shortcut. */
  trailing?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface GlassNavMenuProps {
  items: NavItem[];
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  /** Class applied to every item. */
  itemClassName?: string;
  'aria-label'?: string;
}

/** A navigation list of links (or buttons), with an active state. */
export function GlassNavMenu({
  items,
  orientation = 'vertical',
  className,
  itemClassName,
  'aria-label': ariaLabel = 'Navigation',
}: GlassNavMenuProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('ob-nav', `ob-nav--${orientation}`, className)}>
      {items.map((item, i) => {
        const inner = (
          <>
            {item.icon ? <span className="ob-nav__icon">{item.icon}</span> : null}
            <span className="ob-nav__label">{item.label}</span>
            {item.trailing != null ? <span className="ob-nav__trailing">{item.trailing}</span> : null}
          </>
        );
        const cls = cn('ob-nav__item', item.active && 'ob-nav__item--active', itemClassName);
        return item.href && !item.disabled ? (
          <a
            key={i}
            href={item.href}
            className={cls}
            aria-current={item.active ? 'page' : undefined}
            onClick={item.onClick}
          >
            {inner}
          </a>
        ) : (
          <button
            key={i}
            type="button"
            className={cls}
            disabled={item.disabled}
            aria-current={item.active ? 'page' : undefined}
            onClick={item.onClick}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
