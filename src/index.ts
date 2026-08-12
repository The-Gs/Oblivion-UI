// Base layers must come first so component CSS can override them; the extra
// themes (scoped to [data-ob-theme]) come last so their overrides win.
import './styles/tokens.css';
import './styles/surface.css';
import './styles/themes/index.css';

export {
  ThemeProvider,
  useTheme,
  useThemeOptional,
  THEMES,
  systemPrefersLight,
} from './theme/ThemeProvider';
export type {
  ThemeId,
  ThemeMode,
  ThemeContextValue,
  ThemeProviderProps,
} from './theme/ThemeProvider';

export { GlassSurface } from './components/GlassSurface';
export type { GlassSurfaceOwnProps, SurfaceElevation } from './components/GlassSurface';

export { GlassMenu, GlassDropdown } from './components/GlassMenu';
export type {
  GlassMenuProps,
  MenuEntry,
  MenuItemConfig,
  MenuSeparator,
} from './components/GlassMenu';

export { GlassAlert } from './components/GlassAlert';
export type { GlassAlertProps, AlertTone } from './components/GlassAlert';

export { GlassAccordion, GlassCollapsible } from './components/GlassAccordion';
export type {
  GlassAccordionProps,
  AccordionItemConfig,
  GlassCollapsibleProps,
} from './components/GlassAccordion';

export { GlassDataGrid } from './components/GlassDataGrid';
export type { GlassDataGridProps, DataGridColumn } from './components/GlassDataGrid';

export { Box, Stack, Flex, Grid, Container, Separator } from './components/primitives';
export type {
  Space,
  StackOwnProps,
  GridOwnProps,
  ContainerOwnProps,
  SeparatorProps,
} from './components/primitives';

export { Orbs } from './components/Orbs';
export type { OrbsProps, OrbPalette } from './components/Orbs';

export { GlassButton } from './components/GlassButton';
export type { GlassButtonOwnProps, ButtonVariant, ButtonSize } from './components/GlassButton';

export { GlassCard } from './components/GlassCard';
export type { GlassCardOwnProps } from './components/GlassCard';

export { GlassInput, GlassTextarea } from './components/GlassInput';
export type { GlassInputProps, GlassTextareaProps } from './components/GlassInput';

export { GlassField } from './components/GlassField';
export type {
  GlassFieldProps,
  FieldIds,
  FieldRenderArgs,
  FieldSlotClasses,
} from './components/GlassField';

export { GlassSelect } from './components/GlassSelect';
export type { GlassSelectProps } from './components/GlassSelect';

export { GlassCombobox } from './components/GlassCombobox';
export type {
  GlassComboboxProps,
  ComboboxClasses,
  ComboboxOptionArgs,
} from './components/GlassCombobox';

export { GlassTagInput } from './components/GlassTagInput';
export type {
  GlassTagInputProps,
  TagInputClasses,
  TagRenderArgs,
} from './components/GlassTagInput';

export { GlassNumberInput } from './components/GlassNumberInput';
export type { GlassNumberInputProps, NumberInputClasses } from './components/GlassNumberInput';

export { GlassPinInput } from './components/GlassPinInput';
export type { GlassPinInputProps, PinInputClasses } from './components/GlassPinInput';

export { GlassFileDrop, formatBytes } from './components/GlassFileDrop';
export type {
  GlassFileDropProps,
  FileDropClasses,
  FileRenderArgs,
} from './components/GlassFileDrop';

export { GlassCalendar } from './components/GlassCalendar';
export type {
  GlassCalendarProps,
  CalendarClasses,
  CalendarHeaderArgs,
  DayState,
} from './components/GlassCalendar';

export { GlassDatePicker } from './components/GlassDatePicker';
export type {
  GlassDatePickerProps,
  DatePickerClasses,
  DateTriggerArgs,
} from './components/GlassDatePicker';

/* Local-date helpers the calendar runs on — exported so callers can build
   `min`/`max`/`isDisabled` without reaching for a date library. */
export {
  addDays,
  addMonths,
  clampDate,
  fromISODate,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  toISODate,
} from './lib/date';

export { GlassSwitch } from './components/GlassSwitch';
export type { GlassSwitchProps } from './components/GlassSwitch';

export { GlassCheckbox } from './components/GlassCheckbox';
export type { GlassCheckboxProps } from './components/GlassCheckbox';

export { GlassRadioGroup } from './components/GlassRadioGroup';
export type { GlassRadioGroupProps } from './components/GlassRadioGroup';

export { GlassSlider } from './components/GlassSlider';
export type { GlassSliderProps } from './components/GlassSlider';

export { GlassBadge } from './components/GlassBadge';
export type { GlassBadgeProps, BadgeVariant } from './components/GlassBadge';

export { GlassKbd } from './components/GlassKbd';
export type { GlassKbdProps } from './components/GlassKbd';

export { GlassBreadcrumb } from './components/GlassBreadcrumb';
export type { GlassBreadcrumbProps, BreadcrumbItem } from './components/GlassBreadcrumb';

export { GlassPagination } from './components/GlassPagination';
export type { GlassPaginationProps } from './components/GlassPagination';

export { GlassSegmented } from './components/GlassSegmented';
export type { GlassSegmentedProps, SegmentedItem } from './components/GlassSegmented';

export { GlassRating } from './components/GlassRating';
export type { GlassRatingProps } from './components/GlassRating';

export { GlassStat } from './components/GlassStat';
export type { GlassStatProps, StatTrend } from './components/GlassStat';

export { GlassAvatar, GlassAvatarGroup } from './components/GlassAvatar';
export type { GlassAvatarProps, GlassAvatarGroupProps, AvatarSize } from './components/GlassAvatar';

export { GlassTooltip } from './components/GlassTooltip';
export type { GlassTooltipProps } from './components/GlassTooltip';

export {
  GlassProgress,
  GlassSpinner,
  GlassSkeleton,
  GlassSkeletonText,
} from './components/feedback';
export type {
  GlassProgressProps,
  GlassSpinnerProps,
  GlassSkeletonProps,
  GlassSkeletonTextProps,
} from './components/feedback';

export { GlassList } from './components/GlassList';
export type { GlassListProps, Accessor } from './components/GlassList';

export { GlassTable } from './components/GlassTable';
export type { GlassTableProps, Column } from './components/GlassTable';

export { GlassTabs } from './components/GlassTabs';
export type { GlassTabsProps } from './components/GlassTabs';

export { GlassModal } from './components/GlassModal';
export type { GlassModalProps } from './components/GlassModal';

export { ToastProvider, useToast } from './components/GlassToast';
export type {
  ToastProviderProps,
  ToastApi,
  ToastOptions,
  ToastTone,
  ToastPlacement,
} from './components/GlassToast';

export type {
  PolymorphicProps,
  PolymorphicRef,
  PolymorphicComponent,
  PolymorphicComponentWithRef,
} from './lib/polymorphic';
