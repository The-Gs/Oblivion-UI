/**
 * Tiny, dependency-free anchored positioning for menus, popovers, and
 * tooltips. Given the trigger's rect and the floating panel's size, it returns
 * viewport coordinates for `position: fixed`, flipping to the opposite side
 * when the preferred side would overflow and clamping to stay on screen.
 *
 * Deliberately not Floating UI: the library ships zero runtime dependencies.
 */

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${Align}`;

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  left: number;
  top: number;
  /** The side actually used after any flip — handy for arrow/animation. */
  side: Side;
}

interface Options {
  /** @default 'bottom-start' */
  placement?: Placement;
  /** Gap between trigger and panel, in px. @default 6 */
  offset?: number;
  /** Viewport inset kept clear when clamping, in px. @default 8 */
  padding?: number;
}

function parse(placement: Placement): { side: Side; align: Align } {
  const [side, align] = placement.split('-') as [Side, Align | undefined];
  return { side, align: align ?? (side === 'top' || side === 'bottom' ? 'start' : 'center') };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function computePosition(anchor: DOMRect, panel: Size, options: Options = {}): Position {
  const { placement = 'bottom-start', offset = 6, padding = 8 } = options;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let { side } = parse(placement);
  const { align } = parse(placement);

  // Flip to the opposite side if the preferred one doesn't fit.
  const room = {
    top: anchor.top,
    bottom: vh - anchor.bottom,
    left: anchor.left,
    right: vw - anchor.right,
  };
  const need = side === 'top' || side === 'bottom' ? panel.height : panel.width;
  const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  if (room[side] < need + offset && room[opposite[side]] > room[side]) {
    side = opposite[side];
  }

  let left = 0;
  let top = 0;

  if (side === 'bottom' || side === 'top') {
    top = side === 'bottom' ? anchor.bottom + offset : anchor.top - panel.height - offset;
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.right - panel.width;
    else left = anchor.left + anchor.width / 2 - panel.width / 2;
  } else {
    left = side === 'right' ? anchor.right + offset : anchor.left - panel.width - offset;
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.bottom - panel.height;
    else top = anchor.top + anchor.height / 2 - panel.height / 2;
  }

  left = clamp(left, padding, Math.max(padding, vw - panel.width - padding));
  top = clamp(top, padding, Math.max(padding, vh - panel.height - padding));

  return { left, top, side };
}
