import { updateAuthUserPassword } from '../auth.service';

export const useUpdateAuthUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      return updateAuthUserPassword(password);
    },
    onSuccess: userId => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        queryClient.invalidateQueries({ queryKey: ['auth-user', 'claims'] });
      }
    },
  });
};
