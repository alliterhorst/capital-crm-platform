import { JSX } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/shared/components/auth-guard';
import { AppLayout } from '@/app/layouts/app-layout';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { LoginPage } from '@/features/auth/login-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { NAVIGATION_MAP } from '@/shared/config/navigation';
import { WelcomePage } from '@/features/auth/welcome-page';
import { ClientsPage } from '@/features/clients/clients-page';
import { ClientDetailPage } from '@/features/clients/client-detail-page';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: NAVIGATION_MAP.DASHBOARD.path,
            element: <DashboardPage />,
          },
          {
            path: NAVIGATION_MAP.CLIENTS.path,
            element: <ClientsPage currentPath={NAVIGATION_MAP.CLIENTS.path} />,
          },
          {
            path: `${NAVIGATION_MAP.CLIENTS.path}/:id`,
            element: <ClientDetailPage />,
          },
          {
            path: NAVIGATION_MAP.SELECTED_CLIENTS.path,
            element: <ClientsPage currentPath={NAVIGATION_MAP.SELECTED_CLIENTS.path} />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
