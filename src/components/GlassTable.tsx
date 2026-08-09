import { useMemo, useState, type Key, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassTable.css';

export interface Column<T> {
  /** Stable id. Also the sort key. */
  id: string;
  /** Header content. Falls back to `id`. */
  header?: ReactNode;
  /** Cell content for a row. */
  cell: (item: T, index: number) => ReactNode;
  /**
   * Comparable value for sorting this column. Provide it to make the column
   * sortable; omit it and the header stays inert.
   */
  sortBy?: (item: T) => string | number | boolean | null | undefined;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
}

export interface GlassTableProps<T> {
  items: readonly T[];
  columns: ReadonlyArray<Column<T>>;
  getKey?: (item: T, index: number) => Key;
  onRowClick?: (item: T, index: number) => void;
  isActive?: (item: T, index: number) => boolean;
  /** Row background on hover. @default true */
  hoverable?: boolean;
  empty?: ReactNode;
  /** Caps height and makes the header stick while the body scrolls. */
  maxHeight?: string | number;
  className?: string;
  'aria-label'?: string;
}

type SortState = { id: string; dir: 'asc' | 'desc' } | null;

/**
 * A generic data table. `columns` describes how to render each field; the
 * table never assumes anything about `T`.
 *
 *   <GlassTable
 *     items={rows}
 *     columns={[
 *       { id: 'name', cell: (r) => r.name, sortBy: (r) => r.name },
 *       { id: 'usage', header: 'Usage', align: 'end', cell: (r) => r.usage },
 *     ]}
 *   />
 *
 * Sorting is client-side and opt-in per column via `sortBy`. For server-side
 * paging or sorting, sort upstream and leave `sortBy` off.
 */
export function GlassTable<T>({
  items,
  columns,
  getKey,
  onRowClick,
  isActive,
  hoverable = true,
  empty = 'No records.',
  maxHeight,
  className,
  'aria-label': ariaLabel,
}: GlassTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const rows = useMemo(() => {
    if (!sort) return items;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortBy) return items;
    const dir = sort.dir === 'asc' ? 1 : -1;

    return [...items].sort((a, b) => {
      const av = col.sortBy!(a);
      const bv = col.sortBy!(b);
      // Nullish always sinks to the bottom, regardless of direction.
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });
  }, [items, columns, sort]);

  const toggleSort = (id: string) => {
    setSort((prev) =>
      prev?.id !== id ? { id, dir: 'asc' } : prev.dir === 'asc' ? { id, dir: 'desc' } : null,
    );
  };

  return (
    <GlassSurface radius="lg" className={className}>
      <div
        className="ob-table-wrap"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
      >
        <table
          className={cn(
            'ob-table',
            hoverable && 'ob-table--hoverable',
            onRowClick && 'ob-table--selectable',
          )}
          aria-label={ariaLabel}
        >
          <thead>
            <tr>
              {columns.map((col) => {
                const sorted = sort?.id === col.id;
                const ariaSort = sorted
                  ? sort.dir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';

                return (
                  <th
                    key={col.id}
                    scope="col"
                    style={{ width: col.width }}
                    className={cn(col.align && col.align !== 'start' && `ob-table__align-${col.align}`)}
                    aria-sort={col.sortBy ? ariaSort : undefined}
                  >
                    {col.sortBy ? (
                      <button
                        type="button"
                        className="ob-table__sort ob-reset-button ob-focusable"
                        data-ob-sorted={sorted}
                        onClick={() => toggleSort(col.id)}
                      >
                        {col.header ?? col.id}
                        <span className="ob-table__caret" aria-hidden="true">
                          {sorted ? (sort.dir === 'asc' ? '▲' : '▼') : '▲'}
                        </span>
                      </button>
                    ) : (
                      (col.header ?? col.id)
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="ob-table__empty">{empty}</div>
                </td>
              </tr>
            ) : (
              rows.map((item, i) => (
                <tr
                  key={getKey?.(item, i) ?? i}
                  data-ob-active={isActive?.(item, i) || undefined}
                  onClick={onRowClick ? () => onRowClick(item, i) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={cn(
                        col.align && col.align !== 'start' && `ob-table__align-${col.align}`,
                      )}
                    >
                      {col.cell(item, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassSurface>
  );
}
