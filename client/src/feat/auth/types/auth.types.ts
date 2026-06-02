import type {
  AuthUser,
  AuthResponse,
} from "@/shared/types/auth";

export type { AuthUser, AuthResponse };

export type AuthSession = {
  user: AuthUser;
  token: string;
  remember?: boolean;
};

export type LoginPayload = {
  identifier: string;
  password: string;
  remember?: boolean;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  token: string;
};

export type GoogleLoginPayload = {
  credential: string;
};

export type ApiSuccessResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};