import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassDeviceFrame.css';

export interface GlassDeviceFrameProps {
  children?: ReactNode;
  /** Top cutout style. @default 'island' */
  notch?: 'island' | 'notch' | 'none';
  /** Frame width in px; height follows a 19.5:9 ratio. @default 300 */
  width?: number;
  /** Show the home indicator pill at the bottom. @default true */
  homeIndicator?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A phone device bezel to wrap mobile screens — notch/dynamic-island + home bar. */
export function GlassDeviceFrame({
  children,
  notch = 'island',
  width = 300,
  homeIndicator = true,
  className,
  style,
}: GlassDeviceFrameProps) {
  const height = Math.round((width * 19.5) / 9);
  return (
    <div className={cn('ob-device', className)} style={{ width, height, ...style }}>
      <div className="ob-device__screen">
        {notch !== 'none' ? <div className={cn('ob-device__notch', `ob-device__notch--${notch}`)} /> : null}
        <div className="ob-device__content">{children}</div>
        {homeIndicator ? <div className="ob-device__home" aria-hidden="true" /> : null}
      </div>
    </div>
  );
}
