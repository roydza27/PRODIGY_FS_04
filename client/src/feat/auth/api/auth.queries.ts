// src/feat/auth/api/auth.queries.ts

import { useQuery } from "@tanstack/react-query";
import { authApi } from "./auth.api";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};

type UseMeQueryParams = {
  token: string | null;
  enabled?: boolean;
};

export const useMeQuery = ({ token, enabled = true }: UseMeQueryParams) => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: () => {
      if (!token) {
        throw new Error("Missing auth token");
      }
      return authApi.me(token);
    },
    enabled: enabled && Boolean(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};