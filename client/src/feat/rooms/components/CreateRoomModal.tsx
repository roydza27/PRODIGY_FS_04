import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { useRooms } from "../hooks/useRooms";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const CreateRoomModal = ({ isOpen, onClose, workspaceId }: CreateRoomModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createRoom, isLoading } = useRooms(workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a channel name");
      return;
    }

    try {
      await createRoom({ name, description });
      toast.success("Channel created successfully");
      setName("");
      setDescription("");
      onClose();
      // Reload page to reflect new rooms easily (or rely on state from useRooms if hoisted)
      // Since useRooms state here is isolated, let's just dispatch an event or reload for simplicity
      window.location.reload(); 
    } catch (error) {
      // Error handled by hook toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>
              Channels are where your team communicates. They're best when organized around a topic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. engineering"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this channel about?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
