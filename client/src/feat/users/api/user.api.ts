import { api } from "@/services/api";
import type { AuthUser } from "@/shared/types/auth";

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
 * Fetch initial presence (online user IDs)
 */
export const getPresence = async (): Promise<string[]> => {
  const response = await api.get<{ success: boolean; data: string[] }>("/users/presence");
  return response.data.data;
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

/**
 * Fetch a single user by ID
 */
export const getUserByIdApi = async (id: string): Promise<AuthUser> => {
  const response = await api.get<{ success: boolean; data: AuthUser }>(`/users/${id}`);
  return response.data.data;
};
