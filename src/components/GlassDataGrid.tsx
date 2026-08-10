import {
  useMemo,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassDataGrid.css';

export interface DataGridColumn<T> {
  id: string;
  header: ReactNode;
  /** Read the display value for a row. */
  accessor: (row: T) => ReactNode;
  /** Sort key. Omit to make the column unsortable. */
  sortBy?: (row: T) => string | number;
  align?: 'start' | 'end' | 'center';
  /** Starting width in px. @default 160 */
  width?: number;
  /** Enable inline editing for this column; receives the new string value. */
  onEdit?: (row: T, value: string) => void;
  /** Read the editable raw value (defaults to String(accessor)). */
  editValue?: (row: T) => string;
}

export interface GlassDataGridProps<T> {
  rows: readonly T[];
  columns: DataGridColumn<T>[];
  getKey: (row: T, index: number) => Key;
  /** Enable drag-to-reorder on headers. @default true */
  reorderable?: boolean;
  /** Enable drag-to-resize on column edges. @default true */
  resizable?: boolean;
  className?: string;
  'aria-label'?: string;
}

type SortState = { colId: string; dir: 'asc' | 'desc' } | null;

/**
 * A feature-rich data grid: click headers to sort, drag headers to reorder
 * columns, drag the edge handles to resize, and (for columns with `onEdit`)
 * double-click a cell to edit it inline. All state is internal except the
 * edits, which flow out through `onEdit`.
 */
export function GlassDataGrid<T>({
  rows,
  columns,
  getKey,
  reorderable = true,
  resizable = true,
  className,
  'aria-label': ariaLabel,
}: GlassDataGridProps<T>) {
  // Column order + widths are internal UI state, keyed by column id.
  const [order, setOrder] = useState<string[]>(() => columns.map((c) => c.id));
  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(columns.map((c) => [c.id, c.width ?? 160])),
  );
  const [sort, setSort] = useState<SortState>(null);
  const [editing, setEditing] = useState<{ rowKey: Key; colId: string } | null>(null);
  const [dragCol, setDragCol] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const byId = useMemo(() => Object.fromEntries(columns.map((c) => [c.id, c])), [columns]);
  const orderedCols = order.map((id) => byId[id]).filter(Boolean) as DataGridColumn<T>[];

  // ── Sorting ──────────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = byId[sort.colId];
    if (!col?.sortBy) return rows;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortBy!(a);
      const bv = col.sortBy!(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sort, byId]);

  const toggleSort = (col: DataGridColumn<T>) => {
    if (!col.sortBy) return;
    setSort((prev) =>
      prev?.colId === col.id
        ? prev.dir === 'asc'
          ? { colId: col.id, dir: 'desc' }
          : null
        : { colId: col.id, dir: 'asc' },
    );
  };

  // ── Reorder (native HTML5 drag on headers) ─────────────────────────────
  const onDrop = (targetId: string) => {
    if (!dragCol || dragCol === targetId) return;
    setOrder((prev) => {
      const next = prev.filter((id) => id !== dragCol);
      const at = next.indexOf(targetId);
      next.splice(at, 0, dragCol);
      return next;
    });
    setDragCol(null);
    setDropTarget(null);
  };

  // ── Resize (pointer drag on the edge handle) ───────────────────────────
  const resizeRef = useRef<{ id: string; startX: number; startW: number } | null>(null);

  const startResize = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { id, startX: e.clientX, startW: widths[id] ?? 160 };
    const move = (ev: PointerEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const w = Math.max(64, r.startW + (ev.clientX - r.startX));
      setWidths((prev) => ({ ...prev, [r.id]: w }));
    };
    const up = () => {
      resizeRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const template = orderedCols.map((c) => `${widths[c.id] ?? 160}px`).join(' ');

  return (
    <GlassSurface className={cn('ob-grid-x', className)}>
      <div className="ob-grid-x__scroll" role="table" aria-label={ariaLabel}>
        {/* Header */}
        <div className="ob-grid-x__row ob-grid-x__row--head" role="row" style={{ gridTemplateColumns: template }}>
          {orderedCols.map((col) => {
            const sorted = sort?.colId === col.id ? sort.dir : null;
            return (
              <div
                key={col.id}
                role="columnheader"
                aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                className={cn(
                  'ob-grid-x__cell',
                  'ob-grid-x__cell--head',
                  col.align && `ob-grid-x__cell--${col.align}`,
                  dropTarget === col.id && 'ob-grid-x__cell--drop',
                  dragCol === col.id && 'ob-grid-x__cell--dragging',
                )}
                draggable={reorderable}
                onDragStart={() => reorderable && setDragCol(col.id)}
                onDragOver={(e) => {
                  if (!reorderable || !dragCol) return;
                  e.preventDefault();
                  setDropTarget(col.id);
                }}
                onDragLeave={() => setDropTarget((t) => (t === col.id ? null : t))}
                onDrop={() => onDrop(col.id)}
                onDragEnd={() => {
                  setDragCol(null);
                  setDropTarget(null);
                }}
              >
                {reorderable ? (
                  <span className="ob-grid-x__grip" aria-hidden="true">
                    ⠿
                  </span>
                ) : null}
                <button
                  type="button"
                  className={cn('ob-grid-x__htext ob-reset-button', col.sortBy && 'ob-grid-x__htext--sortable')}
                  onClick={() => toggleSort(col)}
                >
                  {col.header}
                  {col.sortBy ? (
                    <span className="ob-grid-x__sort" aria-hidden="true">
                      {sorted === 'asc' ? '▲' : sorted === 'desc' ? '▼' : '↕'}
                    </span>
                  ) : null}
                </button>
                {resizable ? (
                  <span
                    className="ob-grid-x__resize"
                    role="separator"
                    aria-orientation="vertical"
                    onPointerDown={(e) => startResize(e, col.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Body */}
        {sortedRows.map((row, i) => {
          const rowKey = getKey(row, i);
          return (
            <div key={rowKey} role="row" className="ob-grid-x__row" style={{ gridTemplateColumns: template }}>
              {orderedCols.map((col) => {
                const isEditing = editing?.rowKey === rowKey && editing?.colId === col.id;
                return (
                  <div
                    key={col.id}
                    role="cell"
                    className={cn(
                      'ob-grid-x__cell',
                      col.align && `ob-grid-x__cell--${col.align}`,
                      col.onEdit && 'ob-grid-x__cell--editable',
                    )}
                    onDoubleClick={() => col.onEdit && setEditing({ rowKey, colId: col.id })}
                    title={col.onEdit ? 'Double-click to edit' : undefined}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        className="ob-grid-x__edit"
                        defaultValue={col.editValue ? col.editValue(row) : String(col.accessor(row) ?? '')}
                        onBlur={(e) => {
                          col.onEdit?.(row, e.target.value);
                          setEditing(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            col.onEdit?.(row, (e.target as HTMLInputElement).value);
                            setEditing(null);
                          } else if (e.key === 'Escape') {
                            setEditing(null);
                          }
                        }}
                      />
                    ) : (
                      col.accessor(row)
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </GlassSurface>
  );
}
