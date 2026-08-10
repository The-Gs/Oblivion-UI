import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import type { Placement } from '../lib/positioning';
import { Floating } from './internal/Floating';
import './GlassMenu.css';

export interface MenuItemConfig {
  key: string;
  label: ReactNode;
  /** Fired on click / Enter / Space. The menu closes afterwards. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Renders in the danger tone. */
  danger?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export interface MenuSeparator {
  key: string;
  separator: true;
}

export type MenuEntry = MenuItemConfig | MenuSeparator;

const isSeparator = (e: MenuEntry): e is MenuSeparator => 'separator' in e && e.separator;

export interface GlassMenuProps {
  /** The clickable element that opens the menu. */
  trigger: ReactNode;
  items: MenuEntry[];
  /** @default 'bottom-start' */
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the menu. */
  label?: string;
  className?: string;
}

/**
 * A dropdown menu: a trigger plus a portalled, keyboard-navigable list of
 * actions. Arrow keys rove, Enter/Space selects, Escape and outside clicks
 * dismiss, and focus returns to the trigger on close.
 */
export function GlassMenu({
  trigger,
  items,
  placement = 'bottom-start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  className,
}: GlassMenuProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const [active, setActive] = useState(0);

  const actionable = items
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => !isSeparator(e) && !(e as MenuItemConfig).disabled);

  const close = useCallback(
    (restoreFocus = true) => {
      setOpen(false);
      if (restoreFocus) {
        const trigger = anchorRef.current?.querySelector<HTMLElement>('button,a,[tabindex]');
        (trigger ?? anchorRef.current)?.focus?.();
      }
    },
    [setOpen],
  );

  // Focus the active item whenever it changes while open.
  useEffect(() => {
    if (!open) return;
    itemRefs.current[active]?.focus();
  }, [open, active]);

  // On open, start at the first actionable item.
  useEffect(() => {
    if (open) setActive(actionable[0]?.i ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const moveTo = (dir: 1 | -1) => {
    const order = actionable.map((a) => a.i);
    if (order.length === 0) return;
    const current = order.indexOf(active);
    const next = current === -1 ? 0 : (current + dir + order.length) % order.length;
    setActive(order[next]!);
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveTo(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveTo(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActive(actionable[0]?.i ?? 0);
        break;
      case 'End':
        e.preventDefault();
        setActive(actionable[actionable.length - 1]?.i ?? 0);
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const select = (item: MenuItemConfig) => {
    if (item.disabled) return;
    item.onSelect?.();
    close();
  };

  return (
    <>
      <span
        ref={anchorRef}
        className={cn('ob-menu__anchor', className)}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </span>

      <Floating
        open={open}
        onClose={() => close()}
        anchorRef={anchorRef}
        placement={placement}
        role="menu"
        id={menuId}
        aria-label={label}
        className="ob-menu ob-surface ob-surface--raised"
      >
        <div className="ob-menu__list" onKeyDown={onPanelKeyDown}>
          {items.map((entry, i) =>
            isSeparator(entry) ? (
              <div key={entry.key} className="ob-menu__sep" role="separator" />
            ) : (
              <button
                key={entry.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={i === active ? 0 : -1}
                disabled={entry.disabled}
                className={cn(
                  'ob-menu__item',
                  'ob-reset-button',
                  entry.danger && 'ob-menu__item--danger',
                )}
                onClick={() => select(entry)}
                onMouseEnter={() => !entry.disabled && setActive(i)}
              >
                {entry.leading ? (
                  <span className="ob-menu__affix" aria-hidden="true">
                    {entry.leading}
                  </span>
                ) : null}
                <span className="ob-menu__label">{entry.label}</span>
                {entry.trailing ? (
                  <span className="ob-menu__affix ob-menu__affix--end" aria-hidden="true">
                    {entry.trailing}
                  </span>
                ) : null}
              </button>
            ),
          )}
        </div>
      </Floating>
    </>
  );
}

export { GlassMenu as GlassDropdown };
