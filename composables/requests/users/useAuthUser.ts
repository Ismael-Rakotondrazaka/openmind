import { useShowUser } from "./useShowUser";

export const useAuthUser = () => {
  const { data } = useAuth();

  const userId = computed<string>(() => {
    if (
      data.value === null ||
      data.value === undefined ||
      data.value.user === undefined ||
      !Object.prototype.hasOwnProperty.call(data.value.user, "username")
    ) {
      return "";
    } else {
      const username = (data.value.user as Record<string, unknown>).username;

      return typeof username === "string" ? username : "";
    }
  });

  const { user } = useShowUser({
    params: () => ({
      username: userId.value,
    }),
    immediate: true,
  });

  return {
    user,
  };
};
