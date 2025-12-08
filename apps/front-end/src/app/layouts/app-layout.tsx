import { JSX, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/sidebar';
import { Header } from '@/shared/components/header';
import { cn } from '@/shared/lib/utils';

export function AppLayout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize(): void {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function toggleSidebar(): void {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out',
          !isMobile && isSidebarOpen ? 'ml-[260px]' : 'ml-0',
        )}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-auto bg-secondary/30 p-6 px-16">
          <Outlet />
        </main>
      </div>

      {isMobile && isSidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
