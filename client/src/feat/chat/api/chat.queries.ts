import { useQuery } from "@tanstack/react-query";
import { searchMessages } from "./message.api";

export const chatKeys = {
  all: ["chat"] as const,
  search: (query: string) => [...chatKeys.all, "search", query] as const,
};

export function useSearchMessages(query: string) {
  return useQuery({
    queryKey: chatKeys.search(query),
    queryFn: () => searchMessages(query),
    enabled: query.length >= 2,
  });
}
