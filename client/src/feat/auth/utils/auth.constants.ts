// src/feat/auth/utils/auth.constants.ts

export const AUTH_ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  google: "/auth/google",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;

export const AUTH_STORAGE_KEYS = {
  session: "auth_session",
  token: "auth_token",
} as const;

export const AUTH_MESSAGES = {
  loginSuccess: "Login successful",
  registerSuccess: "Registration successful",
  forgotPasswordSuccess: "Recovery link sent",
  resetPasswordSuccess: "Password updated successfully",
  googleLoginSuccess: "Google login successful",
} as const;