import { useMemo, useState, type DragEvent, type PointerEvent } from 'react';
import { GlassButton, GlassModal } from '../../src';
import { BLOCK_GROUPS, BLOCK_MAP, BLOCKS, FONTS, type Props } from './blocks';
import '../builder.css';

interface Node {
  id: string;
  type: string;
  props: Props;
  /** Share of its row's width. Siblings' flex weights are relative. */
  flex: number;
}
interface Row {
  id: string;
  items: Node[];
}

let counter = 0;
const uid = (p = 'n') => `${p}${counter++}`;

const newNode = (type: string): Node => ({ id: uid(), type, props: { ...BLOCK_MAP[type]!.defaults }, flex: 1 });
const row = (...types: string[]): Row => ({ id: uid('r'), items: types.map(newNode) });

/** A starter composition, including one two-up row to show columns. */
function seed(): Row[] {
  const r = [
    row('header'),
    row('heading'),
    row('text'),
    row('card', 'card'),
  ];
  r[1]!.items[0]!.props = { ...r[1]!.items[0]!.props, text: 'Build your page in glass', size: '3xl', align: 'center' };
  r[2]!.items[0]!.props = { ...r[2]!.items[0]!.props, text: 'Drag blocks in, drop them side by side, and drag the handle between them to squeeze widths.', align: 'center' };
  return r;
}

const DND = 'text/plain';

export function Builder() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [font, setFont] = useState<string>('default');
  const [width, setWidth] = useState<number>(760);
  const [gap, setGap] = useState<number>(20);
  const [dropHint, setDropHint] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fontStack = FONTS.find((f) => f.id === font)?.stack ?? '';

  const findItem = (id: string): Node | null => {
    for (const r of rows) for (const it of r.items) if (it.id === id) return it;
    return null;
  };
  const selected = selectedId ? findItem(selectedId) : null;

  /* ── Mutations (all immutable, empty rows are pruned) ───────────────── */
  const prune = (rs: Row[]) => rs.filter((r) => r.items.length > 0);

  const detach = (rs: Row[], id: string): [Row[], Node | null] => {
    let found: Node | null = null;
    const next = rs.map((r) => ({
      ...r,
      items: r.items.filter((it) => {
        if (it.id === id) {
          found = it;
          return false;
        }
        return true;
      }),
    }));
    return [next, found];
  };

  const addToRow = (rowId: string, type: string) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, items: [...r.items, newNode(type)] } : r)));
  };
  const addAsRow = (index: number, type: string) => {
    setRows((prev) => {
      const next = [...prev];
      next.splice(index, 0, row(type));
      return next;
    });
  };

  const moveToRow = (id: string, rowId: string) => {
    setRows((prev) => {
      const [without, node] = detach(prev, id);
      if (!node) return prev;
      return prune(without.map((r) => (r.id === rowId ? { ...r, items: [...r.items, node] } : r)));
    });
  };
  const moveAsRow = (id: string, index: number) => {
    setRows((prev) => {
      const [without, node] = detach(prev, id);
      if (!node) return prev;
      // Account for rows removed before the insert point.
      const removedBefore = prev.slice(0, index).length - without.slice(0, index).length;
      const next = [...without];
      next.splice(Math.max(0, index - removedBefore), 0, { id: uid('r'), items: [node] });
      return prune(next);
    });
  };

  const reorderWithin = (id: string, dir: -1 | 1) => {
    setRows((prev) =>
      prev.map((r) => {
        const i = r.items.findIndex((it) => it.id === id);
        if (i === -1) return r;
        const j = i + dir;
        if (j < 0 || j >= r.items.length) return r;
        const items = [...r.items];
        [items[i], items[j]] = [items[j]!, items[i]!];
        return { ...r, items };
      }),
    );
  };

  const remove = (id: string) => {
    setRows((prev) => prune(detach(prev, id)[0]));
    if (selectedId === id) setSelectedId(null);
  };

  const update = (id: string, key: string, value: string | number | boolean) =>
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        items: r.items.map((it) => (it.id === id ? { ...it, props: { ...it.props, [key]: value } } : it)),
      })),
    );

  const setFlex = (id: string, flex: number) =>
    setRows((prev) => prev.map((r) => ({ ...r, items: r.items.map((it) => (it.id === id ? { ...it, flex } : it)) })));

  /* ── Drag & drop ────────────────────────────────────────────────────── */
  const payload = (e: DragEvent) => e.dataTransfer.getData(DND);

  const onDropRow = (rowId: string) => (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropHint(null);
    const data = payload(e);
    if (data.startsWith('new:')) addToRow(rowId, data.slice(4));
    else if (data.startsWith('move:')) moveToRow(data.slice(5), rowId);
  };

  const onDropStrip = (index: number) => (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropHint(null);
    const data = payload(e);
    if (data.startsWith('new:')) addAsRow(index, data.slice(4));
    else if (data.startsWith('move:')) moveAsRow(data.slice(5), index);
  };

  const over = (hint: string) => (e: DragEvent) => {
    e.preventDefault();
    setDropHint(hint);
  };

  /* ── Resize: squeeze widths of two adjacent items ───────────────────── */
  const startResize = (e: PointerEvent, r: Row, leftIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const rowEl = (e.currentTarget as HTMLElement).closest('.bld__row') as HTMLElement | null;
    const rowWidth = rowEl?.getBoundingClientRect().width ?? 1;
    const left = r.items[leftIdx]!;
    const right = r.items[leftIdx + 1]!;
    const startX = e.clientX;
    const lF = left.flex;
    const rF = right.flex;
    const pair = lF + rF;

    const move = (ev: globalThis.PointerEvent) => {
      const ratio = (ev.clientX - startX) / rowWidth;
      const shift = ratio * pair;
      const nl = Math.max(0.2, Math.min(pair - 0.2, lF + shift));
      setRows((prev) =>
        prev.map((rr) =>
          rr.id === r.id
            ? {
                ...rr,
                items: rr.items.map((it) =>
                  it.id === left.id ? { ...it, flex: nl } : it.id === right.id ? { ...it, flex: pair - nl } : it,
                ),
              }
            : rr,
        ),
      );
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  /* ── Code generation ────────────────────────────────────────────────── */
  const code = useMemo(() => {
    const imports = new Set<string>();
    rows.forEach((r) => r.items.forEach((it) => BLOCK_MAP[it.type]?.imports.forEach((i) => imports.add(i))));
    const importLine = imports.size ? `import { ${[...imports].sort().join(', ')} } from 'oblivion-ui';\n` : '';
    const ind = (s: string, n: number) => s.split('\n').map((l) => ' '.repeat(n) + l).join('\n');

    const body = rows
      .map((r) => {
        if (r.items.length === 1) return ind(BLOCK_MAP[r.items[0]!.type]!.toCode(r.items[0]!.props), 6);
        const cols = r.items
          .map((it) => {
            const jsx = BLOCK_MAP[it.type]!.toCode(it.props);
            return ind(`<div style={{ flex: ${+it.flex.toFixed(2)} }}>\n${ind(jsx, 2)}\n</div>`, 8);
          })
          .join('\n');
        return `${' '.repeat(6)}<div style={{ display: 'flex', gap: 16 }}>\n${cols}\n${' '.repeat(6)}</div>`;
      })
      .join('\n');

    const wrapStyle = `{ display: 'flex', flexDirection: 'column', gap: ${gap}, maxWidth: ${width}, margin: '0 auto'${
      fontStack ? `, fontFamily: '${fontStack}'` : ''
    } }`;
    return `${importLine}import 'oblivion-ui/styles.css';\n\nexport default function Page() {\n  return (\n    <div style={${wrapStyle}}>\n${body}\n    </div>\n  );\n}\n`;
  }, [rows, gap, width, fontStack]);

  const copy = () =>
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  const totalBlocks = rows.reduce((n, r) => n + r.items.length, 0);

  return (
    <div className="bld">
      {/* ── Palette ─────────────────────────────────────────────────── */}
      <aside className="bld__palette">
        <div className="bld__panel-title">Blocks</div>
        {BLOCK_GROUPS.map((group) => (
          <div className="bld__pal-group" key={group}>
            <div className="bld__pal-group-title">{group}</div>
            {BLOCKS.filter((b) => b.group === group).map((b) => (
              <div
                key={b.type}
                className="bld__pal-item"
                draggable
                onDragStart={(e) => e.dataTransfer.setData(DND, `new:${b.type}`)}
                onClick={() => setRows((prev) => [...prev, row(b.type)])}
                title={`Add ${b.label}`}
              >
                <span className="bld__pal-grip" aria-hidden="true">⠿</span>
                {b.label}
                <span className="bld__pal-add" aria-hidden="true">+</span>
              </div>
            ))}
          </div>
        ))}
        <p className="bld__hint" style={{ marginTop: 8 }}>
          Drop onto a row to place blocks side by side. Drop on a line between rows for a new row.
        </p>
      </aside>

      {/* ── Canvas ──────────────────────────────────────────────────── */}
      <main className="bld__stage">
        <div className="bld__toolbar">
          <span className="bld__count">{totalBlocks} blocks · {rows.length} rows</span>
          <div className="bld__toolbar-actions">
            <GlassButton size="sm" variant="ghost" onClick={() => { setRows([]); setSelectedId(null); }}>
              Clear
            </GlassButton>
            <GlassButton size="sm" variant="ghost" onClick={() => setRows(seed())}>
              Reset
            </GlassButton>
            <GlassButton size="sm" variant="primary" onClick={() => setCodeOpen(true)}>
              {'</> Copy page code'}
            </GlassButton>
          </div>
        </div>

        <div className="bld__canvas-scroll">
          <div className="bld__canvas" style={{ maxWidth: width, gap, fontFamily: fontStack || undefined }}>
            {/* top strip */}
            <div
              className={'bld__strip' + (dropHint === 'strip:0' ? ' bld__strip--over' : '')}
              onDragOver={over('strip:0')}
              onDragLeave={() => setDropHint(null)}
              onDrop={onDropStrip(0)}
            />

            {rows.length === 0 ? <div className="bld__empty">Drag a block here, or click one in the palette.</div> : null}

            {rows.map((r, ri) => (
              <div key={r.id}>
                <div
                  className={'bld__row' + (dropHint === `row:${r.id}` ? ' bld__row--over' : '')}
                  style={{ gap: 0 }}
                  onDragOver={over(`row:${r.id}`)}
                  onDragLeave={() => setDropHint(null)}
                  onDrop={onDropRow(r.id)}
                >
                  {r.items.map((node, ii) => {
                    const def = BLOCK_MAP[node.type]!;
                    return (
                      <div key={node.id} className="bld__cell" style={{ flex: `${node.flex} 1 0` }}>
                        {ii > 0 ? (
                          <span
                            className="bld__resizer"
                            title="Drag to resize"
                            onPointerDown={(e) => startResize(e, r, ii - 1)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null}
                        <div
                          className={'bld__node' + (node.id === selectedId ? ' bld__node--selected' : '')}
                          onClick={() => setSelectedId(node.id)}
                        >
                          <div className="bld__node-bar">
                            <span
                              className="bld__node-grip"
                              title="Drag to move"
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData(DND, `move:${node.id}`)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⠿ {def.label}
                            </span>
                            <span className="bld__node-ctrls">
                              <button type="button" className="bld__node-btn" aria-label="Move left" disabled={ii === 0}
                                onClick={(e) => { e.stopPropagation(); reorderWithin(node.id, -1); }}>
                                ←
                              </button>
                              <button type="button" className="bld__node-btn" aria-label="Move right" disabled={ii === r.items.length - 1}
                                onClick={(e) => { e.stopPropagation(); reorderWithin(node.id, 1); }}>
                                →
                              </button>
                              <button type="button" className="bld__node-btn bld__node-btn--del" aria-label={`Delete ${def.label}`}
                                onClick={(e) => { e.stopPropagation(); remove(node.id); }}>
                                ✕
                              </button>
                            </span>
                          </div>
                          <div className="bld__node-body">{def.render(node.props)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* strip below this row */}
                <div
                  className={'bld__strip' + (dropHint === `strip:${ri + 1}` ? ' bld__strip--over' : '')}
                  onDragOver={over(`strip:${ri + 1}`)}
                  onDragLeave={() => setDropHint(null)}
                  onDrop={onDropStrip(ri + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Inspector ───────────────────────────────────────────────── */}
      <aside className="bld__inspector">
        <div className="bld__panel-title">Page</div>
        <div className="bld__field">
          <label className="bld__field-label">Font</label>
          <select className="bld__select" value={font} onChange={(e) => setFont(e.target.value)}>
            {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
        <div className="bld__field">
          <label className="bld__field-label">Width <span className="bld__field-val">{width}px</span></label>
          <input className="bld__range" type="range" min={360} max={1100} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </div>
        <div className="bld__field">
          <label className="bld__field-label">Gap <span className="bld__field-val">{gap}px</span></label>
          <input className="bld__range" type="range" min={0} max={48} value={gap} onChange={(e) => setGap(Number(e.target.value))} />
        </div>

        <div className="bld__divider" />

        {selected ? (
          <>
            <div className="bld__panel-title">{BLOCK_MAP[selected.type]!.label}</div>
            <div className="bld__field">
              <label className="bld__field-label">Width in row <span className="bld__field-val">{selected.flex.toFixed(1)}×</span></label>
              <input className="bld__range" type="range" min={0.5} max={4} step={0.1} value={selected.flex}
                onChange={(e) => setFlex(selected.id, Number(e.target.value))} />
            </div>
            {BLOCK_MAP[selected.type]!.fields.map((f) => (
              <div className="bld__field" key={f.key}>
                <label className="bld__field-label">
                  {f.label}
                  {f.type === 'range' ? <span className="bld__field-val">{String(selected.props[f.key])}{f.unit ?? ''}</span> : null}
                </label>
                {f.type === 'text' ? (
                  <input className="bld__input" value={String(selected.props[f.key] ?? '')} onChange={(e) => update(selected.id, f.key, e.target.value)} />
                ) : null}
                {f.type === 'select' ? (
                  <select className="bld__select" value={String(selected.props[f.key])} onChange={(e) => update(selected.id, f.key, e.target.value)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : null}
                {f.type === 'toggle' ? (
                  <button type="button" className="bld__toggle" data-on={Boolean(selected.props[f.key])} onClick={() => update(selected.id, f.key, !selected.props[f.key])}>
                    {selected.props[f.key] ? 'on' : 'off'}
                  </button>
                ) : null}
                {f.type === 'range' ? (
                  <input className="bld__range" type="range" min={f.min} max={f.max} step={f.step ?? 1} value={Number(selected.props[f.key])} onChange={(e) => update(selected.id, f.key, Number(e.target.value))} />
                ) : null}
              </div>
            ))}
          </>
        ) : (
          <p className="bld__hint">Select a block on the canvas to edit it.</p>
        )}
      </aside>

      <GlassModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        size="lg"
        title="Your page"
        description="A complete component for the composition on the canvas, with the imports it needs."
        footer={
          <>
            <GlassButton variant="ghost" size="sm" onClick={() => setCodeOpen(false)}>Close</GlassButton>
            <GlassButton variant="primary" size="sm" onClick={copy}>{copied ? 'Copied ✓' : 'Copy code'}</GlassButton>
          </>
        }
      >
        <pre className="pg-css">{code}</pre>
      </GlassModal>
    </div>
  );
}
