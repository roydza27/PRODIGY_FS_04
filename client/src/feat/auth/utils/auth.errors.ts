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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getAuthErrorMessage = (error: unknown): string => {
  const err = error as ApiError;
  return (
    err?.response?.data?.message ||
    err?.message ||
    AUTH_ERRORS.unknown
  );
};