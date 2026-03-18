import { markAllNotificationsRead } from '../notification.service';

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const authUser = useSupabaseUser();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(authUser.value!.sub),
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
