import { api } from "@/services/api";

export const getPresence = async () => {
  const response = await api.get<{ success: boolean; data: string[] }>("/users/presence");
  return response.data.data;
};
