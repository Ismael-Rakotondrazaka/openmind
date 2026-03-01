import { updateAuthUserEmail } from '../auth.service';

export const useUpdateAuthUserEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { email: string; emailRedirectTo?: string }) => {
      return updateAuthUserEmail(params.email, params.emailRedirectTo);
    },
    onSuccess: userId => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        queryClient.invalidateQueries({ queryKey: ['auth-user', 'claims'] });
      }
    },
  });
};
