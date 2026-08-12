import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import {
  addDays,
  addMonths,
  clampDate,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  monthGrid,
  startOfDay,
  startOfMonth,
  toISODate,
  weekdayNames,
} from '../lib/date';
import { useControllableState } from '../lib/hooks';
import './GlassCalendar.css';

/** Class names for each part of the calendar. */
export interface CalendarClasses {
  root?: string;
  head?: string;
  /** Both month-stepping arrows. */
  nav?: string;
  /** The "August 2026" caption. */
  month?: string;
  grid?: string;
  row?: string;
  weekday?: string;
  day?: string;
  foot?: string;
  today?: string;
}

/** The state of one day cell, handed to `renderDay` and `dayClassName`. */
export interface DayState {
  date: Date;
  /** This is the selected day. */
  selected: boolean;
  /** This is today. */
  today: boolean;
  /** This day belongs to the previous or next month. */
  outside: boolean;
  disabled: boolean;
}

/** What {@link GlassCalendarProps.header} is handed when it is a function. */
export interface CalendarHeaderArgs {
  month: Date;
  /** The formatted caption, e.g. "August 2026". */
  monthLabel: string;
  goToMonth: (month: Date) => void;
  goPrev: () => void;
  goNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

export interface GlassCalendarProps {
  /** Selected day, or `null`. Omit for an uncontrolled calendar. */
  value?: Date | null;
  /** Starting selection when uncontrolled. @default null */
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** Visible month. Uncontrolled unless paired with `onMonthChange`. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Inclusive bounds. Days outside them are unselectable. */
  min?: Date;
  max?: Date;
  /** Disable individual days — weekends, holidays, booked slots. */
  isDisabled?: (date: Date) => boolean;
  /** 0 = Sunday … 6 = Saturday. @default 1 (Monday) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 tag for month and weekday names. Defaults to the runtime locale. */
  locale?: string;
  /** Show the "Today" shortcut under the grid. @default true */
  showToday?: boolean;
  /** Text on that shortcut. @default 'Today' */
  todayLabel?: ReactNode;
  /** Render days from the neighbouring months. @default true */
  showOutsideDays?: boolean;
  /** Always draw six week rows so the height never changes. @default true */
  fixedWeeks?: boolean;
  /** Replace the caption and arrows entirely — month and year dropdowns, say. */
  header?: ReactNode | ((args: CalendarHeaderArgs) => ReactNode);
  /** Full control over a day cell's interior — dots, prices, availability. */
  renderDay?: (state: DayState) => ReactNode;
  /** Extra class on a day cell, by date. */
  dayClassName?: (state: DayState) => string | undefined;
  /** The caption above the grid. @default the locale's "month year" */
  formatMonth?: (month: Date) => string;
  /** Width of the weekday column headers. @default 'short' */
  weekdayFormat?: 'narrow' | 'short' | 'long';
  /** Override a weekday heading. */
  formatWeekday?: (name: string, index: number) => ReactNode;
  /** The number inside a day cell. @default the day of the month */
  formatDay?: (date: Date) => ReactNode;
  /** A day's accessible name. @default the locale's full date */
  formatDayLabel?: (date: Date) => string;
  /** Extra content under the grid — a Clear button, a time field. */
  footer?: ReactNode;
  className?: string;
  classNames?: CalendarClasses;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * A month grid with the standard date-grid keyboard contract: arrows move a
 * day at a time, Home/End jump to the ends of the week, PageUp/PageDown
 * change month, Shift+PageUp/PageDown change year, Enter or Space selects.
 *
 * A roving tabindex means the grid is a single tab stop. The visible month
 * follows the focused day, so arrowing off the edge pages the calendar.
 */
export function GlassCalendar({
  value: valueProp,
  defaultValue = null,
  onChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  isDisabled,
  weekStartsOn = 1,
  locale,
  showToday = true,
  todayLabel = 'Today',
  showOutsideDays = true,
  fixedWeeks = true,
  header,
  renderDay,
  dayClassName,
  formatMonth,
  weekdayFormat = 'short',
  formatWeekday,
  formatDay,
  formatDayLabel,
  footer,
  className,
  classNames,
  style,
  'aria-label': ariaLabel,
}: GlassCalendarProps) {
  const gridId = useId();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [value, setValue] = useControllableState<Date | null>(
    valueProp,
    defaultValue,
    onChange as ((v: Date | null) => void) | undefined,
  );

  const [month, setMonth] = useControllableState<Date>(
    monthProp,
    startOfMonth(defaultMonth ?? valueProp ?? defaultValue ?? today),
    onMonthChange,
  );

  // The day the roving tabindex sits on. Only actually focused after a
  // keyboard move, so mounting the calendar never steals focus.
  const [cursor, setCursor] = useState<Date>(() => clampDate(value ?? today, min, max));
  const shouldFocus = useRef(false);
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const dayDisabled = useCallback(
    (date: Date) =>
      (min !== undefined && isBefore(date, min)) ||
      (max !== undefined && isAfter(date, max)) ||
      (isDisabled?.(date) ?? false),
    [min, max, isDisabled],
  );

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    cellRefs.current.get(toISODate(cursor))?.focus();
  }, [cursor]);

  /** Move the cursor, pulling the visible month along with it. */
  const moveTo = useCallback(
    (date: Date) => {
      const next = clampDate(date, min, max);
      shouldFocus.current = true;
      setCursor(next);
      if (!isSameMonth(next, month)) setMonth(startOfMonth(next));
    },
    [min, max, month, setMonth],
  );

  const goMonth = (delta: number) => {
    const next = startOfMonth(addMonths(month, delta));
    setMonth(next);
    // Keep the cursor inside the month on screen so Tab lands somewhere real.
    setCursor((c) => clampDate(addMonths(c, delta), min, max));
  };

  const select = (date: Date) => {
    if (dayDisabled(date)) return;
    setCursor(date);
    if (!isSameMonth(date, month)) setMonth(startOfMonth(date));
    setValue(date);
  };

  const onKeyDown = (e: React.KeyboardEvent, date: Date) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveTo(addDays(date, -1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveTo(addDays(date, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveTo(addDays(date, -7));
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveTo(addDays(date, 7));
        break;
      case 'Home':
        e.preventDefault();
        moveTo(addDays(date, -((date.getDay() - weekStartsOn + 7) % 7)));
        break;
      case 'End':
        e.preventDefault();
        moveTo(addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7)));
        break;
      case 'PageUp':
        e.preventDefault();
        moveTo(addMonths(date, e.shiftKey ? -12 : -1));
        break;
      case 'PageDown':
        e.preventDefault();
        moveTo(addMonths(date, e.shiftKey ? 12 : 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(date);
        break;
    }
  };

  const days = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const weekdays = useMemo(
    () => weekdayNames(weekStartsOn, locale, weekdayFormat),
    [weekStartsOn, locale, weekdayFormat],
  );

  /** Six rows by default; trimmed to the weeks this month touches otherwise. */
  const weeks = useMemo(() => {
    const all = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));
    return fixedWeeks ? all : all.filter((week) => week.some((d) => isSameMonth(d, month)));
  }, [days, fixedWeeks, month]);

  const monthLabel = useMemo(
    () =>
      formatMonth?.(month) ??
      new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month),
    [month, locale, formatMonth],
  );
  const dayLabel = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }), [locale]);

  // Paging past a bound is pointless — grey the arrow out instead.
  const prevBlocked = min !== undefined && isBefore(addDays(startOfMonth(month), -1), min);
  const nextBlocked = max !== undefined && isAfter(startOfMonth(addMonths(month, 1)), max);

  const headerArgs: CalendarHeaderArgs = {
    month,
    monthLabel,
    goToMonth: (m) => setMonth(startOfMonth(m)),
    goPrev: () => goMonth(-1),
    goNext: () => goMonth(1),
    prevDisabled: prevBlocked,
    nextDisabled: nextBlocked,
  };

  return (
    <div className={cn('ob-cal', className, classNames?.root)} style={style}>
      {header !== undefined ? (
        typeof header === 'function' ? (
          header(headerArgs)
        ) : (
          header
        )
      ) : (
        <div className={cn('ob-cal__head', classNames?.head)}>
          <button
            type="button"
            className={cn('ob-cal__nav', 'ob-reset-button', classNames?.nav)}
            aria-label="Previous month"
            disabled={prevBlocked}
            onClick={() => goMonth(-1)}
          >
            ‹
          </button>
          <div
            className={cn('ob-cal__month', classNames?.month)}
            id={`${gridId}-label`}
            aria-live="polite"
          >
            {monthLabel}
          </div>
          <button
            type="button"
            className={cn('ob-cal__nav', 'ob-reset-button', classNames?.nav)}
            aria-label="Next month"
            disabled={nextBlocked}
            onClick={() => goMonth(1)}
          >
            ›
          </button>
        </div>
      )}

      <div
        role="grid"
        aria-labelledby={`${gridId}-label`}
        aria-label={ariaLabel}
        className={cn('ob-cal__grid', classNames?.grid)}
      >
        <div role="row" className={cn('ob-cal__row', 'ob-cal__row--head', classNames?.row)}>
          {weekdays.map((name, i) => (
            <abbr
              key={name}
              role="columnheader"
              className={cn('ob-cal__wd', classNames?.weekday)}
              title={name}
            >
              {formatWeekday ? formatWeekday(name, i) : name}
            </abbr>
          ))}
        </div>

        {weeks.map((week, w) => (
          <div role="row" className={cn('ob-cal__row', classNames?.row)} key={w}>
            {week.map((date) => {
              const iso = toISODate(date);
              const outside = !isSameMonth(date, month);

              if (outside && !showOutsideDays) {
                return <span key={iso} className="ob-cal__day ob-cal__day--blank" role="gridcell" />;
              }

              const state: DayState = {
                date,
                selected: isSameDay(date, value),
                today: isSameDay(date, today),
                outside,
                disabled: dayDisabled(date),
              };

              return (
                <button
                  key={iso}
                  ref={(el) => {
                    if (el) cellRefs.current.set(iso, el);
                    else cellRefs.current.delete(iso);
                  }}
                  type="button"
                  role="gridcell"
                  // One tab stop for the whole grid; arrows do the rest.
                  tabIndex={isSameDay(date, cursor) ? 0 : -1}
                  disabled={state.disabled}
                  aria-selected={state.selected}
                  aria-current={state.today ? 'date' : undefined}
                  aria-label={formatDayLabel?.(date) ?? dayLabel.format(date)}
                  data-outside={outside || undefined}
                  className={cn(
                    'ob-cal__day',
                    'ob-reset-button',
                    state.selected && 'ob-cal__day--on',
                    state.today && 'ob-cal__day--today',
                    classNames?.day,
                    dayClassName?.(state),
                  )}
                  onClick={() => select(date)}
                  onKeyDown={(e) => onKeyDown(e, date)}
                >
                  {renderDay ? renderDay(state) : (formatDay?.(date) ?? date.getDate())}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {showToday || footer ? (
        <div className={cn('ob-cal__foot', classNames?.foot)}>
          {showToday ? (
            <button
              type="button"
              className={cn('ob-cal__today', 'ob-reset-button', classNames?.today)}
              disabled={dayDisabled(today)}
              onClick={() => {
                setMonth(startOfMonth(today));
                select(today);
              }}
            >
              {todayLabel}
            </button>
          ) : null}
          {footer}
        </div>
      ) : null}
    </div>
  );
}
