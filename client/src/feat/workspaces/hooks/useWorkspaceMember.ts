import { useMemo } from "react";

import { useAuthStore } from "@/app/stores/auth.store";

import { useActiveWorkspace } from "./useActiveWorkspace";
import { useGetWorkspaceMembers } from "../api/workspace.queries";

export const useWorkspaceMember = () => {
  const { activeWorkspace } = useActiveWorkspace();
  const { user } = useAuthStore();

  const { data: members, isLoading } =
    useGetWorkspaceMembers(
      activeWorkspace?._id || "",
      !!activeWorkspace
    );

  const membership = useMemo(() => {
    if (!members || !user) return null;

    return (
      members.find(
        (member) =>
          String(
            typeof member.userId === "string"
              ? member.userId
              : member.userId._id
          ) === String(user.id)
      ) ?? null
    );
  }, [members, user]);

  return {
    membership,
    role: membership?.role ?? null,
    isOwner: membership?.role === "owner",
    isAdmin:
      membership?.role === "owner" ||
      membership?.role === "admin",
    isLoading,
  };
};