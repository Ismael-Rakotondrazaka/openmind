import { setNotificationPreference } from '../notification-preferences.service';

export const useSetNotificationPreference = () => {
  const queryClient = useQueryClient();
  const authUser = useSupabaseUser();

  return useMutation({
    mutationFn: ({
      channel,
      enabled,
      groupName,
    }: {
      channel: string;
      enabled: boolean;
      groupName: string;
    }) =>
      setNotificationPreference(
        authUser.value!.sub,
        groupName,
        channel,
        enabled
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notification-preferences'],
      });
    },
  });
};
