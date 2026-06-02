// src/feat/auth/hooks/useForgotPasswordForm.ts

import { useState } from "react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "../api/auth.mutations";
import { AUTH_MESSAGES } from "../utils/auth.constants";
import { getAuthErrorMessage } from "../utils/auth.errors";

export const useForgotPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPasswordMutation = useForgotPasswordMutation();

  const sendRecoveryLink = async (email: string) => {
    setError("");
    setSuccess(false);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setSuccess(true);
      toast.success(AUTH_MESSAGES.forgotPasswordSuccess);
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return {
    sendRecoveryLink,
    loading: forgotPasswordMutation.isPending,
    error,
    success,
    setError,
    setSuccess,
  };
};