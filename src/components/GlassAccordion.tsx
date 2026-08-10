import { useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { GlassSurface } from './GlassSurface';
import './GlassAccordion.css';

export interface AccordionItemConfig {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GlassAccordionProps {
  items: AccordionItemConfig[];
  /** Allow several panels open at once. @default false */
  multiple?: boolean;
  /** Controlled set of open keys. */
  value?: string[];
  /** Initial open keys (uncontrolled). */
  defaultValue?: string[];
  onChange?: (openKeys: string[]) => void;
  className?: string;
}

/**
 * A stack of collapsible panels on glass. Single-open by default; pass
 * `multiple` to let several stay open. Each header is a real button, wired
 * with `aria-expanded` / `aria-controls`.
 */
export function GlassAccordion({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onChange,
  className,
}: GlassAccordionProps) {
  const [open, setOpen] = useControllableState<string[]>(value, defaultValue, onChange);
  const baseId = useId();

  const toggle = (key: string) => {
    const isOpen = open.includes(key);
    if (multiple) {
      setOpen(isOpen ? open.filter((k) => k !== key) : [...open, key]);
    } else {
      setOpen(isOpen ? [] : [key]);
    }
  };

  return (
    <GlassSurface className={cn('ob-accordion', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.key);
        const btnId = `${baseId}-${i}-btn`;
        const panelId = `${baseId}-${i}-panel`;
        return (
          <div className="ob-accordion__item" key={item.key}>
            <h3 className="ob-accordion__heading">
              <button
                id={btnId}
                type="button"
                className="ob-accordion__trigger ob-reset-button ob-focusable"
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.key)}
              >
                <span className="ob-accordion__title">{item.title}</span>
                <span className={cn('ob-accordion__chevron', isOpen && 'ob-accordion__chevron--open')} aria-hidden="true">
                  ⌄
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn('ob-accordion__panel', isOpen && 'ob-accordion__panel--open')}
              hidden={!isOpen}
            >
              <div className="ob-accordion__content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </GlassSurface>
  );
}

/** Standalone single collapsible, for one-off use outside an accordion. */
export interface GlassCollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function GlassCollapsible({ title, children, defaultOpen = false, className }: GlassCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <GlassSurface className={cn('ob-accordion', className)}>
      <div className="ob-accordion__item">
        <h3 className="ob-accordion__heading">
          <button
            type="button"
            className="ob-accordion__trigger ob-reset-button ob-focusable"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="ob-accordion__title">{title}</span>
            <span className={cn('ob-accordion__chevron', open && 'ob-accordion__chevron--open')} aria-hidden="true">
              ⌄
            </span>
          </button>
        </h3>
        <div id={id} className={cn('ob-accordion__panel', open && 'ob-accordion__panel--open')} hidden={!open}>
          <div className="ob-accordion__content">{children}</div>
        </div>
      </div>
    </GlassSurface>
  );
}
