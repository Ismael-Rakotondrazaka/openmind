import type { Request } from '../../utils/request';
import type {
  ConfirmQuery,
  ConfirmResendBody,
  EmailUpdateBody,
  LoginBody,
  PasswordResetBody,
  PasswordResetConfirmBody,
  PasswordUpdateBody,
  RegisterBody,
} from './auth.schema';

export type ConfirmAuthData = { success: boolean };
export type ConfirmAuthRequest = Request<
  ConfirmAuthData,
  Record<string, never>,
  Record<string, never>,
  ConfirmQuery
>;

export type ConfirmResendAuthData = { success: boolean };
export type ConfirmResendAuthRequest = Request<
  ConfirmResendAuthData,
  ConfirmResendBody
>;

export type EmailUpdateAuthData = { success: boolean };
export type EmailUpdateAuthRequest = Request<
  EmailUpdateAuthData,
  EmailUpdateBody
>;

export type LoginAuthData = { success: boolean };
export type LoginAuthRequest = Request<LoginAuthData, LoginBody>;

export type LogoutAuthData = { success: boolean };
export type LogoutAuthRequest = Request<LogoutAuthData>;

export type PasswordResetAuthData = { success: boolean };
export type PasswordResetAuthRequest = Request<
  PasswordResetAuthData,
  PasswordResetBody
>;

export type PasswordResetConfirmAuthData = { success: boolean };
export type PasswordResetConfirmAuthRequest = Request<
  PasswordResetConfirmAuthData,
  PasswordResetConfirmBody
>;

export type PasswordUpdateAuthData = { success: boolean };
export type PasswordUpdateAuthRequest = Request<
  PasswordUpdateAuthData,
  PasswordUpdateBody
>;

export type RegisterAuthData = { success: boolean };
export type RegisterAuthRequest = Request<RegisterAuthData, RegisterBody>;
