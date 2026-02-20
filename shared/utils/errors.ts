import type { AuthError } from '@supabase/auth-js';

const authErrorCodeMessageMap: Record<string, string> = {
  anonymous_provider_disabled: 'Anonymous sign-in is disabled.',
  bad_code_verifier: 'The code verifier is invalid. Please try again.',
  bad_json: 'The request format is invalid.',
  bad_jwt: 'Your session token is invalid.',
  bad_oauth_callback: 'The OAuth callback is invalid.',
  bad_oauth_state: 'The OAuth state is invalid or has expired.',
  captcha_failed: 'Captcha verification failed. Please try again.',
  conflict: 'This request conflicts with existing data.',
  email_address_invalid: 'Please enter a valid email address.',
  email_address_not_authorized: 'This email address is not authorized.',
  email_conflict_identity_not_deletable:
    'This email is linked to an identity that cannot be deleted.',
  email_exists: 'An account with this email already exists.',
  email_not_confirmed: 'Please confirm your email address first.',
  email_provider_disabled: 'Email authentication is disabled.',
  flow_state_expired: 'Your authentication session expired. Please try again.',
  flow_state_not_found: 'Authentication session not found. Please start again.',
  hook_payload_invalid_content_type:
    'The webhook payload content type is invalid.',
  hook_payload_over_size_limit: 'The webhook payload is too large.',
  hook_timeout: 'The webhook timed out. Please try again.',
  hook_timeout_after_retry: 'The webhook timed out after retries.',
  identity_already_exists: 'This identity is already linked to your account.',
  identity_not_found: 'Identity not found.',
  insufficient_aal:
    'A higher authentication level is required for this action.',
  invalid_credentials: 'Invalid email or password.',
  invite_not_found: 'This invite is invalid or has expired.',
  manual_linking_disabled: 'Manual account linking is disabled.',
  mfa_challenge_expired: 'The MFA challenge has expired. Please try again.',
  mfa_factor_name_conflict: 'An MFA factor with this name already exists.',
  mfa_factor_not_found: 'MFA factor not found.',
  mfa_ip_address_mismatch:
    'MFA verification must be completed from the same IP address.',
  mfa_phone_enroll_not_enabled: 'Phone MFA enrollment is disabled.',
  mfa_phone_verify_not_enabled: 'Phone MFA verification is disabled.',
  mfa_totp_enroll_not_enabled: 'Authenticator app MFA enrollment is disabled.',
  mfa_totp_verify_not_enabled:
    'Authenticator app MFA verification is disabled.',
  mfa_verification_failed: 'MFA verification failed. Please try again.',
  mfa_verification_rejected: 'MFA verification was rejected.',
  mfa_verified_factor_exists: 'A verified MFA factor already exists.',
  mfa_webauthn_enroll_not_enabled: 'Security key MFA enrollment is disabled.',
  mfa_webauthn_verify_not_enabled: 'Security key MFA verification is disabled.',
  no_authorization: 'You are not authorized to perform this action.',
  not_admin: 'Admin access is required for this action.',
  oauth_provider_not_supported: 'This OAuth provider is not supported.',
  otp_disabled: 'One-time password sign-in is disabled.',
  otp_expired: 'The one-time password has expired.',
  over_email_send_rate_limit:
    'Too many email requests. Please wait and try again.',
  over_request_rate_limit: 'Too many requests. Please wait and try again.',
  over_sms_send_rate_limit: 'Too many SMS requests. Please wait and try again.',
  phone_exists: 'An account with this phone number already exists.',
  phone_not_confirmed: 'Please confirm your phone number first.',
  phone_provider_disabled: 'Phone authentication is disabled.',
  provider_disabled: 'This authentication provider is disabled.',
  provider_email_needs_verification:
    'Please verify your email with the provider before continuing.',
  reauth_nonce_missing: 'Reauthentication token is missing.',
  reauthentication_needed: 'Please reauthenticate to continue.',
  reauthentication_not_valid: 'Reauthentication failed. Please try again.',
  refresh_token_already_used: 'This session token has already been used.',
  refresh_token_not_found: 'Session token not found. Please sign in again.',
  request_timeout: 'The request timed out. Please try again.',
  same_password: 'Your new password must be different from your old password.',
  saml_assertion_no_email: 'The SAML response did not include an email.',
  saml_assertion_no_user_id: 'The SAML response did not include a user ID.',
  saml_entity_id_mismatch: 'The SAML entity ID does not match.',
  saml_idp_already_exists: 'This SAML identity provider already exists.',
  saml_idp_not_found: 'SAML identity provider not found.',
  saml_metadata_fetch_failed: 'Could not fetch SAML metadata.',
  saml_provider_disabled: 'SAML authentication is disabled.',
  saml_relay_state_expired: 'The SAML relay state has expired.',
  saml_relay_state_not_found: 'SAML relay state not found.',
  session_expired: 'Your session has expired. Please sign in again.',
  session_not_found: 'Session not found. Please sign in again.',
  signup_disabled: 'New sign-ups are currently disabled.',
  single_identity_not_deletable:
    'You cannot remove the only identity linked to this account.',
  sms_send_failed: 'Failed to send SMS. Please try again.',
  sso_domain_already_exists: 'This SSO domain is already configured.',
  sso_provider_not_found: 'SSO provider not found.',
  too_many_enrolled_mfa_factors:
    'You have reached the maximum number of MFA factors.',
  unexpected_audience: 'The token audience is invalid.',
  unexpected_failure: 'Something went wrong. Please try again.',
  user_already_exists: 'An account with these details already exists.',
  user_banned: 'This account has been blocked.',
  user_not_found: 'Account not found.',
  user_sso_managed:
    'This account is managed by SSO and cannot be updated here.',
  validation_failed: 'Some provided data is invalid.',
  weak_password: 'Your password is too weak. Please choose a stronger one.',
};

export const getAuthErrorMessage = (error: AuthError): string => {
  if (error.code) {
    return authErrorCodeMessageMap[error.code] || error.message;
  }

  return error.message;
};
