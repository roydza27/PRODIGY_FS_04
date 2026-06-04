import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
  resetWorkspace: () => void;
}

/**
 * Workspace Store
 * 
 * Handles client-side state for the currently active workspace.
 * Uses local storage to persist the selection across page refreshes.
 */
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,

      /**
       * Set the active workspace ID
       */
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

      /**
       * Reset the workspace state (e.g., on logout)
       */
      resetWorkspace: () => set({ activeWorkspaceId: null }),
    }),
    {
      name: "workspace-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

