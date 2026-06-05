import { useMemo } from "react";

import { useAuthStore } from "@/app/stores/auth.store";

import { useGetWorkspaces } from "../api/workspace.queries";
import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Returns the currently active workspace
 */
export const useActiveWorkspace = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const authLoading = useAuthStore(
    (state) => state.isLoading
  );

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

  const {
    data: workspaces = [],
    isLoading: workspacesLoading,
  } = useGetWorkspaces(
    isAuthenticated && !authLoading
  );

  const activeWorkspace = useMemo(
    () =>
      workspaces.find(
        (workspace) =>
          workspace._id === activeWorkspaceId
      ) ?? null,
    [workspaces, activeWorkspaceId]
  );

  return {
    activeWorkspace,
    workspaces,
    isLoading: authLoading || workspacesLoading,
  };
};