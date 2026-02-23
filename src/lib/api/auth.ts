import { api } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),

  logout: () =>
    api.post<{ message: string }>('/auth/logout'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<{ message: string }>('/auth/reset-password', data),
};
