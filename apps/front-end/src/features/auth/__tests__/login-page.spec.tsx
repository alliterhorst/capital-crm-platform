import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../login-page';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { useAuthStore } from '@/features/auth/stores/auth.store';

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/shared/api/generated/auth/auth', () => ({
  useLogin: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

interface BackendErrorResponse {
  statusCode: number;
  message: string;
  errors?: {
    field: string;
    errors: string[];
  }[];
}

describe('LoginPage', () => {
  beforeEach((): void => {
    useAuthStore.getState().logout();
    mockNavigate.mockClear();
    mockMutateAsync.mockClear();
  });

  function setup(): RenderResult {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
  }

  it('renders login form fields', (): void => {
    setup();

    expect(screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.EMAIL_PLACEHOLDER)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.PASSWORD_PLACEHOLDER),
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async (): Promise<void> => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.AUTH.BUTTON_LOGIN }));

    expect(await screen.findByText(MESSAGES_HELPER.VALIDATION.INVALID_EMAIL)).toBeInTheDocument();
    expect(await screen.findByText(MESSAGES_HELPER.VALIDATION.MIN_PASSWORD)).toBeInTheDocument();
  });

  it('submits successfully and stores auth data on success', async (): Promise<void> => {
    mockMutateAsync.mockResolvedValue({
      accessToken: 'test-token',
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.EMAIL_PLACEHOLDER), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.PASSWORD_PLACEHOLDER), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.AUTH.BUTTON_LOGIN }));

    await waitFor((): void => {
      const state = useAuthStore.getState();
      expect(state.token).toBe('test-token');
      expect(state.isAuthenticated).toBe(true);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      data: { email: 'user@example.com', password: '123456' },
    });
    expect(mockNavigate).toHaveBeenCalledWith('/welcome');
  });

  it('maps backend validation errors to form fields', async (): Promise<void> => {
    const backendError: BackendErrorResponse = {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        { field: 'email', errors: ['Invalid email provided'] },
        { field: 'password', errors: ['Incorrect password'] },
      ],
    };

    mockMutateAsync.mockRejectedValue({
      response: { data: backendError },
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.EMAIL_PLACEHOLDER), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(MESSAGES_HELPER.AUTH.PASSWORD_PLACEHOLDER), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: MESSAGES_HELPER.AUTH.BUTTON_LOGIN }));

    expect(await screen.findByText('Invalid email provided')).toBeInTheDocument();
    expect(await screen.findByText('Incorrect password')).toBeInTheDocument();
  });
});
