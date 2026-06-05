import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginMutation } from "../api/auth.mutations";
import { useAuthStore } from "@/app/stores/auth.store";
import { AUTH_MESSAGES } from "../utils/auth.constants";
import { getAuthErrorMessage } from "../utils/auth.errors";
import type { LoginPayload } from "../types/auth.types";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation();

  const login = async (values: LoginPayload) => {
    setError("");

    try {
      const data = await loginMutation.mutateAsync(values);

      setSession({
        user: data.user,
        token: data.token,
        remember: values.remember ?? false,
      });

      toast.success(AUTH_MESSAGES.loginSuccess);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return {
    login,
    loading: loginMutation.isPending,
    error,
    setError,
  };
};