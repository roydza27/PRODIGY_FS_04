import { Hash, MoreHorizontal } from "lucide-react";

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
      className={`
        group relative flex items-center justify-between
        rounded-lg px-3 py-2
        transition-all duration-200
        ${
          isActive
            ? "bg-primary/15 text-primary"
            : "hover:bg-muted/60"
        }
      `}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      <button
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <Hash
          size={16}
          className={`
            shrink-0 transition-colors
            ${
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            }
          `}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {room.name}
          </p>

          {room.description && (
            <p className="truncate text-xs text-muted-foreground">
              {room.description}
            </p>
          )}
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="
              flex h-7 w-7 items-center justify-center
              rounded-md
              opacity-0
              transition-all duration-200
              hover:bg-background/80
              group-hover:opacity-100
              data-[state=open]:opacity-100
            "
          >
            <MoreHorizontal size={14} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40"
        >
          <UpdateRoomDialog room={room}>
            <DropdownMenuItem
              onSelect={(e) =>
                e.preventDefault()
              }
            >
              Edit Room
            </DropdownMenuItem>
          </UpdateRoomDialog>

          <DeleteRoomDialog room={room}>
            <DropdownMenuItem
              onSelect={(e) =>
                e.preventDefault()
              }
              className="text-destructive focus:text-destructive"
            >
              Delete Room
            </DropdownMenuItem>
          </DeleteRoomDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}