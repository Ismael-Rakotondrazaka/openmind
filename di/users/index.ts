/* -------------------------------------------------------------------------- */
/*                                  Auth user                                 */
/* -------------------------------------------------------------------------- */

export type AuthUserDI = {
  user: Ref<UserFull | null>;
};

export const AuthUserToken = Symbol(
  "AuthUserToken",
) as InjectionKey<AuthUserDI>;

/* -------------------------------------------------------------------------- */
/*                                  Show user                                 */
/* -------------------------------------------------------------------------- */

export type ShowUserDI = {
  user: Ref<ShowUserData["user"]>;
};

export const ShowUserToken = Symbol(
  "ShowUserToken",
) as InjectionKey<ShowUserDI>;

/* -------------------------------------------------------------------------- */
/*                                  Edit User                                 */
/* -------------------------------------------------------------------------- */
export type EditUserDI = {
  user: Ref<UpdateUserData["user"]>;
};

export const EditUserToken = Symbol(
  "EditUserToken",
) as InjectionKey<EditUserDI>;
