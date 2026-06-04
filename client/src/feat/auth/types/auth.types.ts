import type {
  AuthUser,
} from "@/shared/types/auth";

import { type AuthResponse as NetworkAuthResponse } from "@/shared/types/auth";

export type { AuthUser, NetworkAuthResponse };



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

export type AuthResponse = {
  user: AuthUser;
  token: string;
};