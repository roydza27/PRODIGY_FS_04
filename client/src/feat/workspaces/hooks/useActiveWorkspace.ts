import { useMemo } from "react";
import { useAuthStore } from "@/app/stores/auth.store";
import { useGetWorkspaces } from "../api/workspace.queries";
import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Hook to get the currently active workspace object
 */
export const useActiveWorkspace = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { activeWorkspaceId } = useWorkspaceStore();

  const canFetchWorkspaces = isAuthenticated && !isLoading;

  const { data: workspaces, isLoading: isWorkspacesLoading } = useGetWorkspaces(canFetchWorkspaces);

  const activeWorkspace = useMemo(() => {
    if (!workspaces || !activeWorkspaceId) return null;
    return workspaces.find((w) => w._id === activeWorkspaceId) || null;
  }, [workspaces, activeWorkspaceId]);

  return {
    activeWorkspace,
    isLoading: isLoading || isWorkspacesLoading,
    workspaces,
  };
};