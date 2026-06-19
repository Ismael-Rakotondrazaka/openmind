export interface AppAuthError {
  code?: string;
  message: string;
}

export const authErrorCodeMessageMap: Record<string, string> = {
  'auth.confirm.errors.expiredToken':
    'This confirmation link has expired. Please request a new one.',
  'auth.confirm.errors.invalidToken': 'This confirmation link is invalid.',
  'auth.passwordReset.errors.expiredToken':
    'This password reset link has expired.',
  'auth.passwordReset.errors.invalidToken':
    'This password reset link is invalid or already used.',
  'auth.settings.email.errors.alreadyTaken':
    'This email address is already in use.',
  'auth.signIn.form.errors.credentials.notMatch': 'Invalid email or password.',
  'auth.signIn.form.errors.emailNotVerified':
    'Please verify your email address before signing in.',
  'auth.signUp.form.errors.email.alreadyTaken':
    'An account with this email already exists.',
  'auth.signUp.form.errors.username.alreadyTaken':
    'This username is already taken.',
};

export const getAuthErrorMessage = (error: AppAuthError): string => {
  if (error.code) {
    return authErrorCodeMessageMap[error.code] ?? error.message;
  }

  return error.message;
};
