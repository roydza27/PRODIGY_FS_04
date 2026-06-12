import { Hash, MoreHorizontal, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import type { Room } from "../types/room.types";

import UpdateRoomDialog from "./UpdateRoomDialog";
import DeleteRoomDialog from "./DeleteRoomDialog";

interface RoomItemProps {
  room: Room;
  isActive?: boolean;
  onClick?: () => void;
}

export default function RoomItem({
  room,
  isActive,
  onClick,
}: RoomItemProps) {
  const extendedRoom = room as Room & {
    lastMessage?: { senderId?: { name?: string }; text?: string };
    unreadCount?: number;
    mentionCount?: number;
  };
  const lastMessage = extendedRoom.lastMessage;
  const unreadCount = extendedRoom.unreadCount || 0;
  const mentionCount = extendedRoom.mentionCount || 0;

  return (
    <div
      className={cn(
        "group relative flex items-center justify-between rounded-xl px-2 py-2 transition-all duration-300",
        isActive
          ? "bg-brand/10 text-foreground shadow-[0_0_20px_rgba(139,92,246,0.05)] ring-1 ring-white/10"
          : unreadCount > 0 
            ? "bg-white/[0.03] text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      )}
    >
      <button
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left px-1"
      >
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
          isActive 
            ? "border-white/10 bg-brand/10 text-foreground shadow-inner shadow-brand/10" 
            : unreadCount > 0
              ? "border-brand/20 bg-brand/5 text-brand/80"
              : "border-border/50 bg-muted/30 text-muted-foreground/50 group-hover:border-brand/20 group-hover:bg-brand/5 group-hover:text-brand/60"
        )}>
          {room.isPrivate ? (
            <Lock size={16} strokeWidth={2.5} />
          ) : (
            <Hash size={18} strokeWidth={2.5} />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col items-start">
          <div className="flex w-full items-center justify-between gap-1">
            <p className={cn(
              "truncate text-[14px] font-bold tracking-tight transition-colors",
              isActive ? "text-foreground" : unreadCount > 0 ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"
            )}>
              {room.name}
            </p>
            {mentionCount > 0 && (
              <div className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white shadow-lg shadow-red-500/20">
                {mentionCount}
              </div>
            )}
          </div>

          <div className="flex w-full items-center min-w-0">
             <p className={cn(
              "truncate text-[11px] font-medium transition-colors leading-tight",
              isActive ? "text-primary/60" : unreadCount > 0 ? "font-bold text-foreground/90" : "text-muted-foreground/40 group-hover:text-muted-foreground/60"
            )}>
              {lastMessage ? (
                <span className="flex items-center gap-1">
                  <span className="font-bold shrink-0">{lastMessage.senderId?.name?.split(' ')[0]}:</span>
                  <span className="truncate">{lastMessage.text}</span>
                </span>
              ) : (
                room.isPrivate ? "Private Room" : "Public Channel"
              )}
            </p>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1 pr-1">
        {unreadCount > 0 && !mentionCount && !isActive && (
          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-brand" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg
                opacity-0
                transition-all duration-300
                hover:bg-primary/10
                hover:text-primary
                group-hover:opacity-100
                data-[state=open]:opacity-100
              "
            >
              <MoreHorizontal size={14} strokeWidth={2.5} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl border-border/50 bg-popover/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            <UpdateRoomDialog room={room}>
              <DropdownMenuItem
                className="rounded-lg font-medium"
                onSelect={(e) =>
                  e.preventDefault()
                }
              >
                Edit Room
              </DropdownMenuItem>
            </UpdateRoomDialog>

            <div className="my-1 h-px bg-border/50" />

            <DeleteRoomDialog room={room}>
              <DropdownMenuItem
                onSelect={(e) =>
                  e.preventDefault()
                }
                className="rounded-lg font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                Delete Room
              </DropdownMenuItem>
            </DeleteRoomDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        {isActive && (
          <div className="h-6 w-1 rounded-l-full bg-brand shadow-[0_0_10px_#8b5cf6] animate-in slide-in-from-right-1" />
        )}
      </div>
    </div>
  );
}