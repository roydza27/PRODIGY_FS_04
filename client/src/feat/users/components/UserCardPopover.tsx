import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import UserCard from "./UserCard";

import { useAuthStore } from "@/app/stores/auth.store";
import { getOrCreateDM } from "@/feat/chat/api/conversation.api";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface UserCardPopoverProps {
  user: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
    bio?: string;
    statusMessage?: string;
  };
  children: ReactNode;
  onViewProfile?: () => void;
}

export default function UserCardPopover({
  user,
  children,
  onViewProfile,
}: UserCardPopoverProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { activeWorkspace } = useActiveWorkspace();

  const isCurrentUser =
    user._id === currentUser?.id;

  const handleMessage = async () => {
    if (isCurrentUser || !activeWorkspace) return;

    try {
      const conversation = await getOrCreateDM(activeWorkspace._id, {
        participantId: user._id
      });

      navigate(`/dm/${conversation._id}`);
    } catch (error) {
      console.error("Failed to open DM:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        <UserCard
          user={user}
          onMessage={!isCurrentUser ? handleMessage : undefined}
          onViewProfile={onViewProfile}
        />
      </PopoverContent>
    </Popover>
  );
}