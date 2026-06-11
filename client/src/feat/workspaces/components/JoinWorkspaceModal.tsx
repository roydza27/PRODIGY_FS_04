import React, { useState } from "react";
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
import { useAcceptInvite } from "../api/workspace.queries";

interface JoinWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinWorkspaceModal = ({ isOpen, onClose }: JoinWorkspaceModalProps) => {
  const [workspaceId, setWorkspaceId] = useState("");
  const { mutate: acceptInvite, isPending } = useAcceptInvite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) {
      toast.error("Please enter a workspace ID");
      return;
    }

    acceptInvite(workspaceId, {
      onSuccess: () => {
        toast.success("Joined workspace successfully");
        setWorkspaceId("");
        onClose();
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(err?.response?.data?.error || "Failed to join workspace");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Workspace</DialogTitle>
            <DialogDescription>
              Enter the workspace ID to join an existing workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workspaceId">Workspace ID</Label>
              <Input
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="e.g. 60d5ec49..."
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Joining..." : "Join Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
