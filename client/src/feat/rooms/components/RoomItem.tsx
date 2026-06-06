import { Hash, MoreHorizontal, Lock, Globe } from "lucide-react";

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
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between rounded-xl px-2 py-2 transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-primary/20"
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
            ? "border-primary/30 bg-primary/10 text-primary shadow-inner shadow-primary/10" 
            : "border-border/50 bg-muted/30 text-muted-foreground/50 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary/60"
        )}>
          {room.isPrivate ? (
            <Lock size={16} strokeWidth={2.5} />
          ) : (
            <Hash size={18} strokeWidth={2.5} />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col items-start">
          <p className={cn(
            "truncate text-[14px] font-bold tracking-tight transition-colors",
            isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"
          )}>
            {room.name}
          </p>

          <p className={cn(
            "truncate text-[10px] font-bold uppercase tracking-widest transition-colors",
            isActive ? "text-primary/60" : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
          )}>
            {room.isPrivate ? "Private Room" : "Public Channel"}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1 pr-1">
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
          <div className="h-6 w-1 rounded-l-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-in slide-in-from-right-1" />
        )}
      </div>
    </div>
  );
}