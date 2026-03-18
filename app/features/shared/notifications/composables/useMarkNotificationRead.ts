import { markNotificationRead } from '../notification.service';

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const authUser = useSupabaseUser();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      if (authUser.value?.sub) {
        queryClient.invalidateQueries({
          queryKey: ['user', authUser.value.sub],
        });
      }
    },
  });
};
