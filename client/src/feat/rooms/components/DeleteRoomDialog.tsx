import type { ReactNode } from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import { logger } from "@/utils/logger";
import { useDeleteRoom } from "../api/room.queries";

import type { Room } from "../types/room.types";

interface Props {
  room: Room;
  children: ReactNode;
}

export default function DeleteRoomDialog({
  room,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const deleteRoomMutation =
    useDeleteRoom();

  const handleDelete = async () => {
    try {
      await deleteRoomMutation.mutateAsync({
        workspaceId: room.workspaceId,
        roomId: room._id,
      });

      setOpen(false);
    } catch (error) {
      logger.error("Failed to delete room:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Room
          </DialogTitle>

          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong>{room.name}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              deleteRoomMutation.isPending
            }
          >
            {deleteRoomMutation.isPending
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}