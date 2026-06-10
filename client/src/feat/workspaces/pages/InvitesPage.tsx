import { PageLayout } from "@/shared/components/layout/PageLayout";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { UserPlus, Check, X, Calendar, User } from "lucide-react";
import { 
  useGetPendingInvites, 
  useAcceptInvite, 
  useDeclineInvite 
} from "../api/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

export default function InvitesPage() {
  const { data: invites, isLoading, error } = useGetPendingInvites();
  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();
  const { mutate: declineInvite, isPending: isDeclining } = useDeclineInvite();

  const handleAccept = (workspaceId: string, workspaceName: string) => {
    acceptInvite(workspaceId, {
      onSuccess: () => {
        toast.success(`Welcome to ${workspaceName}!`);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to accept invitation");
      }
    });
  };

  const handleDecline = (workspaceId: string) => {
    declineInvite(workspaceId, {
      onSuccess: () => {
        toast.success("Invitation declined");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to decline invitation");
      }
    });
  };

  if (isLoading) {
    return (
      <PageLayout variant="constrained" className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout variant="constrained" className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium mb-4 text-lg">Failed to load invitations</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="constrained" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Workspace Invites
          </h1>
          {invites && invites.length > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 h-6 px-2">
              {invites.length} Pending
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          Manage your pending workspace invitations here.
        </p>
      </div>

      {!invites || invites.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending invites"
          description="You don't have any workspace invitations at the moment. Ask your team for an invite link or create your own workspace."
        />
      ) : (
        <div className="grid gap-4">
          {invites.map((invite) => {
            const workspace = invite.workspaceId;
            const inviter = invite.invitedBy;
            
            return (
              <div 
                key={invite._id} 
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-2xl shadow-xl">
                      <AvatarImage src={workspace.iconUrl} alt={workspace.name} />
                      <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-xl font-bold">
                        {workspace.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {workspace.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {inviter && (
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            Invited by <span className="font-semibold text-zinc-300">{inviter.name || "Someone"}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {invite.invitedAt ? format(new Date(invite.invitedAt), "MMM d, yyyy") : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 md:flex-none border-white/5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
                      onClick={() => handleDecline(workspace._id)}
                      disabled={isAccepting || isDeclining}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button 
                      className="flex-1 md:flex-none shadow-lg shadow-primary/20"
                      onClick={() => handleAccept(workspace._id, workspace.name)}
                      disabled={isAccepting || isDeclining}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept Invite
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
