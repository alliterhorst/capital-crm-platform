import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../stores/auth.store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  });

  it('should start with initial state', () => {
    const state = useAuthStore.getState();

    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set token and mark as authenticated', () => {
    const { setToken } = useAuthStore.getState();

    setToken('test-token');

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should set user data', () => {
    const { setUser } = useAuthStore.getState();

    setUser({ id: '1', email: 'user@example.com', name: 'User' });

    const state = useAuthStore.getState();
    expect(state.user).toEqual({
      id: '1',
      email: 'user@example.com',
      name: 'User',
    });
  });

  it('should update user name when user exists', () => {
    const { setUser, updateUserName } = useAuthStore.getState();

    setUser({ id: '1', email: 'user@example.com', name: 'Old Name' });
    updateUserName('New Name');

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.name).toBe('New Name');
  });

  it('should keep user null when updating name without user', () => {
    const { updateUserName } = useAuthStore.getState();

    updateUserName('New Name');

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
  });

  it('should logout, clear token, user and access_token from storage', () => {
    localStorage.setItem('access_token', 'token-to-remove');

    const { setToken, setUser, logout } = useAuthStore.getState();

    setToken('session-token');
    setUser({ id: '1', email: 'user@example.com', name: 'User' });

    logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should persist auth data to localStorage using correct key', () => {
    const { setToken, setUser } = useAuthStore.getState();

    setToken('persisted-token');
    setUser({ id: '1', email: 'user@example.com', name: 'User' });

    const stored = localStorage.getItem('capital-crm-auth');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored as string) as {
      state: {
        token: string | null;
        user: { id?: string; email: string; name?: string } | null;
        isAuthenticated: boolean;
      };
    };

    expect(parsed.state.token).toBe('persisted-token');
    expect(parsed.state.user?.email).toBe('user@example.com');
    expect(parsed.state.isAuthenticated).toBe(true);
  });
});
