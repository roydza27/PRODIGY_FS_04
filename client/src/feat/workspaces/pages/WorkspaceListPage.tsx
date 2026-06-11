import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetWorkspaces, useGetPendingInvites } from "../api/workspace.queries";
import { Button } from "@/shared/components/ui/button";
import { CreateWorkspaceModal } from "../components/CreateWorkspaceModal";
import { JoinWorkspaceModal } from "../components/JoinWorkspaceModal";
import { 
  Plus, 
  Search, 
  Building2, 
  UserPlus, 
  ArrowRight, 
  LayoutDashboard,
  Clock,
  Bell
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuthStore } from "@/app/stores/auth.store";

// import { PageLayout } from "@/shared/components/layout/PageLayout";

export default function WorkspaceListPage() {
  const user = useAuthStore((state) => state.user);
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: invites, isLoading: invitesLoading } = useGetPendingInvites();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredWorkspaces = workspaces?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const recentWorkspaces = workspaces?.slice(0, 3) || [];
  const pendingInvitesCount = invites?.length || 0;

  if (workspacesLoading) {
    return (
      <PageLayout variant="constrained" className="flex flex-col gap-8">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="constrained" className="flex flex-col gap-10">
      
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent p-8 md:p-12">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl">
              Hello, {user?.name.split(' ')[0] || "there"}!
            </h1>
            <p className="max-w-md text-lg font-medium text-muted-foreground">
              Welcome back to your workspace hub. Manage your teams and stay connected.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              className="rounded-2xl px-6 font-bold shadow-xl shadow-primary/20"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              New Workspace
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-2xl border-white/10 bg-white/5 px-6 font-bold backdrop-blur-sm"
              onClick={() => setIsJoinModalOpen(true)}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join Team
            </Button>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Workspaces */}
          {recentWorkspaces.length > 0 && !search && (
            <section>
              <div className="mb-4 flex items-center justify-between px-2">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/30">
                  <Clock className="h-4 w-4" /> Recent Workspaces
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {recentWorkspaces.map(w => (
                  <Link 
                    key={w._id} 
                    to={`/w/${w.slug}`}
                    className="group relative flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-primary/30"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 group-hover:scale-110 transition-transform">
                      {w.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white truncate">{w.name}</h3>
                      <p className="text-xs text-muted-foreground">{w.memberCount} members</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Workspaces List */}
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/30">
                <Building2 className="h-4 w-4" /> Your Workspaces
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  placeholder="Filter workspaces..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 rounded-xl border-white/5 bg-white/[0.03] pl-10 text-sm focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {filteredWorkspaces && filteredWorkspaces.length > 0 ? (
              <div className="grid gap-3">
                {filteredWorkspaces.map((workspace) => (
                  <Link 
                    key={workspace._id} 
                    to={`/w/${workspace.slug}`} 
                    className="group flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 font-black text-2xl text-primary shadow-inner">
                        {workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                          {workspace.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {workspace.description || "Active workspace"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01] py-20 text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                <p className="text-muted-foreground">
                  {search ? "No workspaces match your search." : "You haven't joined any workspaces yet."}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Invites Summary */}
          <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/30">
              <Bell className="h-4 w-4" /> Notifications
            </h3>
            
            {pendingInvitesCount > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-primary/10 p-4 border border-primary/20">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{pendingInvitesCount} Pending Invites</p>
                    <Link to="/workspaces/invites" className="text-xs font-bold text-primary hover:underline">
                      Review them now
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No new notifications or invites.
              </p>
            )}
          </section>

          {/* Quick Actions */}
          <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/30">
              <LayoutDashboard className="h-4 w-4" /> Quick Actions
            </h3>
            <div className="grid gap-2">
              <ActionLink to="/workspaces/search" label="Search People" icon={<Search className="h-4 w-4" />} />
              <ActionLink to="/workspaces/invites" label="Manage Invites" icon={<UserPlus className="h-4 w-4" />} />
            </div>
          </section>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <JoinWorkspaceModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </PageLayout>
  );
}

function ActionLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Link>
  );
}
