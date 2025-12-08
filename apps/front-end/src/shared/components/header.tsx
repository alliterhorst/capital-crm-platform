import { JSX } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '@/shared/config/navigation';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-16 shadow-sm">
      <div className="flex w-1/4 items-center gap-4">
        <div className={cn('flex items-center gap-4', isSidebarOpen ? 'lg:hidden' : 'flex')}>
          <button
            onClick={toggleSidebar}
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>

          <img src="/logo.svg" alt="Logo" className="h-20 w-auto" />
        </div>
      </div>

      <nav className="flex flex-1 justify-center">
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAVIGATION_ITEMS.filter((item) => item.path !== '/dashboard').map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-primary hover:underline hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/" className="hover:text-primary">
            {MESSAGES_HELPER.MENU.LOGOUT}
          </Link>
        </div>
      </nav>

      <div className="flex w-1/4 justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span>
            {MESSAGES_HELPER.HEADERS.WELCOME}{' '}
            <span className="font-bold">{MESSAGES_HELPER.HEADERS.USER_HIGHLIGHT}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
