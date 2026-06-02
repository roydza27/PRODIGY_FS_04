// src/feat/auth/utils/auth.errors.ts

export const AUTH_ERRORS = {
  invalidCredentials: "Invalid email or password",
  registrationFailed: "Registration failed",
  googleLoginFailed: "Google authentication failed",
  forgotPasswordFailed: "Failed to send recovery email",
  resetPasswordFailed: "Failed to reset password",
  invalidToken: "Invalid or expired token",
  unknown: "Something went wrong",
} as const;

export const getAuthErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    AUTH_ERRORS.unknown
  );
};