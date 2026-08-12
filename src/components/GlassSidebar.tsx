import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassSidebar.css';

export interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  badge?: ReactNode;
  onClick?: () => void;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface GlassSidebarProps {
  sections: SidebarSection[];
  /** Content above the sections (brand/logo). */
  header?: ReactNode;
  /** Content pinned to the bottom (user, settings). */
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the collapse toggle. @default true */
  collapsible?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** A collapsible application sidebar — sections of nav items, icon-rail when collapsed. */
export function GlassSidebar({
  sections,
  header,
  footer,
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  collapsible = true,
  className,
  'aria-label': ariaLabel = 'Sidebar',
}: GlassSidebarProps) {
  const [isCollapsed, setCollapsed] = useControllableState(collapsed, defaultCollapsed ?? false, onCollapsedChange);

  const renderItem = (item: SidebarItem) => {
    const inner = (
      <>
        {item.icon ? <span className="ob-sidebar__icon">{item.icon}</span> : null}
        <span className="ob-sidebar__label">{item.label}</span>
        {item.badge != null ? <span className="ob-sidebar__badge">{item.badge}</span> : null}
      </>
    );
    const cls = cn('ob-sidebar__item', item.active && 'ob-sidebar__item--active');
    return item.href ? (
      <a key={item.id} href={item.href} className={cls} aria-current={item.active ? 'page' : undefined} onClick={item.onClick} title={isCollapsed ? undefined : undefined}>
        {inner}
      </a>
    ) : (
      <button key={item.id} type="button" className={cls} aria-current={item.active ? 'page' : undefined} onClick={item.onClick}>
        {inner}
      </button>
    );
  };

  return (
    <aside
      aria-label={ariaLabel}
      className={cn('ob-sidebar', isCollapsed && 'ob-sidebar--collapsed', className)}
    >
      {header ? <div className="ob-sidebar__header">{header}</div> : null}

      <nav className="ob-sidebar__nav">
        {sections.map((section, i) => (
          <div className="ob-sidebar__section" key={i}>
            {section.label ? <div className="ob-sidebar__section-label">{section.label}</div> : null}
            {section.items.map(renderItem)}
          </div>
        ))}
      </nav>

      {footer ? <div className="ob-sidebar__footer">{footer}</div> : null}

      {collapsible ? (
        <button
          type="button"
          className="ob-sidebar__toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          onClick={() => setCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      ) : null}
    </aside>
  );
}
