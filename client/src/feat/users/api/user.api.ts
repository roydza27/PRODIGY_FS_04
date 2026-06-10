import { api } from "@/services/api";

export type UserSearchResult = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  displayName?: string;
  lastSeenAt?: string;
};

/**
 * Search users by name or username
 */
export const searchUsersApi = async (query: string): Promise<UserSearchResult[]> => {
  const response = await api.get<{ success: boolean; data: UserSearchResult[] }>(
    `/users/search?q=${encodeURIComponent(query)}`
  );
  return response.data.data;
};
