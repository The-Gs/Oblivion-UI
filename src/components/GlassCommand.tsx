import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useOnEscape, usePortal, useScrollLock } from '../lib/hooks';
import './GlassCommand.css';

export interface CommandItem {
  id: string;
  label: ReactNode;
  /** Plain text used for filtering; falls back to `label` when it's a string. */
  keywords?: string;
  hint?: ReactNode;
  icon?: ReactNode;
  group?: string;
  onSelect?: () => void;
}

export interface GlassCommandProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  /** Fired on selection (after the item's own `onSelect`). */
  onSelect?: (item: CommandItem) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  className?: string;
}

function textOf(item: CommandItem): string {
  if (item.keywords) return item.keywords;
  return typeof item.label === 'string' ? item.label : '';
}

/**
 * A ⌘K-style command palette: a filterable, keyboard-driven list on the modal
 * overlay plate. Arrow keys move the active row, Enter selects, Escape closes.
 */
export function GlassCommand({
  open,
  onClose,
  items,
  onSelect,
  placeholder = 'Type a command or search…',
  emptyText = 'No results',
  className,
}: GlassCommandProps) {
  const container = usePortal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useScrollLock(open);
  useOnEscape(open, onClose);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => textOf(it).toLowerCase().includes(q));
  }, [items, query]);

  // Reset on open; keep the active row in range as results shrink.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [query]);

  if (!open || !container) return null;

  const choose = (item?: CommandItem) => {
    if (!item) return;
    item.onSelect?.();
    onSelect?.(item);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active]);
    }
  };

  return createPortal(
    <div className="ob-cmd" onKeyDown={onKeyDown}>
      <div className="ob-cmd__scrim" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={cn('ob-cmd__panel', className)}
      >
        <div className="ob-cmd__search">
          <span className="ob-cmd__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            className="ob-cmd__input"
            value={query}
            placeholder={placeholder}
            spellCheck={false}
            role="combobox"
            aria-expanded="true"
            aria-controls="ob-cmd-list"
            aria-activedescendant={results[active] ? `ob-cmd-${results[active]!.id}` : undefined}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <ul id="ob-cmd-list" role="listbox" className="ob-cmd__list">
          {results.length === 0 ? (
            <li className="ob-cmd__empty">{emptyText}</li>
          ) : (
            results.map((it, i) => (
              <li
                key={it.id}
                id={`ob-cmd-${it.id}`}
                role="option"
                aria-selected={i === active}
                className="ob-cmd__item"
                data-active={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(it)}
              >
                {it.icon ? <span className="ob-cmd__item-icon">{it.icon}</span> : null}
                <span className="ob-cmd__item-label">{it.label}</span>
                {it.hint ? <span className="ob-cmd__item-hint">{it.hint}</span> : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    container,
  );
}
