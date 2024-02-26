export type AuthUserDI = {
  user: Ref<UserFull | null>;
};

export const AuthUserToken = Symbol(
  "AuthUserToken",
) as InjectionKey<AuthUserDI>;
