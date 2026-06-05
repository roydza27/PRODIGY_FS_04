import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { useCreateRoom } from "../hooks/useCreateRoom";

interface Props {
  workspaceId: string;
  trigger: ReactNode;
}

interface FormValues {
  name: string;
  description: string;
}

export default function CreateRoomDialog({
  workspaceId,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);

  const createRoomMutation = useCreateRoom();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await createRoomMutation.mutateAsync({
      workspaceId,
      name: values.name,
      description: values.description,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>

          <DialogDescription>
            Create a new room for your workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Room Name
            </label>

            <Input
              placeholder="general"
              {...register("name", {
                required: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Input
              placeholder="General workspace discussion"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createRoomMutation.isPending}
            >
              {createRoomMutation.isPending
                ? "Creating..."
                : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}