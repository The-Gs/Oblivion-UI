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

export { Center, AspectRatio, ButtonGroup } from './components/layout';
export type { CenterOwnProps, AspectRatioProps, ButtonGroupProps } from './components/layout';

export { Heading, Text } from './components/typography';
export type {
  HeadingOwnProps,
  HeadingSize,
  TextOwnProps,
  TextSize,
  TextTone,
} from './components/typography';

export { Orbs } from './components/Orbs';
export type { OrbsProps, OrbPalette } from './components/Orbs';

export { GlassButton } from './components/GlassButton';
export type { GlassButtonOwnProps, ButtonVariant, ButtonSize, ButtonTone } from './components/GlassButton';

export { GlassCard } from './components/GlassCard';
export type { GlassCardOwnProps, GlassCardSlots } from './components/GlassCard';

export { GlassWindow } from './components/GlassWindow';
export type { GlassWindowProps, WindowTab, WindowSlots, WindowOS } from './components/GlassWindow';

export { GlassMenuBar } from './components/GlassMenuBar';
export type { GlassMenuBarProps } from './components/GlassMenuBar';

export { GlassDock } from './components/GlassDock';
export type { GlassDockProps, DockItem } from './components/GlassDock';

export { GlassTerminal } from './components/GlassTerminal';
export type { GlassTerminalProps, TerminalLine } from './components/GlassTerminal';

export { GlassNotification } from './components/GlassNotification';
export type { GlassNotificationProps } from './components/GlassNotification';

export { GlassContextMenu } from './components/GlassContextMenu';
export type { GlassContextMenuProps, ContextMenuItem } from './components/GlassContextMenu';

export { GlassStatusBar } from './components/GlassStatusBar';
export type { GlassStatusBarProps, StatusSegment, StatusTone } from './components/GlassStatusBar';

export { GlassDeviceFrame } from './components/GlassDeviceFrame';
export type { GlassDeviceFrameProps } from './components/GlassDeviceFrame';

export { GlassCodeBlock } from './components/GlassCodeBlock';
export type { GlassCodeBlockProps } from './components/GlassCodeBlock';

export { GlassMiniPlayer } from './components/GlassMiniPlayer';
export type { GlassMiniPlayerProps } from './components/GlassMiniPlayer';

export { GlassChatBubble } from './components/GlassChatBubble';
export type { GlassChatBubbleProps } from './components/GlassChatBubble';

export { GlassSpotlightCard } from './components/GlassSpotlightCard';
export type { GlassSpotlightCardProps } from './components/GlassSpotlightCard';

export { GlassTiltCard } from './components/GlassTiltCard';
export type { GlassTiltCardProps } from './components/GlassTiltCard';

export { GlassNumberTicker } from './components/GlassNumberTicker';
export type { GlassNumberTickerProps } from './components/GlassNumberTicker';

export { GlassMarquee } from './components/GlassMarquee';
export type { GlassMarqueeProps } from './components/GlassMarquee';

export { GlassSpeedDial } from './components/GlassSpeedDial';
export type { GlassSpeedDialProps, SpeedDialAction } from './components/GlassSpeedDial';

export { GlassActivityRings } from './components/GlassActivityRings';
export type { GlassActivityRingsProps, Ring, RingTone } from './components/GlassActivityRings';

export { GlassGauge } from './components/GlassGauge';
export type { GlassGaugeProps, GaugeTone } from './components/GlassGauge';

export { GlassSparkline } from './components/GlassSparkline';
export type { GlassSparklineProps, SparkTone } from './components/GlassSparkline';

export { GlassBarChart } from './components/GlassBarChart';
export type { GlassBarChartProps, BarDatum, ChartTone } from './components/GlassBarChart';

export { GlassLineChart } from './components/GlassLineChart';
export type { GlassLineChartProps, LineSeries, LineTone } from './components/GlassLineChart';

export { GlassSplitPane } from './components/GlassSplitPane';
export type { GlassSplitPaneProps } from './components/GlassSplitPane';

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

export { GlassRangeSlider } from './components/GlassRangeSlider';
export type { GlassRangeSliderProps, RangeValue } from './components/GlassRangeSlider';

export { GlassToggleGroup } from './components/GlassToggleGroup';
export type { GlassToggleGroupProps, ToggleItem } from './components/GlassToggleGroup';

export { GlassColorPicker } from './components/GlassColorPicker';
export type { GlassColorPickerProps } from './components/GlassColorPicker';

export { GlassBadge } from './components/GlassBadge';
export type { GlassBadgeProps, BadgeVariant, BadgeTone } from './components/GlassBadge';

export { GlassKbd } from './components/GlassKbd';
export type { GlassKbdProps } from './components/GlassKbd';

export { GlassBreadcrumb } from './components/GlassBreadcrumb';
export type {
  GlassBreadcrumbProps,
  BreadcrumbItem,
  BreadcrumbSlots,
} from './components/GlassBreadcrumb';

export { GlassPagination } from './components/GlassPagination';
export type { GlassPaginationProps } from './components/GlassPagination';

export { GlassSegmented } from './components/GlassSegmented';
export type { GlassSegmentedProps, SegmentedItem } from './components/GlassSegmented';

export { GlassRating } from './components/GlassRating';
export type { GlassRatingProps } from './components/GlassRating';

export { GlassStat } from './components/GlassStat';
export type { GlassStatProps, StatTrend, StatSlots } from './components/GlassStat';

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

export { GlassMeter } from './components/GlassMeter';
export type { GlassMeterProps, MeterTone } from './components/GlassMeter';

export { GlassEmptyState } from './components/GlassEmptyState';
export type { GlassEmptyStateProps } from './components/GlassEmptyState';

export { GlassCallout } from './components/GlassCallout';
export type { GlassCalloutProps, CalloutTone } from './components/GlassCallout';

export { GlassDescriptionList } from './components/GlassDescriptionList';
export type {
  GlassDescriptionListProps,
  DescriptionItem,
  DescriptionListSlots,
} from './components/GlassDescriptionList';

export { GlassTable } from './components/GlassTable';
export type { GlassTableProps, Column } from './components/GlassTable';

export { GlassTabs } from './components/GlassTabs';
export type { GlassTabsProps } from './components/GlassTabs';

export { GlassSteps } from './components/GlassSteps';
export type { GlassStepsProps, StepItem, StepsSlots } from './components/GlassSteps';

export { GlassTimeline } from './components/GlassTimeline';
export type {
  GlassTimelineProps,
  TimelineItem,
  TimelineTone,
  TimelineSlots,
} from './components/GlassTimeline';

export { GlassNavMenu } from './components/GlassNavMenu';
export type { GlassNavMenuProps, NavItem } from './components/GlassNavMenu';

export { GlassSidebar } from './components/GlassSidebar';
export type { GlassSidebarProps, SidebarItem, SidebarSection } from './components/GlassSidebar';

export { GlassCarousel } from './components/GlassCarousel';
export type { GlassCarouselProps } from './components/GlassCarousel';

export { GlassScrollArea } from './components/GlassScrollArea';
export type { GlassScrollAreaProps } from './components/GlassScrollArea';

export { GlassModal } from './components/GlassModal';
export type { GlassModalProps } from './components/GlassModal';

export { GlassAlertDialog } from './components/GlassAlertDialog';
export type { GlassAlertDialogProps } from './components/GlassAlertDialog';

export { GlassTag } from './components/GlassTag';
export type { GlassTagProps, TagTone } from './components/GlassTag';

export { GlassEditable } from './components/GlassEditable';
export type { GlassEditableProps } from './components/GlassEditable';

export { GlassPopover } from './components/GlassPopover';
export type { GlassPopoverProps } from './components/GlassPopover';

export { GlassHoverCard } from './components/GlassHoverCard';
export type { GlassHoverCardProps } from './components/GlassHoverCard';

export { GlassDrawer } from './components/GlassDrawer';
export type { GlassDrawerProps, DrawerSide, DrawerSlots } from './components/GlassDrawer';

export { GlassCommand } from './components/GlassCommand';
export type { GlassCommandProps, CommandItem } from './components/GlassCommand';

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

export {
  useControllableState,
  useDisclosure,
  useClipboard,
  useMediaQuery,
  useOnEscape,
  useOutsideClick,
} from './lib/hooks';
