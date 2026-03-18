export const useNotificationRealtime = () => {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const authUser = useSupabaseUser();

  onMounted(() => {
    const userId = authUser.value?.sub;
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`, { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeChannel(channel);
    });
  });
};
