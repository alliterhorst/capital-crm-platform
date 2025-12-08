import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WelcomePage } from '../welcome-page';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { useAuthStore } from '@/features/auth/stores/auth.store';

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/shared/api/generated/users/users', () => ({
  useUpdateUserProfile: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (message: string): void => mockToastSuccess(message),
    error: (message: string): void => mockToastError(message),
  },
}));

describe('WelcomePage', () => {
  beforeEach((): void => {
    useAuthStore.getState().logout();
    mockNavigate.mockClear();
    mockMutateAsync.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
  });

  function setup(): RenderResult {
    return render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>,
    );
  }

  it('renders welcome form fields', (): void => {
    setup();

    expect(
      screen.getByPlaceholderText(MESSAGES_HELPER.WELCOME_SCREEN.INPUT_PLACEHOLDER),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: MESSAGES_HELPER.WELCOME_SCREEN.BUTTON }),
    ).toBeInTheDocument();
  });

  it('prefills input with existing user name from store', (): void => {
    useAuthStore.setState({
      token: 'test-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Existing Name',
      },
      isAuthenticated: true,
    });

    setup();

    const input = screen.getByPlaceholderText(
      MESSAGES_HELPER.WELCOME_SCREEN.INPUT_PLACEHOLDER,
    ) as HTMLInputElement;

    expect(input.value).toBe('Existing Name');
  });

  it('shows validation error when submitting empty name', async (): Promise<void> => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.WELCOME_SCREEN.BUTTON }));

    expect(await screen.findByText(MESSAGES_HELPER.VALIDATION.REQUIRED_FIELD)).toBeInTheDocument();
  });

  it('updates user name, calls API, shows toast and navigates on success', async (): Promise<void> => {
    mockMutateAsync.mockResolvedValue({});

    useAuthStore.setState({
      token: 'test-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Old Name',
      },
      isAuthenticated: true,
    });

    setup();

    const input = screen.getByPlaceholderText(MESSAGES_HELPER.WELCOME_SCREEN.INPUT_PLACEHOLDER);

    fireEvent.change(input, { target: { value: 'New Name' } });

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.WELCOME_SCREEN.BUTTON }));

    await waitFor((): void => {
      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('New Name');
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      data: { name: 'New Name' },
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(MESSAGES_HELPER.WELCOME_SCREEN.SUCCESS_MESSAGE);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error toast when update fails', async (): Promise<void> => {
    mockMutateAsync.mockRejectedValue(new Error('network error'));

    useAuthStore.setState({
      token: 'test-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Some Name',
      },
      isAuthenticated: true,
    });

    setup();

    const input = screen.getByPlaceholderText(MESSAGES_HELPER.WELCOME_SCREEN.INPUT_PLACEHOLDER);

    fireEvent.change(input, { target: { value: 'Another Name' } });

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.WELCOME_SCREEN.BUTTON }));

    await waitFor((): void => {
      expect(mockToastError).toHaveBeenCalledWith(MESSAGES_HELPER.GLOBAL.UNKNOWN_ERROR);
    });
  });
});
