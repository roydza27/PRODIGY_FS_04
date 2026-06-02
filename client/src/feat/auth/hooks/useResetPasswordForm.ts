import { useState } from "react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../api/auth.mutations";
import { AUTH_MESSAGES } from "../utils/auth.constants";
import { getAuthErrorMessage } from "../utils/auth.errors";
import { hasResetToken, passwordsMatch } from "../utils/auth.helpers";

type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
  token: string;
};

export const useResetPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = useResetPasswordMutation();

  const resetPassword = async (values: ResetPasswordValues) => {
    setError("");
    setSuccess(false);

    if (!hasResetToken(values.token)) {
      setError("Invalid or expired reset token.");
      return;
    }

    if (!passwordsMatch(values.password, values.confirmPassword)) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        password: values.password,
        token: values.token,
      });

      setSuccess(true);
      toast.success(AUTH_MESSAGES.resetPasswordSuccess);
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return {
    resetPassword,
    loading: resetPasswordMutation.isPending,
    error,
    success,
    setError,
    setSuccess,
  };
};