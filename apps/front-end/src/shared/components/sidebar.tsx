import { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { NAVIGATION_ITEMS } from '@/shared/config/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
}

function NavItem({ to, icon: Icon, label, isOpen }: NavItemProps): JSX.Element {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-4 rounded-md px-3 py-3 text-base font-medium transition-colors font-sidebar',
          isActive ? 'text-primary' : 'text-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary' : 'text-foreground')} />

          {isOpen && <span className="whitespace-nowrap">{label}</span>}

          {isActive && isOpen && (
            <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary" />
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ isOpen, toggleSidebar, isMobile }: SidebarProps): JSX.Element {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300 ease-in-out',
        isOpen ? 'w-[260px] overflow-visible' : 'w-0 overflow-hidden border-none',
        isMobile && !isOpen && '-translate-x-full',
        isMobile && isOpen && 'translate-x-0 w-[260px]',
      )}
    >
      <div className="relative flex h-[128px] shrink-0 items-center justify-center bg-[#363636] px-6">
        <div
          className={cn(
            'transition-opacity duration-200',
            !isOpen ? 'hidden opacity-0' : 'opacity-100',
          )}
        >
          <img src="/logo.svg" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        {!isMobile && isOpen && (
          <button
            onClick={toggleSidebar}
            type="button"
            className="absolute -right-5 top-[128px] z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1F1F1F] text-white shadow-md transition-colors hover:bg-black"
            aria-label="Close Sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-4 py-4">
        {NAVIGATION_ITEMS.filter((item) => item.sideMenuVisible).map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isOpen={isOpen}
          />
        ))}
      </nav>
    </aside>
  );
}
