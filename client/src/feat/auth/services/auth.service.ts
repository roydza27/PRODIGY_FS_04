import { api } from "@/services/api";
import { AUTH_ROUTES } from "../utils/auth.constants";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>(AUTH_ROUTES.login, data);
  return response.data.data;
}

export async function registerUser(data: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>(AUTH_ROUTES.register, data);
  return response.data.data;
}

export async function getMe(): Promise<AuthUser> {
  const response = await api.get<ApiEnvelope<AuthUser>>(AUTH_ROUTES.me);

  return response.data.data;
}

export async function loginWithGoogleAPI(credential: string): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>(AUTH_ROUTES.google, { credential });
  return response.data.data;
}

export async function forgotPasswordAPI(
  email: ForgotPasswordPayload["email"]
): Promise<{ success: boolean; message: string }> {
  const response = await api.post(AUTH_ROUTES.forgotPassword, { email });
  return response.data;
}

export async function resetPasswordAPI(
  password: ResetPasswordPayload["password"],
  token: ResetPasswordPayload["token"]
): Promise<{ success: boolean; message: string }> {
  const response = await api.post(AUTH_ROUTES.resetPassword, { password, token });
  return response.data;
}