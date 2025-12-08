import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UpdateUserDto } from '@/shared/api/generated/model';

interface AuthState {
  token: string | null;
  user: UpdateUserDto | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UpdateUserDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token: string) => set({ token, isAuthenticated: !!token }),
      setUser: (user: UpdateUserDto) => set({ user }),
      logout: () => {
        localStorage.removeItem('capital-crm-token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'capital-crm-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
