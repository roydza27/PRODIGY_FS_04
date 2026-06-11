import React, { useState, useMemo } from "react";
import { 
  IconSearch, 
  IconUserPlus, 
  IconShield, 
  IconDotsVertical, 
  IconTrash,
  IconUserCircle,
  IconCrown,
  IconFilter,
  IconUser
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { 
  useGetWorkspaceMembers, 
  useInviteMember, 
  useRemoveMember, 
  useUpdateMemberRole 
} from "@/feat/workspaces/api/workspace.queries";
import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
import { formatLastSeen } from "@/utils/date";
import type { WorkspaceMember, WorkspaceUser } from "@/feat/workspaces/types/workspace.types";

import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { PresenceStatus } from "@/shared/components/ui/presence-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";

type FilterType = "all" | "owner" | "admin" | "member" | "online";

export default function WorkspaceMembersPage() {
  const { activeWorkspace, isLoading: workspaceLoading } = useActiveWorkspace();
  const workspaceId = activeWorkspace?._id || "";
  
  const { data: members = [], isLoading: membersLoading } = useGetWorkspaceMembers(workspaceId);
  const { mutate: inviteMember, isPending: isInviting } = useInviteMember(workspaceId);
  const { mutate: removeMember } = useRemoveMember(workspaceId);
  const { mutate: updateRole } = useUpdateMemberRole(workspaceId);
  
  const currentUser = useAuthStore(state => state.user);
  const currentUserId = currentUser?.id;
  const onlineUsers = usePresenceStore(state => state.onlineUsers);
  const lastSeenMap = usePresenceStore(state => state.lastSeen);

  // Local State
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  
  // Dialog States
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);
  const [newRole, setNewRole] = useState<"owner" | "admin" | "member">("member");

  // Get current user's role in this workspace
  const myMember = (members as WorkspaceMember[]).find(m => {
    const userId = typeof m.userId === "string" ? m.userId : (m.userId as WorkspaceUser)?._id;
    return userId === currentUserId;
  });
  const myRole = myMember?.role || "member";
  const isOwner = myRole === "owner";
  const isAdmin = myRole === "admin";
  const canManage = isOwner || isAdmin;

  // Filtered and Sorted Members
  const filteredMembers = useMemo(() => {
    return (members as WorkspaceMember[]).filter(member => {
      const user = member.userId as WorkspaceUser;
      const userId = typeof user === "string" ? user : user?._id;
      const userName = user?.name || "";
      const userUsername = user?.username || "";
      const userEmail = user?.email || "";
      
      // Search
      const searchMatch = 
        userName.toLowerCase().includes(search.toLowerCase()) ||
        userUsername.toLowerCase().includes(search.toLowerCase()) ||
        userEmail.toLowerCase().includes(search.toLowerCase());
      
      if (!searchMatch) return false;

      // Filter
      if (filter === "online") return onlineUsers.has(userId);
      if (filter !== "all") return member.role === filter;
      
      return true;
    }).sort((a, b) => {
      const aUser = a.userId as WorkspaceUser;
      const bUser = b.userId as WorkspaceUser;
      const aId = typeof aUser === "string" ? (aUser as unknown as string) : aUser?._id;
      const bId = typeof bUser === "string" ? (bUser as unknown as string) : bUser?._id;
      
      // 1. Role (Owner > Admin > Member)
      const roleOrder = { owner: 0, admin: 1, member: 2 };
      if (roleOrder[a.role as keyof typeof roleOrder] !== roleOrder[b.role as keyof typeof roleOrder]) {
        return roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder];
      }
      
      // 2. Online Status
      const aOnline = onlineUsers.has(aId);
      const bOnline = onlineUsers.has(bId);
      if (aOnline !== bOnline) return aOnline ? -1 : 1;
      
      // 3. Alphabetical
      return (aUser?.name || "").localeCompare(bUser?.name || "");
    });
  }, [members, search, filter, onlineUsers]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    inviteMember({ email: inviteEmail }, {
      onSuccess: () => {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        setIsInviteOpen(false);
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Failed to send invitation");
      }
    });
  };

  const handleUpdateRole = () => {
    if (!selectedMember) return;
    
    const user = selectedMember.userId as WorkspaceUser;
    const memberId = typeof user === "string" ? user : user?._id;
    updateRole({ memberId, role: newRole }, {
      onSuccess: () => {
        toast.success(`Role updated for ${user?.name}`);
        setRoleDialogOpen(false);
        setSelectedMember(null);
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Failed to update role");
      }
    });
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    
    const user = selectedMember.userId as WorkspaceUser;
    const memberId = typeof user === "string" ? user : user?._id;
    removeMember(memberId, {
      onSuccess: () => {
        toast.success(`${user?.name} removed from workspace`);
        setRemoveDialogOpen(false);
        setSelectedMember(null);
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Failed to remove member");
      }
    });
  };

  if (workspaceLoading || membersLoading) {
    return (
      <PageLayout variant="constrained">
        <div className="flex flex-col gap-6">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted/20" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted/20" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-muted/20" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="constrained">
      <div className="flex flex-col gap-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Workspace Members
            </h1>
            <p className="text-muted-foreground font-medium">
              Manage who has access to <span className="text-foreground font-bold">{activeWorkspace?.name}</span> and their permissions.
            </p>
          </div>
          
          {canManage && (
            <Button 
              onClick={() => setIsInviteOpen(true)}
              className="mt-4 rounded-xl bg-primary px-6 font-black sm:mt-0 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <IconUserPlus className="mr-2 h-5 w-5" stroke={2.5} />
              Invite Member
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 h-5 w-5" stroke={2} />
            <Input 
              placeholder="Search members by name, email or username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-muted/30 pl-11 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <SelectTrigger className="h-12 w-[160px] rounded-xl border-border/40 bg-muted/30 font-bold uppercase tracking-wider text-[11px]">
                <div className="flex items-center gap-2">
                  <IconFilter size={16} />
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-popover shadow-2xl">
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            <span>Name & Status</span>
            <div className="flex gap-12 mr-20">
              <span className="hidden md:inline">Role</span>
              <span className="hidden sm:inline">Actions</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => {
                const user = member.userId as WorkspaceUser;
                const userId = user?._id || (user as unknown as string);
                const isOnline = onlineUsers.has(userId);
                const isMe = userId === currentUserId;
                const lastSeenAt = lastSeenMap[userId] || user?.lastSeenAt;

                return (
                  <motion.div
                    key={member._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex items-center justify-between rounded-2xl border border-border/30 bg-card p-4 transition-all hover:border-border/60 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-2xl border-2 border-border/20 shadow-inner group-hover:scale-105 transition-transform">
                          <AvatarImage src={user?.avatarUrl} className="object-cover" />
                          <AvatarFallback className="rounded-2xl bg-muted text-lg font-black">
                            {user?.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <PresenceStatus 
                          online={isOnline} 
                          size="sm" 
                          className="absolute -bottom-1 -right-1 border-4 border-card rounded-full" 
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-black tracking-tight text-foreground">
                            {user?.name} {isMe && <span className="ml-1 text-[10px] text-primary">(You)</span>}
                          </span>
                          {member.role === "owner" && (
                            <IconCrown className="h-4 w-4 text-amber-400" stroke={2.5} />
                          )}
                          {member.role === "admin" && (
                            <IconShield className="h-4 w-4 text-blue-400" stroke={2.5} />
                          )}
                        </div>
                        <span className="text-[12px] font-bold text-muted-foreground/60">
                          {isOnline ? (
                            <span className="text-emerald-500/80">Active Now</span>
                          ) : (
                            formatLastSeen(lastSeenAt)
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 md:gap-12">
                      <div className="hidden md:flex w-24 flex-col items-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          member.role === "owner" && "bg-amber-400/10 text-amber-500",
                          member.role === "admin" && "bg-blue-400/10 text-blue-500",
                          member.role === "member" && "bg-muted text-muted-foreground/70"
                        )}>
                          {member.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-muted/50">
                              <IconDotsVertical size={18} stroke={2.5} className="text-muted-foreground/60" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/40 bg-popover shadow-2xl">
                            <DropdownMenuLabel className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 px-4 py-2">
                              Options
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                              <IconUserCircle size={18} />
                              <span className="font-bold">View Profile</span>
                            </DropdownMenuItem>
                            
                            {canManage && !isMe && member.role !== "owner" && (
                              <>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setNewRole(member.role);
                                    setRoleDialogOpen(true);
                                  }}
                                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-primary"
                                >
                                  <IconShield size={18} />
                                  <span className="font-bold">Change Role</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setRemoveDialogOpen(true);
                                  }}
                                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-destructive"
                                >
                                  <IconTrash size={18} />
                                  <span className="font-bold">Remove from Workspace</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <IconUser size={40} />
                </div>
                <p className="text-lg font-black tracking-tight">No members found</p>
                <p className="text-sm font-medium">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="rounded-3xl border-border/40 bg-card p-8 shadow-2xl sm:max-w-[480px]">
          <DialogHeader className="mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
              <IconUserPlus size={28} stroke={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Invite to Workspace</DialogTitle>
            <DialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
              Send an invitation to someone's email address. They will be notified and can join as a Member.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Email Address
              </label>
              <Input
                autoFocus
                placeholder="colleague@example.com"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-14 rounded-2xl border-border/40 bg-muted/30 px-5 text-base font-medium focus:ring-primary/20"
              />
            </div>
            
            <DialogFooter className="pt-2 sm:justify-end gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsInviteOpen(false)}
                className="rounded-xl h-12 px-6 font-bold"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isInviting}
                className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20"
              >
                {isInviting ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="rounded-3xl border-border/40 bg-card p-8 shadow-2xl sm:max-w-[420px]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight">Change Role</DialogTitle>
            <DialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
              Updating role for <span className="font-black text-foreground">{(selectedMember?.userId as WorkspaceUser)?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Select New Role
              </label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as "owner" | "admin" | "member")}>
                <SelectTrigger className="h-14 rounded-2xl border-border/40 bg-muted/30 px-5 text-base font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 bg-popover shadow-2xl">
                  {isOwner && <SelectItem value="owner">Owner (Transfer Ownership)</SelectItem>}
                  {(isOwner || isAdmin) && <SelectItem value="admin">Admin</SelectItem>}
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-[12px] font-medium text-amber-500/80 leading-relaxed">
                  {newRole === "owner" && "Caution: You will be demoted to Admin if you transfer ownership."}
                  {newRole === "admin" && "Admins can manage members, create rooms, and invite new people."}
                  {newRole === "member" && "Members can participate in chat and rooms, but cannot manage the workspace."}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4 sm:justify-end gap-3">
            <Button variant="ghost" onClick={() => setRoleDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold">
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="rounded-3xl border-border/40 bg-card p-8 shadow-2xl sm:max-w-[420px]">
          <DialogHeader className="mb-6 text-center sm:text-left">
            <DialogTitle className="text-2xl font-black tracking-tight text-destructive">Remove Member?</DialogTitle>
            <DialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
              Are you sure you want to remove <span className="font-black text-foreground">{(selectedMember?.userId as WorkspaceUser)?.name}</span> from this workspace? 
              This action cannot be undone and they will lose all access immediately.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="pt-2 sm:justify-end gap-3 flex-col sm:flex-row">
            <Button variant="ghost" onClick={() => setRemoveDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold order-2 sm:order-1">
              Keep Member
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember} className="rounded-xl h-12 px-8 font-black shadow-lg shadow-destructive/20 order-1 sm:order-2">
              Remove Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
}
