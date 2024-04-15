import { setProperty } from "dot-prop";

export type UseMutateUserListUpdateData = Partial<Flatten<UserFull>>;

export const useMutateUserList = (users: Ref<UserFull[] | null>) => {
  const update = (id: number, data: UseMutateUserListUpdateData) => {
    const userFound: UserFull | undefined = users.value?.find(
      (user: UserFull) => user.id === id,
    );

    if (userFound !== undefined) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element: unknown = data[key as keyof typeof data];

          if (element !== undefined) {
            setProperty(userFound, key, element);
          }
        }
      }
    }
  };

  return {
    update,
  };
};
