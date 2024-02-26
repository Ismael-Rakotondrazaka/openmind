import { useShowUser } from "./useShowUser";

export const useAuthUser = () => {
  const { data } = useAuth();

  const userId = computed<number>(() => {
    if (
      data.value === null ||
      data.value === undefined ||
      data.value.user === undefined ||
      !Object.prototype.hasOwnProperty.call(data.value.user, "id")
    ) {
      return -1;
    } else {
      const id = (data.value.user as Record<string, unknown>).id;

      return typeof id === "number" ? id : -1;
    }
  });

  const { user } = useShowUser({
    params: () => ({
      id: userId.value,
    }),
    immediate: true,
  });

  return {
    user,
  };
};
