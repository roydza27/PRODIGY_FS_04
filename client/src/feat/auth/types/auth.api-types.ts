import type {
  AuthResponse,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "./auth.types";

export type LoginApiResponse = AuthResponse;
export type RegisterApiResponse = AuthResponse;
export type GoogleLoginApiResponse = AuthResponse;

export type ForgotPasswordApiResponse = {
  success: boolean;
  message: string;
};

export type ResetPasswordApiResponse = {
  success: boolean;
  message: string;
};

export type LoginApiPayload = LoginPayload;
export type RegisterApiPayload = RegisterPayload;
export type GoogleLoginApiPayload = GoogleLoginPayload;
export type ForgotPasswordApiPayload = ForgotPasswordPayload;
export type ResetPasswordApiPayload = ResetPasswordPayload;