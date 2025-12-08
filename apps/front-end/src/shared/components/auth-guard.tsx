import { JSX, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function AuthGuard(): JSX.Element | null {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/auth/login', { replace: true });
      return;
    }
  }, [token, user, navigate, location]);

  if (!token) {
    return null;
  }

  return <Outlet />;
}
