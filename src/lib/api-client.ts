import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useI18nStore } from '@/store/i18n.store';

export const api: AxiosInstance = axios.create({
  baseURL: '/api/sarbon',
  timeout: 15_000,
  headers: { accept: '*/*' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const language = typeof window !== 'undefined' ? useI18nStore.getState().language : 'uz';
  config.headers.set('X-Language', language);
  return config;
});

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; description?: string; error?: string }>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.description ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Network error',
      code: error.code,
    };
    return Promise.reject(apiError);
  }
);
