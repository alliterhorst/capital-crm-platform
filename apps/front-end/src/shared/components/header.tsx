import { JSX } from 'react';
import { Menu } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '@/shared/config/navigation';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/stores/auth.store';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const userName = user?.name || MESSAGES_HELPER.HEADERS.USER_HIGHLIGHT;
  const splitNames = userName.split(' ');
  const displayName = splitNames.length > 1 ? `${splitNames[0]} ${splitNames[1]}` : userName;

  function handleLogout(): void {
    logout();
    navigate('/auth/login');
  }

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

          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-20 w-auto" />
          </Link>
        </div>
      </div>

      <nav className="flex flex-1 justify-center">
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAVIGATION_ITEMS.filter((item) => item.headerMenuVisible).map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  'transition-colors hover:text-primary hover:underline hover:underline-offset-4',
                  isActive && 'text-primary underline underline-offset-4',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-transparent border-none cursor-pointer hover:text-primary"
          >
            {MESSAGES_HELPER.MENU.LOGOUT}
          </button>
        </div>
      </nav>

      <div className="flex w-1/4 justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span>
            {MESSAGES_HELPER.HEADERS.WELCOME} <span className="font-bold">{displayName}</span>!
          </span>
        </div>
      </div>
    </header>
  );
}
