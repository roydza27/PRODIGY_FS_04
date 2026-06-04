import { useActiveWorkspace } from "./useActiveWorkspace";
import { useAuthStore } from "@/app/stores/auth.store";
import { useGetWorkspaceMembers } from "../api/workspace.queries";
import { useMemo } from "react";

/**
 * Hook to get the current user's role and membership in the active workspace
 */
export const useWorkspaceMember = () => {
  const { activeWorkspace } = useActiveWorkspace();
  const { user } = useAuthStore();
  const { data: members, isLoading } = useGetWorkspaceMembers(
    activeWorkspace?._id || "",
    !!activeWorkspace
  );

  const membership = useMemo(() => {
    if (!members || !user) return null;
    return members.find((m) => m.userId === user.id) || null;
  }, [members, user]);

  return {
    membership,
    role: membership?.role || null,
    isAdmin: membership?.role === "admin" || membership?.role === "owner",
    isOwner: membership?.role === "owner",
    isLoading,
  };
};
