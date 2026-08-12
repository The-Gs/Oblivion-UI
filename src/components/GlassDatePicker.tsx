import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { toISODate } from '../lib/date';
import { useControllableState } from '../lib/hooks';
import { FieldLabel, FieldNote, useFieldIds } from './GlassField';
import { GlassCalendar, type GlassCalendarProps } from './GlassCalendar';
import { Floating } from './internal/Floating';
import type { Placement } from '../lib/positioning';
import './GlassInput.css';
import './GlassSelect.css';
import './GlassDatePicker.css';

/** Class names for each part of the control. */
export interface DatePickerClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The button that reads as an input well. */
  trigger?: string;
  glyph?: string;
  /** The formatted date, or the placeholder. */
  value?: string;
  clear?: string;
  /** The floating panel around the calendar. */
  panel?: string;
}

/** What {@link GlassDatePickerProps.renderTrigger} is handed. */
export interface DateTriggerArgs {
  value: Date | null;
  /** The formatted date, or `null` when nothing is selected. */
  text: string | null;
  placeholder: string;
  open: boolean;
  disabled: boolean;
}

/** Calendar props the picker passes straight through to its grid. */
type ForwardedCalendarProps = Pick<
  GlassCalendarProps,
  | 'min'
  | 'max'
  | 'isDisabled'
  | 'weekStartsOn'
  | 'locale'
  | 'showToday'
  | 'todayLabel'
  | 'showOutsideDays'
  | 'fixedWeeks'
  | 'header'
  | 'renderDay'
  | 'dayClassName'
  | 'formatMonth'
  | 'weekdayFormat'
  | 'formatWeekday'
  | 'formatDay'
  | 'formatDayLabel'
  | 'defaultMonth'
  | 'onMonthChange'
>;

export interface GlassDatePickerProps extends ForwardedCalendarProps {
  /** Selected day, or `null`. Omit for an uncontrolled field. */
  value?: Date | null;
  /** Starting selection when uncontrolled. @default null */
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Render the trigger's text. Defaults to the locale's medium date style. */
  format?: (date: Date) => string;
  /** Full control over the trigger's interior. The button itself is kept. */
  renderTrigger?: (args: DateTriggerArgs) => ReactNode;
  /** Extra content under the calendar, beside the Clear shortcut. */
  footer?: ReactNode;
  /** Glyphs. @default '▦' in the trigger and '✕' on the clear button */
  icons?: { calendar?: ReactNode; clear?: ReactNode };
  /** Whether the popover is open. Omit to let the picker own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  fieldLabel?: ReactNode;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  disabled?: boolean;
  /** Show a clear button once a date is set. @default true */
  clearable?: boolean;
  /** Text on the calendar's Clear shortcut. @default 'Clear' */
  clearLabel?: ReactNode;
  /** Close the popover as soon as a day is picked. @default true */
  closeOnSelect?: boolean;
  /** @default 'bottom-start' */
  placement?: Placement;
  id?: string;
  /** Emits `YYYY-MM-DD` into a plain form post. */
  name?: string;
  className?: string;
  classNames?: DatePickerClasses;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * A date field: a trigger that reads as an input well, and a portalled
 * {@link GlassCalendar} anchored under it.
 *
 * Opens on click, Enter, Space or ArrowDown. Focus moves into the grid on
 * open and returns to the trigger on close, so the whole thing is reachable
 * without a pointer.
 */
export const GlassDatePicker = forwardRef<HTMLButtonElement, GlassDatePickerProps>(
  function GlassDatePicker(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      min,
      max,
      isDisabled,
      weekStartsOn,
      locale,
      showToday,
      todayLabel,
      showOutsideDays,
      fixedWeeks,
      header,
      renderDay,
      dayClassName,
      formatMonth,
      weekdayFormat,
      formatWeekday,
      formatDay,
      formatDayLabel,
      defaultMonth,
      onMonthChange,
      format,
      renderTrigger,
      footer,
      icons,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      fieldLabel,
      placeholder = 'Pick a date…',
      hint,
      error,
      required,
      requiredMark,
      disabled = false,
      clearable = true,
      clearLabel = 'Clear',
      closeOnSelect = true,
      placement = 'bottom-start',
      id,
      name,
      className,
      classNames,
      style,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [value, setValue] = useControllableState<Date | null>(
      valueProp,
      defaultValue,
      onChange as ((v: Date | null) => void) | undefined,
    );
    const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen, onOpenChange);

    useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);

    const { id: fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
    const panelId = `${fieldId}-panel`;

    const fallbackFormat = useMemo(
      () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
      [locale],
    );
    const text = value === null ? null : (format ?? ((d: Date) => fallbackFormat.format(d)))(value);

    // Move focus into the grid on open, and hand it back to the trigger on
    // close — but only when the close came from inside the popover, so a click
    // elsewhere on the page is not yanked back.
    useEffect(() => {
      if (!open) return;
      const frame = requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }, [open]);

    const close = useCallback(
      (restoreFocus: boolean) => {
        setOpen(false);
        if (restoreFocus) triggerRef.current?.focus();
      },
      [setOpen],
    );

    const showClear = clearable && value !== null;

    const onTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    };

    return (
      <div
        className={cn('ob-field', error && 'ob-field--invalid', className, classNames?.field)}
        style={style}
      >
        {fieldLabel ? (
          <FieldLabel
            id={fieldId}
            label={fieldLabel}
            required={required}
            requiredMark={requiredMark}
            className={classNames?.label}
          />
        ) : null}

        <div className="ob-date" ref={anchorRef} data-open={open}>
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            className={cn(
              'ob-input',
              'ob-date__trigger',
              'ob-reset-button',
              error && 'ob-input--invalid',
              disabled && 'ob-input--disabled',
              classNames?.trigger,
            )}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-label={ariaLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onClick={() => (open ? close(false) : setOpen(true))}
            onKeyDown={onTriggerKeyDown}
          >
            {renderTrigger ? (
              renderTrigger({ value, text, placeholder, open, disabled })
            ) : (
              <>
                <span className={cn('ob-date__glyph', classNames?.glyph)} aria-hidden="true">
                  {icons?.calendar ?? '▦'}
                </span>
                <span
                  className={cn(
                    'ob-date__value',
                    text === null && 'ob-date__value--placeholder',
                    classNames?.value,
                  )}
                >
                  {text ?? placeholder}
                </span>
              </>
            )}
          </button>

          {showClear && !disabled ? (
            <button
              type="button"
              className={cn('ob-date__clear', 'ob-reset-button', classNames?.clear)}
              aria-label="Clear date"
              onClick={() => setValue(null)}
            >
              {icons?.clear ?? '✕'}
            </button>
          ) : null}

          {name ? (
            <input type="hidden" name={name} value={value === null ? '' : toISODate(value)} />
          ) : null}

          <Floating
            open={open}
            onClose={() => close(true)}
            anchorRef={anchorRef}
            placement={placement}
            offset={8}
            role="dialog"
            id={panelId}
            aria-label={typeof fieldLabel === 'string' ? fieldLabel : (ariaLabel ?? 'Choose a date')}
            className={cn(
              'ob-date__panel',
              'ob-surface',
              'ob-surface--overlay',
              classNames?.panel,
            )}
          >
            <div ref={panelRef}>
              <GlassCalendar
                value={value}
                onChange={(date) => {
                  setValue(date);
                  // Re-picking the same day is still a confirmation, so close
                  // either way rather than treating it as a no-op.
                  if (closeOnSelect) close(true);
                }}
                defaultMonth={defaultMonth ?? value ?? undefined}
                onMonthChange={onMonthChange}
                min={min}
                max={max}
                isDisabled={isDisabled}
                weekStartsOn={weekStartsOn}
                locale={locale}
                showToday={showToday}
                todayLabel={todayLabel}
                showOutsideDays={showOutsideDays}
                fixedWeeks={fixedWeeks}
                header={header}
                renderDay={renderDay}
                dayClassName={dayClassName}
                formatMonth={formatMonth}
                weekdayFormat={weekdayFormat}
                formatWeekday={formatWeekday}
                formatDay={formatDay}
                formatDayLabel={formatDayLabel}
                // Left undefined when there is nothing to show, so the
                // calendar does not draw an empty footer rule.
                footer={
                  showClear || footer ? (
                    <>
                      {showClear ? (
                        <button
                          type="button"
                          className="ob-cal__today ob-date__clear-day ob-reset-button"
                          onClick={() => {
                            setValue(null);
                            close(true);
                          }}
                        >
                          {clearLabel}
                        </button>
                      ) : null}
                      {footer}
                    </>
                  ) : undefined
                }
              />
            </div>
          </Floating>
        </div>

        <FieldNote
          error={error}
          hint={hint}
          errorId={errorId}
          hintId={hintId}
          className={classNames?.note}
        />
      </div>
    );
  },
);
