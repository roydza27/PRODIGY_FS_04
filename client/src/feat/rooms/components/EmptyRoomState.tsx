import { Hash, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";

import CreateRoomDialog from "./CreateRoomDialog";

export default function EmptyRoomState() {
  const { activeWorkspace } = useActiveWorkspace();

  if (!activeWorkspace) return null;

  return (
    <div className="px-2">
      <div className="rounded-lg border border-dashed border-white/10 p-3 text-left">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5">
            <Hash className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium">
              No rooms yet
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Create your first room to start collaborating.
            </p>

            <CreateRoomDialog
              workspaceId={activeWorkspace._id}
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-7 px-2 text-xs bg-white text-black"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Create room
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}