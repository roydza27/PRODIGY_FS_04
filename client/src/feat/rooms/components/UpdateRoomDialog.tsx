import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { logger } from "@/utils/logger";
import { useUpdateRoom } from "../api/room.queries";

import type { Room } from "../types/room.types";

interface Props {
  room: Room;
  children: ReactNode;
}

interface FormValues {
  name: string;
  description: string;
}

export default function UpdateRoomDialog({
  room,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const updateRoomMutation = useUpdateRoom();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: room.name,
      description: room.description ?? "",
    });
  }, [room, reset]);

  const onSubmit = async (
    values: FormValues
  ) => {
    try {
      await updateRoomMutation.mutateAsync({
        workspaceId: room.workspaceId,
        roomId: room._id,

        name: values.name.trim(),
        description:
          values.description.trim(),
      });

      setOpen(false);
    } catch (error) {
      logger.error("Failed to update room:", error);
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
            Edit Room
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            {...register("name", {
              required: true,
              minLength: 2,
            })}
            placeholder="Room Name"
          />

          <Input
            {...register("description")}
            placeholder="Description"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={
              updateRoomMutation.isPending
            }
          >
            {updateRoomMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}