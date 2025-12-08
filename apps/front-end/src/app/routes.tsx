import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { LoginPage } from '@/features/auth/login-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { NAVIGATION_MAP } from '@/shared/config/navigation';

const { DASHBOARD, CLIENTS, SELECTED_CLIENTS } = NAVIGATION_MAP;

export const router = createBrowserRouter([
  {
    path: DASHBOARD.path,
    element: <AppLayout />,
    children: [
      {
        path: DASHBOARD.path,
        element: <DashboardPage />,
      },
      {
        path: CLIENTS.path,
        element: <div className="p-4">Módulo de Clientes (Em breve)</div>,
      },
      {
        path: SELECTED_CLIENTS.path,
        element: <div className="p-4">Módulo de Clientes Selecionados (Em breve)</div>,
      },
    ],
  },
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
]);
