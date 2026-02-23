import { api } from './client';
import type { User, UpdateProfileRequest, ChangePasswordRequest } from '@/types/auth';

export const profileApi = {
  get: () =>
    api.get<User>('/profile'),

  update: (data: UpdateProfileRequest) =>
    api.put<User>('/profile', data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<{ message: string }>('/profile/change-password', data),
};
