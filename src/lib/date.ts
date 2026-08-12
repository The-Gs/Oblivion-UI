/**
 * Local-date helpers. Everything here works on a Date's local calendar
 * fields, never on its UTC timestamp — a date picker that reasons in UTC
 * shows the wrong day for half the world.
 */

/** Midnight, local time, on the same calendar day. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(date: Date, days: number): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Add months, clamping the day so Jan 31 + 1 lands on Feb 28 rather than
 * rolling over into March, which is what `setMonth` alone would do.
 */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = daysInMonth(target);
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date: Date): number {
  // Day 0 of the next month is the last day of this one.
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Clamp to an inclusive range, ignoring the time of day. */
export function clampDate(date: Date, min?: Date, max?: Date): Date {
  const d = startOfDay(date);
  if (min && d < startOfDay(min)) return startOfDay(min);
  if (max && d > startOfDay(max)) return startOfDay(max);
  return d;
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

/** `YYYY-MM-DD` in local time — safe as a key, an input value, or a form field. */
export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Parse `YYYY-MM-DD` as a local date. Returns `null` on anything else. */
export function fromISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  // Rejects 2025-02-31, which the constructor would happily roll forward.
  return date.getMonth() === Number(m) - 1 && date.getDate() === Number(d) ? date : null;
}

/**
 * The 6×7 day grid for a month, including the leading and trailing days that
 * complete the first and last weeks. Always 42 cells, so the calendar never
 * changes height between months.
 */
export function monthGrid(month: Date, weekStartsOn: number): Date[] {
  const first = startOfMonth(month);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** Localized weekday names, rotated to start on `weekStartsOn`. */
export function weekdayNames(
  weekStartsOn: number,
  locale?: string,
  format: 'short' | 'narrow' | 'long' = 'short',
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: format });
  // 2024-01-07 was a Sunday, giving a stable base for every weekday index.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))),
  );
}
