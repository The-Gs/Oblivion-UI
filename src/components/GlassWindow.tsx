import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassWindow.css';

export interface WindowTab {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
}

/** Class names for each part of the window chrome. */
export interface WindowSlots {
  bar?: string;
  title?: string;
  tabs?: string;
  tab?: string;
  toolbar?: string;
  body?: string;
}

export type WindowOS = 'mac' | 'windows' | 'linux';

export interface GlassWindowProps {
  children?: ReactNode;
  /** `mac` centres a title; `browser` shows the tab strip. @default 'mac' */
  chrome?: 'mac' | 'browser';
  /**
   * Window-control style: `mac` traffic lights on the left, or `windows` /
   * `linux` control buttons on the right. Also nudges the tab shape. @default 'mac'
   */
  os?: WindowOS;
  title?: ReactNode;
  /** Browser tabs. Providing this implies `chrome="browser"`. */
  tabs?: WindowTab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onTabChange?: (id: string) => void;
  /** A row under the bar — e.g. an address field or toolbar. */
  toolbar?: ReactNode;
  /** Show the red/amber/green traffic lights. @default true */
  dots?: boolean;
  /** Reveal ×/−/+ glyphs on hover, and wire the buttons. */
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  className?: string;
  classNames?: WindowSlots;
  style?: CSSProperties;
}

/**
 * A desktop-window frame in glass — traffic-light controls, an optional title
 * or browser tab strip, and a toolbar row. Purely presentational chrome to wrap
 * demos, screenshots, and app shells.
 */
export function GlassWindow({
  children,
  chrome = 'mac',
  os = 'mac',
  title,
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  toolbar,
  dots = true,
  onClose,
  onMinimize,
  onZoom,
  className,
  classNames: slots,
  style,
}: GlassWindowProps) {
  const mode = tabs ? 'browser' : chrome;
  const [active, setActive] = useControllableState(
    activeTab,
    defaultActiveTab ?? tabs?.[0]?.id ?? '',
    onTabChange,
  );

  // Window controls, styled per OS. Mac = coloured traffic lights (left);
  // windows/linux = labelled control buttons (right).
  const controls = !dots ? null : os === 'mac' ? (
    <div className="ob-win__dots" aria-hidden={!onClose && !onMinimize && !onZoom}>
      <button type="button" className="ob-win__dot ob-win__dot--close" onClick={onClose} tabIndex={onClose ? 0 : -1} aria-label="Close"><span>×</span></button>
      <button type="button" className="ob-win__dot ob-win__dot--min" onClick={onMinimize} tabIndex={onMinimize ? 0 : -1} aria-label="Minimize"><span>−</span></button>
      <button type="button" className="ob-win__dot ob-win__dot--zoom" onClick={onZoom} tabIndex={onZoom ? 0 : -1} aria-label="Zoom"><span>+</span></button>
    </div>
  ) : (
    <div className={cn('ob-win__ctl', `ob-win__ctl--${os}`)}>
      <button type="button" className="ob-win__ctl-btn" onClick={onMinimize} tabIndex={onMinimize ? 0 : -1} aria-label="Minimize">﹣</button>
      <button type="button" className="ob-win__ctl-btn" onClick={onZoom} tabIndex={onZoom ? 0 : -1} aria-label="Maximize">▢</button>
      <button type="button" className="ob-win__ctl-btn ob-win__ctl-btn--close" onClick={onClose} tabIndex={onClose ? 0 : -1} aria-label="Close">✕</button>
    </div>
  );

  const body =
    mode === 'browser' && tabs ? (
      <div className={cn('ob-win__tabs', slots?.tabs)} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            className={cn('ob-win__tab', slots?.tab)}
            data-active={t.id === active}
            onClick={() => setActive(t.id)}
          >
            {t.icon ? <span className="ob-win__tab-icon">{t.icon}</span> : null}
            <span className="ob-win__tab-label">{t.label}</span>
          </button>
        ))}
      </div>
    ) : (
      <div className={cn('ob-win__title', slots?.title)}>{title}</div>
    );

  return (
    <div className={cn('ob-win', `ob-win--${mode}`, `ob-win--os-${os}`, className)} style={style}>
      <div className={cn('ob-win__bar', slots?.bar)}>
        {os === 'mac' ? controls : null}
        {body}
        {/* Balance mac's left dots so the title stays optically centred. */}
        {mode === 'mac' && os === 'mac' && dots ? <div className="ob-win__spacer" aria-hidden="true" /> : null}
        {os !== 'mac' ? controls : null}
      </div>

      {toolbar ? <div className={cn('ob-win__toolbar', slots?.toolbar)}>{toolbar}</div> : null}

      <div className={cn('ob-win__body', slots?.body)}>{children}</div>
    </div>
  );
}
