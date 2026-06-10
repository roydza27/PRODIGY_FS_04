import { useQuery } from "@tanstack/react-query";
import * as userApi from "./user.api";

export const userKeys = {
  all: ["users"] as const,
  search: (query: string) => [...userKeys.all, "search", query] as const,
};

/**
 * Query: Search users
 */
export const useSearchUsers = (query: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userApi.searchUsersApi(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};
