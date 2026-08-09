import type { Key, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassList.css';

/** Pulls a renderable value out of a row. */
export type Accessor<T, R = ReactNode> = (item: T, index: number) => R;

export interface GlassListProps<T> {
  /** The data. Anything — the list never inspects its shape. */
  items: readonly T[];
  /** Stable identity per row. Falls back to the array index. */
  getKey?: (item: T, index: number) => Key;

  /** Main line of text. */
  primary?: Accessor<T>;
  /** Supporting line beneath `primary`. */
  secondary?: Accessor<T>;
  /** Left slot — avatar, icon, index number. */
  leading?: Accessor<T>;
  /** Right slot — timestamp, badge, chevron. */
  trailing?: Accessor<T>;

  /**
   * Full control over a row's interior. When given, the accessors above are
   * ignored and you render whatever you like.
   */
  renderItem?: Accessor<T>;

  /** Makes rows clickable and fires with the row's data. */
  onSelect?: (item: T, index: number) => void;
  /** Marks a row as current. */
  isActive?: (item: T, index: number) => boolean;

  /** Hairline between rows instead of gaps. @default false */
  divided?: boolean;
  /** Shown when `items` is empty. @default 'Nothing here.' */
  empty?: ReactNode;
  /** Renders shimmer placeholders instead of rows. */
  loading?: boolean;
  /** Placeholder count while loading. @default 4 */
  loadingRows?: number;
  /** Drop the glass panel and render bare rows. @default false */
  bare?: boolean;

  className?: string;
  'aria-label'?: string;
}

/**
 * Renders any array as a list of glass rows.
 *
 * Point the accessors at your fields and it handles layout, truncation,
 * selection, empty, and loading states:
 *
 *   <GlassList
 *     items={users}
 *     getKey={(u) => u.id}
 *     primary={(u) => u.name}
 *     secondary={(u) => u.email}
 *     onSelect={(u) => open(u)}
 *   />
 *
 * For anything the accessors can't express, use `renderItem`.
 */
export function GlassList<T>({
  items,
  getKey,
  primary,
  secondary,
  leading,
  trailing,
  renderItem,
  onSelect,
  isActive,
  divided = false,
  empty = 'Nothing here.',
  loading = false,
  loadingRows = 4,
  bare = false,
  className,
  'aria-label': ariaLabel,
}: GlassListProps<T>) {
  const selectable = Boolean(onSelect);

  const body = loading ? (
    <ul className="ob-list" aria-busy="true" aria-label={ariaLabel}>
      {Array.from({ length: loadingRows }, (_, i) => (
        <li key={i} className="ob-list__row">
          <div className="ob-skeleton" style={{ width: 30, height: 30 }} />
          <div className="ob-list__text">
            <div className="ob-skeleton" style={{ width: `${55 + ((i * 13) % 30)}%`, height: 10 }} />
            <div
              className="ob-skeleton"
              style={{ width: `${32 + ((i * 17) % 24)}%`, height: 8, marginTop: 7 }}
            />
          </div>
        </li>
      ))}
    </ul>
  ) : items.length === 0 ? (
    <div className="ob-list__empty">{empty}</div>
  ) : (
    <ul className="ob-list" aria-label={ariaLabel}>
      {items.map((item, i) => {
        const active = isActive?.(item, i) ?? false;
        const content = renderItem ? (
          renderItem(item, i)
        ) : (
          <>
            {leading ? <div className="ob-list__lead">{leading(item, i)}</div> : null}
            <div className="ob-list__text">
              {primary ? <div className="ob-list__primary">{primary(item, i)}</div> : null}
              {secondary ? <div className="ob-list__secondary">{secondary(item, i)}</div> : null}
            </div>
            {trailing ? <div className="ob-list__trail">{trailing(item, i)}</div> : null}
          </>
        );

        const rowClass = cn(
          'ob-list__row',
          selectable && 'ob-list__row--selectable',
          active && 'ob-list__row--active',
          divided && 'ob-list__row--divided',
        );

        return (
          <li key={getKey?.(item, i) ?? i}>
            {selectable ? (
              <button
                type="button"
                className={cn(rowClass, 'ob-reset-button', 'ob-focusable')}
                aria-current={active || undefined}
                onClick={() => onSelect?.(item, i)}
              >
                {content}
              </button>
            ) : (
              <div className={rowClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (bare) return <div className={className}>{body}</div>;

  return (
    <GlassSurface radius="lg" className={className}>
      {body}
    </GlassSurface>
  );
}
