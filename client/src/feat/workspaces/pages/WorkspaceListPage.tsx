import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Building2, 
  UserPlus, 
  ArrowRight, 
  Clock, 
  Bell, 
  Zap 
} from "lucide-react";

import { useGetWorkspaces, useGetPendingInvites } from "../api/workspace.queries";

import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreateWorkspaceModal } from "../components/CreateWorkspaceModal";
import { JoinWorkspaceModal } from "../components/JoinWorkspaceModal";

export default function WorkspaceListPage() {
  const { data: workspaces = [], isLoading: workspacesLoading, error } = useGetWorkspaces();
  const { data: invites = [] } = useGetPendingInvites();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredWorkspaces = workspaces?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const recentWorkspaces = workspaces?.slice(0, 3) || [];
  const pendingInvitesCount = invites?.length || 0;

  if (error) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="text-center space-y-5 max-w-sm">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <Building2 size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[17px] font-semibold text-foreground">Failed to Load Workspaces</h2>
            <p className="text-[13.5px] text-muted-foreground/70 leading-relaxed">We encountered a problem while retrieving your workspaces. Please verify your connection.</p>
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

  if (workspacesLoading) {
    return (
      <PageLayout variant="full" className="py-12 px-6 md:px-12 flex flex-col gap-10">
        <Skeleton className="h-[240px] w-full rounded-2xl bg-card/30" />
        
        <div className="space-y-4">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[100px] w-full rounded-2xl bg-card/30" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-9 w-64 rounded-xl" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-2xl bg-card/30" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    /* REPLACED: Changed variant from "constrained" to "full" and added side padding (px-6 md:px-12) */
    <PageLayout variant="full" className="relative py-12 px-6 md:px-12 flex flex-col gap-10 bg-background text-foreground selection:bg-primary/20 text-left">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] h-[35%] w-[35%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Welcome Platform Hub Hero Banner */}
      <section className="relative z-10 rounded-2xl border border-border/30 bg-card/30 p-8 md:p-12 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex flex-col items-start gap-4">
            {/* Platform Hub Badge */}
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 border border-primary/10">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-primary">Platform Hub</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                Welcome back!
              </h1>
              <p className="max-w-xl text-[15px] font-normal text-muted-foreground/80 leading-relaxed">
                Access your production environments and collaborate with your team in real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
            <Button 
              size="lg" 
              className="h-11 w-full sm:w-auto rounded-xl px-5 text-[14px] font-medium shadow-md shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98]"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
              New Workspace
            </Button>
            <Button 
              variant="secondary"
              size="lg" 
              className="h-11 w-full sm:w-auto rounded-xl px-5 text-[14px] font-medium border border-border/50 bg-muted/40 transition-all active:scale-[0.98]"
              onClick={() => setIsJoinModalOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" strokeWidth={2} />
              Join Team
            </Button>
          </div>

        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      </section>

      {/* Recent Workspaces / Environments Activity */}
      {recentWorkspaces.length > 0 && !search && (
        <section className="space-y-4 relative z-10 w-full">
          <h2 className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 px-1">
            <Clock className="h-4 w-4 text-muted-foreground/40" /> Recent Environments
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {recentWorkspaces.map(w => (
              <Link 
                key={w._id} 
                to={`/w/${w.slug}`}
                className="group relative flex flex-col gap-5 rounded-2xl border border-border/40 bg-card/40 p-5 transition-all hover:bg-card/70 hover:border-primary/30 shadow-sm active:scale-[0.99]"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium text-lg border border-primary/10 transition-transform duration-300 group-hover:scale-105 shrink-0">
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="font-medium text-[15px] text-foreground/90 truncate group-hover:text-primary transition-colors">{w.name}</h3>
                  <p className="text-[12.5px] text-muted-foreground/60">{w.memberCount} members</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Workspaces Layout Container Section */}
      <section className="space-y-4 relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
          <h2 className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
            <Building2 className="h-4 w-4 text-muted-foreground/40" /> Your Workspaces
          </h2>
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Filter workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-xl border-border/40 bg-card/40 pl-9 pr-4 text-[13.5px] font-normal shadow-none focus-visible:ring-primary/20 hover:bg-card/60 transition-all"
            />
          </div>
        </div>

        {/* Unified Responsive Grid (Now stretches out fluidly matching the workspace view) */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          
          {filteredWorkspaces.map((workspace) => (
            <Link 
              key={workspace._id}
              to={`/w/${workspace.slug}`} 
              className="group flex flex-col justify-between items-start rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/60 hover:border-border/60 active:scale-[0.99] shadow-sm min-h-[140px]"
            >
              <div className="flex items-start gap-4 min-w-0 w-full">
                <div className="h-11 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 font-medium text-lg text-primary shrink-0">
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-medium text-foreground/90 group-hover:text-primary transition-colors truncate">
                    {workspace.name}
                  </h3>
                  <p className="text-[13px] text-muted-foreground/60 line-clamp-2 mt-0.5 whitespace-normal">
                    {workspace.description || "Active production architecture workspace linked environment"}
                  </p>
                </div>
              </div>
              
              <div className="flex w-full justify-between items-center mt-4 pt-3 border-t border-border/10">
                <span className="text-[12px] font-medium text-muted-foreground/50">Production Unit</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}

          {/* Inline Notification Utility Card */}
          <div className="rounded-2xl border border-border/30 bg-card/10 p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
            <h3 className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
              <Bell className="h-3.5 w-3.5 text-muted-foreground/40" /> System Alerts
            </h3>
            {pendingInvitesCount > 0 ? (
              <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10 mt-2">
                <UserPlus className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">{pendingInvitesCount} Entry Invites Pending</p>
                  <Link to="/workspaces/invites" className="text-[11.5px] text-primary hover:underline">Review invites</Link>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground/50 my-auto text-center w-full">All clean. No active workspace notifications.</p>
            )}
            <div className="h-4 pointer-events-none" />
          </div>

          {/* Inline Shortcuts Control Card */}
          <div className="rounded-2xl border border-border/30 bg-card/10 p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
            <h3 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-muted-foreground/40" /> Directory Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-3 w-full">
              <Link to="/workspaces/search" className="flex flex-col justify-center items-center gap-2 rounded-xl bg-card/40 border border-border/10 p-3 text-[12.5px] font-medium text-foreground/80 hover:bg-card/80 hover:border-border/40 transition-all text-center group">
                <Search className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" /> Search Global
              </Link>
              <Link to="/workspaces/invites" className="flex flex-col justify-center items-center gap-2 rounded-xl bg-card/40 border border-border/10 p-3 text-[12.5px] font-medium text-foreground/80 hover:bg-card/80 hover:border-border/40 transition-all text-center group">
                <UserPlus className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" /> Active invites
              </Link>
            </div>
          </div>

        </div>
      </section>

      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <JoinWorkspaceModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </PageLayout>
  );
}