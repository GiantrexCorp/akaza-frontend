import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { profileApi } from '@/lib/api/profile';
import type { UpdateProfileRequest, ChangePasswordRequest } from '@/types/auth';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileApi.get(),
    ...CACHE_TIME.SHORT,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
  });
}
