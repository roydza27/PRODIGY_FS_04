import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetWorkspaces } from "../api/workspace.queries";
import { Button } from "@/shared/components/ui/button";
import { CreateWorkspaceModal } from "../components/CreateWorkspaceModal";
import { JoinWorkspaceModal } from "../components/JoinWorkspaceModal";
import { Plus, Search, Building2, UserPlus, ArrowRight } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

import { PageLayout } from "@/shared/components/layout/PageLayout";

export default function WorkspaceListPage() {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredWorkspaces = workspaces?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageLayout className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm font-medium">Loading your workspaces...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="flex flex-col items-center">
      <div className="w-full max-w-[640px] space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-white/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Choose a workspace below to get back to working with your team.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1A1A1D] p-2 rounded-xl border border-white/5 shadow-sm">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Find a workspace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-base placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* Workspace List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Workspaces
            </h2>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full font-medium">
              {filteredWorkspaces?.length || 0}
            </span>
          </div>

          {filteredWorkspaces && filteredWorkspaces.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredWorkspaces.map((workspace) => (
                <Link key={workspace._id} to={`/w/${workspace.slug}`} className="group block">
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-white/5 hover:border-primary/50 hover:bg-[#1f1f23] transition-all duration-200 flex items-center gap-5 shadow-sm hover:shadow-md">
                    {/* Icon */}
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-xl font-bold text-primary">
                        {workspace.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {workspace.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 pr-4">
                        {workspace.description || "No description provided"}
                      </p>
                    </div>

                    {/* Action Icon */}
                    <div className="shrink-0 pl-4 flex items-center">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <ArrowRight className="h-5 w-5 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No workspaces found</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                {search ? "We couldn't find any workspace matching your search." : "You're not a member of any workspaces yet."}
              </p>
              {search && (
                <Button variant="outline" onClick={() => setSearch("")} className="bg-transparent border-white/10 hover:bg-white/5">
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="group p-4 rounded-xl border border-white/5 bg-transparent hover:bg-white/5 transition-all text-left flex items-start gap-4"
          >
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
              <UserPlus className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Join Workspace</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Got an invite code? Join an existing team workspace.</p>
            </div>
          </button>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="group p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left flex items-start gap-4"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-primary mb-1">Create Workspace</h4>
              <p className="text-xs text-primary/70 leading-relaxed">Start fresh and invite your team to a new workspace.</p>
            </div>
          </button>
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
