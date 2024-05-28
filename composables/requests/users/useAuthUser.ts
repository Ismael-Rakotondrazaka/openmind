export const useAuthUser = () => {
  const { data } = useAuth();

  const user = ref<UserFull | null>(null);

  watch(
    () => data.value?.user,
    (newValue) => {
      if (newValue !== undefined) {
        const spr = UserFullSchema.safeParse(newValue);
        if (spr.success) {
          user.value = spr.data;
        } else {
          user.value = null;
        }
      } else {
        user.value = null;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    user,
  };
};
