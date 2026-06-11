import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Settings, 
  ShieldAlert, 
  Trash2, 
  Save, 
  Building2,
  AlertTriangle,
  LogOut
} from "lucide-react";

import { useActiveWorkspace } from "../hooks/useActiveWorkspace";
import { 
  useUpdateWorkspace, 
  useDeleteWorkspace, 
  useLeaveWorkspace,
  useGetWorkspaceMembers 
} from "../api/workspace.queries";
import { useAuthStore } from "@/app/stores/auth.store";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

export default function WorkspaceSettingsPage() {
  const navigate = useNavigate();
  const { activeWorkspace, isLoading: workspaceLoading } = useActiveWorkspace();
  const workspaceId = activeWorkspace?._id || "";
  const currentUser = useAuthStore(state => state.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  const { data: members = [], isLoading: membersLoading } = useGetWorkspaceMembers(workspaceId);
  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace(workspaceId);
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();
  const { mutate: leaveWorkspace, isPending: isLeaving } = useLeaveWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  // Find current user's role
  const myMembership = members.find(m => (m.userId?._id || m.userId) === currentUserId);
  const isOwner = myMembership?.role === "owner";

  useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name);
      setDescription(activeWorkspace.description || "");
      setIsEdited(false);
    }
  }, [activeWorkspace]);

  const handleUpdate = () => {
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    updateWorkspace({ name, description }, {
      onSuccess: () => {
        toast.success("Workspace updated successfully");
        setIsEdited(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to update workspace");
      }
    });
  };

  const handleDelete = () => {
    deleteWorkspace({ workspaceId }, {
      onSuccess: () => {
        toast.success("Workspace deleted successfully");
        navigate("/workspaces");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to delete workspace");
      }
    });
  };

  const handleLeave = () => {
    leaveWorkspace(workspaceId, {
      onSuccess: () => {
        toast.success(`You have left ${activeWorkspace?.name}`);
        navigate("/workspaces");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to leave workspace");
      }
    });
  };

  if (workspaceLoading || (workspaceId && membersLoading)) {
    return (
      <PageLayout variant="narrow">
        <div className="flex flex-col gap-6">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted/20" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/20" />
        </div>
      </PageLayout>
    );
  }

  if (!activeWorkspace) {
    return (
      <PageLayout variant="narrow" className="flex items-center justify-center text-center">
        <p className="text-muted-foreground">Workspace not found.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="narrow" className="space-y-10 pb-20">
      <div className="text-left">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-muted-foreground font-medium">
          Configure your workspace identity and preferences.
        </p>
      </div>

      <div className="grid gap-8 mt-8">
        {/* General Settings */}
        <Card className="rounded-3xl border-border/40 bg-card/50 shadow-xl">
          <CardHeader className="border-b border-border/30 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">General Information</CardTitle>
                <CardDescription className="text-sm font-medium">Update your workspace brand and details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Workspace Name
              </label>
              <Input 
                value={name} 
                onChange={(e) => {
                  setName(e.target.value);
                  setIsEdited(true);
                }}
                placeholder="Acme Corp"
                className="h-12 rounded-xl border-border/40 bg-muted/30 px-4 font-bold focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Description
              </label>
              <Textarea 
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsEdited(true);
                }}
                placeholder="Tell us what this workspace is about..."
                className="min-h-[120px] rounded-2xl border-border/40 bg-muted/30 p-4 font-medium focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                disabled={!isEdited || isUpdating}
                onClick={handleUpdate}
                className="rounded-xl h-11 px-8 font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100"
              >
                <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500/60">Danger Zone</h2>
          </div>

          <Card className="rounded-3xl border-red-500/20 bg-red-500/[0.01] shadow-xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-red-500/10">
              
              {/* Leave Workspace */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8">
                <div>
                  <h4 className="text-base font-black text-foreground tracking-tight">Leave Workspace</h4>
                  <p className="text-sm font-medium text-muted-foreground max-w-[440px]">
                    You will lose access to all channels, messages, and files in this workspace. 
                    {isOwner && <span className="block mt-1 text-red-500/80 font-bold">You are the owner. Transfer ownership or delete the workspace to leave.</span>}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      disabled={isOwner || isLeaving}
                      className="rounded-xl h-11 px-8 font-black border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                    >
                      <LogOut className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      Leave
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl border-border/40 bg-card p-8 shadow-2xl">
                    <AlertDialogHeader className="mb-6 text-center sm:text-left">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4 shadow-inner mx-auto sm:mx-0">
                        <LogOut size={28} strokeWidth={2.5} />
                      </div>
                      <AlertDialogTitle className="text-2xl font-black tracking-tight">Leave Workspace?</AlertDialogTitle>
                      <AlertDialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
                        Are you sure you want to leave <span className="font-black text-foreground">"{activeWorkspace.name}"</span>? 
                        You will need a new invitation to rejoin.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-2 sm:justify-end gap-3 flex-col sm:flex-row">
                      <AlertDialogCancel className="rounded-xl h-12 px-6 font-bold order-2 sm:order-1">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleLeave}
                        className="rounded-xl h-12 px-8 font-black bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 order-1 sm:order-2"
                      >
                        Leave Workspace
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Delete Workspace (Owner Only) */}
              {isOwner && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-red-500/[0.02]">
                  <div>
                    <h4 className="text-base font-black text-red-500/90 tracking-tight">Delete Workspace</h4>
                    <p className="text-sm font-medium text-red-500/60 max-w-[440px]">
                      Permanently delete this workspace and all its data. This action is irreversible.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        disabled={isDeleting}
                        className="rounded-xl h-11 px-8 font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                      >
                        <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
                        Delete Workspace
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-border/40 bg-card p-8 shadow-2xl">
                      <AlertDialogHeader className="mb-6 text-center sm:text-left">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4 shadow-inner mx-auto sm:mx-0">
                          <Trash2 size={28} strokeWidth={2.5} />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
                          This will permanently delete the <span className="font-black text-foreground">"{activeWorkspace.name}"</span> workspace.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="pt-2 sm:justify-end gap-3 flex-col sm:flex-row">
                        <AlertDialogCancel className="rounded-xl h-12 px-6 font-bold order-2 sm:order-1">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="rounded-xl h-12 px-8 font-black bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 order-1 sm:order-2"
                        >
                          Delete Forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}


