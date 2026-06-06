import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "@/app/stores/auth.store";

import { useGetWorkspaces } from "../api/workspace.queries";
import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Returns the currently active workspace
 */
export const useActiveWorkspace = () => {
  const { workspaceSlug } = useParams();

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

  const activeWorkspace = useMemo(() => {
    if (workspaceSlug) {
      return (
        workspaces.find(
          (workspace) =>
            workspace.slug === workspaceSlug
        ) ?? null
      );
    }

    return (
      workspaces.find(
        (workspace) =>
          workspace._id === activeWorkspaceId
      ) ?? null
    );
  }, [workspaces, activeWorkspaceId, workspaceSlug]);

  return {
    activeWorkspace,
    workspaces,
    isLoading: authLoading || workspacesLoading,
  };
};