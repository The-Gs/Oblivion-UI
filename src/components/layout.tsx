import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicProps } from '../lib/polymorphic';
import './layout.css';

export interface CenterOwnProps {
  children?: ReactNode;
  /** Center inline (as an inline-flex) rather than filling the row. */
  inline?: boolean;
}

/** Centres its children on both axes. */
export function Center<T extends ElementType = 'div'>({
  as,
  inline,
  className,
  ...rest
}: PolymorphicProps<T, CenterOwnProps>) {
  const Tag = (as ?? 'div') as ElementType;
  return <Tag className={cn('ob-center', inline && 'ob-center--inline', className)} {...rest} />;
}

export interface AspectRatioProps {
  children?: ReactNode;
  /** Width ÷ height. @default 1.7778 (16:9) */
  ratio?: number;
  className?: string;
  style?: CSSProperties;
}

/** Constrains its child to a fixed aspect ratio. */
export function AspectRatio({ children, ratio = 16 / 9, className, style }: AspectRatioProps) {
  return (
    <div className={cn('ob-ratio', className)} style={{ aspectRatio: String(ratio), ...style }}>
      {children}
    </div>
  );
}

export interface ButtonGroupProps {
  children?: ReactNode;
  /** Join the buttons into one connected control. @default false */
  attached?: boolean;
  /** Gap when not attached. @default 8 */
  spacing?: number;
  className?: string;
  style?: CSSProperties;
}

/** Groups buttons — spaced, or `attached` into a single segmented control. */
export function ButtonGroup({ children, attached = false, spacing = 8, className, style }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn('ob-btngroup', attached && 'ob-btngroup--attached', className)}
      style={{ gap: attached ? 0 : spacing, ...style }}
    >
      {children}
    </div>
  );
}
