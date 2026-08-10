import { forwardRef, type CSSProperties, type ElementType } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponentWithRef, PolymorphicProps } from '../lib/polymorphic';
import './primitives.css';

/** A spacing value: an index into the token scale (1–7) or any CSS length. */
export type Space = 1 | 2 | 3 | 4 | 5 | 6 | 7 | (string & {});

const space = (v: Space | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? `var(--ob-space-${v})` : v;

/* ─────────────────────────────────────────────────────────────────────────
   Box — the untyped escape hatch. A polymorphic div with nothing added.
   ───────────────────────────────────────────────────────────────────────── */
export const Box = forwardRef(function Box<T extends ElementType = 'div'>(
  { as, className, ...rest }: PolymorphicProps<T, { className?: string }>,
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? 'div') as ElementType;
  return <Tag ref={ref} className={cn('ob-box', className)} {...rest} />;
}) as PolymorphicComponentWithRef<'div', { className?: string }>;

/* ─────────────────────────────────────────────────────────────────────────
   Stack / Flex — flexbox with token gaps.
   ───────────────────────────────────────────────────────────────────────── */
export interface StackOwnProps {
  gap?: Space;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

function makeFlex(display: 'flex', direction: 'row' | 'column', displayName: string) {
  const Comp = forwardRef(function Flexish<T extends ElementType = 'div'>(
    { as, gap, align, justify, wrap, className, style, ...rest }: PolymorphicProps<T, StackOwnProps>,
    ref: React.Ref<Element>,
  ) {
    const Tag = (as ?? 'div') as ElementType;
    return (
      <Tag
        ref={ref}
        className={cn('ob-flex', className)}
        style={{
          display,
          flexDirection: direction,
          gap: space(gap),
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
          ...style,
        }}
        {...rest}
      />
    );
  }) as PolymorphicComponentWithRef<'div', StackOwnProps>;
  (Comp as { displayName?: string }).displayName = displayName;
  return Comp;
}

/** Vertical flex column. */
export const Stack = makeFlex('flex', 'column', 'Stack');
/** Horizontal flex row. */
export const Flex = makeFlex('flex', 'row', 'Flex');

/* ─────────────────────────────────────────────────────────────────────────
   Grid — CSS grid with a column count or explicit template.
   ───────────────────────────────────────────────────────────────────────── */
export interface GridOwnProps {
  /** Number of equal columns, or a raw grid-template-columns string. */
  columns?: number | string;
  gap?: Space;
  /** Min column width for an auto-fit responsive grid; overrides `columns`. */
  minColumnWidth?: string;
  align?: CSSProperties['alignItems'];
  className?: string;
  style?: CSSProperties;
}

export const Grid = forwardRef(function Grid<T extends ElementType = 'div'>(
  {
    as,
    columns = 1,
    gap,
    minColumnWidth,
    align,
    className,
    style,
    ...rest
  }: PolymorphicProps<T, GridOwnProps>,
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? 'div') as ElementType;
  const template = minColumnWidth
    ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
    : typeof columns === 'number'
      ? `repeat(${columns}, 1fr)`
      : columns;
  return (
    <Tag
      ref={ref}
      className={cn('ob-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: template,
        gap: space(gap),
        alignItems: align,
        ...style,
      }}
      {...rest}
    />
  );
}) as PolymorphicComponentWithRef<'div', GridOwnProps>;

/* ─────────────────────────────────────────────────────────────────────────
   Container — centered, max-width column with page gutters.
   ───────────────────────────────────────────────────────────────────────── */
export interface ContainerOwnProps {
  /** Max content width. @default '1000px' */
  size?: string;
  className?: string;
  style?: CSSProperties;
}

export const Container = forwardRef(function Container<T extends ElementType = 'div'>(
  { as, size = '1000px', className, style, ...rest }: PolymorphicProps<T, ContainerOwnProps>,
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn('ob-container', className)}
      style={{ maxWidth: size, ...style }}
      {...rest}
    />
  );
}) as PolymorphicComponentWithRef<'div', ContainerOwnProps>;

/* ─────────────────────────────────────────────────────────────────────────
   Separator — a hairline divider, horizontal or vertical.
   ───────────────────────────────────────────────────────────────────────── */
export interface SeparatorProps {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
}

export function Separator({ orientation = 'horizontal', className, style }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn('ob-separator', `ob-separator--${orientation}`, className)}
      style={style}
    />
  );
}
