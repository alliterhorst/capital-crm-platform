import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';

interface BackendError {
  message: string;
  statusCode: number;
  errors?: { field: string; errors: string[] }[];
}

export const AXIOS_INSTANCE = axios.create({
  baseURL: 'http://localhost:3000',
});

AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('capital-crm-token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError<BackendError>): Promise<never> => {
    if (!error.response) {
      toast.error(MESSAGES_HELPER.GLOBAL.CONNECTION_ERROR);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || MESSAGES_HELPER.GLOBAL.UNKNOWN_ERROR;

    switch (status) {
      case 401:
      case 403:
      case 404:
      case 500:
        toast.error(message);
        break;

      case 400:
      case 422:
        if (!data?.errors || !Array.isArray(data.errors) || data.errors.length === 0) {
          toast.error(message);
        }
        break;

      default:
        toast.error(message);
        break;
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
