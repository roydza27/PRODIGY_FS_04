import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { UserPlus, X, Calendar, User, Mail, ShieldCheck } from "lucide-react";
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
import type { WorkspaceInvite } from "../types/workspace.types";

export default function InvitesPage() {
  const { data: invites = [], isLoading, error } = useGetPendingInvites();
  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();
  const { mutate: declineInvite, isPending: isDeclining } = useDeclineInvite();

  const handleAccept = (workspaceId: string, workspaceName: string) => {
    acceptInvite(workspaceId, {
      onSuccess: () => {
        toast.success(`Welcome to ${workspaceName}!`);
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Failed to accept invitation");
      }
    });
  };

  const handleDecline = (workspaceId: string) => {
    declineInvite(workspaceId, {
      onSuccess: () => {
        toast.success("Invitation declined");
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Failed to decline invitation");
      }
    });
  };

  if (isLoading) {
    return (
      <PageLayout variant="constrained" className="py-12 flex flex-col gap-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout variant="constrained" className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <X size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[17px] font-semibold text-foreground">Synchronization Error</h2>
            <p className="text-[13.5px] text-muted-foreground/70 leading-relaxed">We encountered a problem while retrieving your pending invitations. Please verify your connection.</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="h-9 rounded-xl bg-destructive hover:bg-destructive/90 px-5 text-[13px] font-medium transition-all"
          >
            Retry Connection
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="constrained" className="relative py-10 flex flex-col gap-10 bg-background text-foreground selection:bg-primary/20">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] h-[50%] w-[50%] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-3 px-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary border border-primary/10 w-fit">
          <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />
          Inbox
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
            Workspace Invites
          </h1>
          {invites && invites.length > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground font-medium h-6 px-2.5 rounded-full shadow-sm">
              {invites.length}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground/80 text-[15px] font-normal max-w-xl leading-relaxed">
          Manage your pending workspace access requests. Join new teams or decline incoming invitations.
        </p>
      </div>

      <div className="relative z-10 w-full">
        {!invites || invites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/10 py-24 text-center px-6 max-w-2xl mx-auto">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border/40 text-muted-foreground/30">
              <UserPlus size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium tracking-tight text-muted-foreground mb-1">
              Clear Horizons
            </h3>
            <p className="text-[13.5px] font-normal text-muted-foreground/50 max-w-sm mx-auto leading-relaxed">
              No pending invitations discovered. Ask your team leads for an invite link or initialize your own workspace.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {(invites as WorkspaceInvite[]).map((invite) => {
                const workspace = invite.workspaceId;
                const inviter = invite.invitedBy;
                
                return (
                  <motion.div 
                    key={invite._id} 
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                    className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/30 p-6 transition-all hover:bg-card/60 hover:border-border/60 shadow-sm flex flex-col justify-between min-h-[160px]"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between relative z-10 w-full min-w-0">
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <Avatar className="h-14 w-14 rounded-full shadow-sm border border-border/10 bg-muted/50 shrink-0 transition-transform duration-300 group-hover:scale-105">
                          <AvatarImage src={workspace.iconUrl} alt={workspace.name} className="object-cover" />
                          <AvatarFallback className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-xl font-medium">
                            {workspace.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[16px] font-medium text-foreground/90 group-hover:text-primary transition-colors truncate max-w-[180px]">
                              {workspace.name}
                            </h3>
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[11px] font-medium text-emerald-500 border border-emerald-500/10">
                              <ShieldCheck size={11} /> Verified Node
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground/60">
                            {inviter && (
                              <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                                <User className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                <span>By</span> <span className="text-muted-foreground font-medium truncate">{inviter.name || "System"}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                              {invite.invitedAt ? format(new Date(invite.invitedAt), "MMM d, yyyy") : "Recently"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border/10 w-full">
                      <Button 
                        variant="secondary" 
                        className="h-9 rounded-xl px-4 text-[13px] font-medium bg-muted/40 hover:bg-destructive/10 hover:text-destructive hover:border-transparent transition-all shadow-none"
                        onClick={() => handleDecline(workspace._id)}
                        disabled={isAccepting || isDeclining}
                      >
                        Decline
                      </Button>
                      <Button 
                        className="h-9 rounded-xl px-4 text-[13px] font-medium bg-primary hover:bg-primary/90 transition-all shadow-none"
                        onClick={() => handleAccept(workspace._id, workspace.name)}
                        disabled={isAccepting || isDeclining}
                      >
                        Accept Invite
                      </Button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
