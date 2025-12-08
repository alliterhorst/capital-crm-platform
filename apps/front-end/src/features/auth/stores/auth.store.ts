import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id?: string;
  email: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateUserName: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user: User) => {
        set({ user });
      },

      updateUserName: (name: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
        }));
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'capital-crm-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
