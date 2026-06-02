// src/feat/auth/api/auth.mutations.ts

import { useMutation } from "@tanstack/react-query";
import type {
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";
import { authApi } from "./auth.api";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: (data: GoogleLoginPayload) => authApi.googleLogin(data.credential),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) =>
      authApi.forgotPassword(data.email),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) =>
      authApi.resetPassword(data.password, data.token),
  });
};