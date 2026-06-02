// src/feat/auth/hooks/useSignupForm.ts

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../api/auth.mutations";
import { AUTH_MESSAGES } from "../utils/auth.constants";
import { getAuthErrorMessage } from "../utils/auth.errors";
import { passwordsMatch, normalizeUsername } from "../utils/auth.helpers";
import type { RegisterPayload } from "../types/auth.types";

type SignupValues = RegisterPayload & {
  confirmPassword: string;
  acceptTerms: boolean;
};

export const useSignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const registerMutation = useRegisterMutation();

  const signup = async (values: SignupValues) => {
    setError("");

    if (!passwordsMatch(values.password, values.confirmPassword)) {
      setError("Passwords do not match");
      return;
    }

    if (!values.acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        ...values,
        username: normalizeUsername(values.username),
      });

      toast.success(AUTH_MESSAGES.registerSuccess);
      navigate("/login", { replace: true });
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return {
    signup,
    loading: registerMutation.isPending,
    error,
    setError,
  };
};