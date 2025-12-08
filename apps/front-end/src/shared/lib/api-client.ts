import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2,
    },
  },
});

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().token;
    console.log('Token in request interceptor:', token);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      toast.error('Sessão expirada ou credenciais inválidas.');
      useAuthStore.getState().logout();
    } else {
      toast.error(error.response?.statusText || MESSAGES_HELPER.GLOBAL.UNKNOWN_ERROR);
    }
    return Promise.reject(error);
  },
);

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): CancellablePromise<T> => {
  const controller = new AbortController();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    signal: controller.signal,
  }).then(({ data }) => data) as CancellablePromise<T>;

  promise.cancel = (): void => {
    controller.abort();
  };

  return promise;
};
