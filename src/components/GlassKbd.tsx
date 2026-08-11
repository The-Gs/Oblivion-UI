import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassKbd.css';

export interface GlassKbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/** An inline keyboard key — a recessed cap for shortcuts and hints. */
export function GlassKbd({ children, size = 'md', className, ...rest }: GlassKbdProps) {
  return (
    <kbd className={cn('ob-kbd', size === 'sm' && 'ob-kbd--sm', className)} {...rest}>
      {children}
    </kbd>
  );
}
