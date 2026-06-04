import { useState } from "react";
import { useActiveWorkspace } from "../hooks/useActiveWorkspace";
import { MemberList } from "../components/MemberList";
import { InviteMemberModal } from "../components/InviteMemberModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { UserPlus, Settings, ShieldAlert } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const { activeWorkspace, isLoading } = useActiveWorkspace();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground animate-pulse">Loading workspace settings...</p>
      </div>
    );
  }

  if (!activeWorkspace) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Please select a workspace first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace details, members, and permissions.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Update your workspace name and description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Workspace Name</label>
              <p className="text-sm p-2 bg-muted rounded-md">{activeWorkspace.name}</p>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm p-2 bg-muted rounded-md italic">
                {activeWorkspace.description || "No description set."}
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Edit Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage people who have access to this workspace.</CardDescription>
            </div>
            <Button className="gap-2" onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="h-4 w-4" /> Invite Member
            </Button>
          </CardHeader>
          <CardContent>
            <MemberList workspaceId={activeWorkspace._id} />
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions related to this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="gap-2">
              <ShieldAlert className="h-4 w-4" /> Delete Workspace
            </Button>
          </CardContent>
        </Card>
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={activeWorkspace._id}
      />
    </div>
  );
}

