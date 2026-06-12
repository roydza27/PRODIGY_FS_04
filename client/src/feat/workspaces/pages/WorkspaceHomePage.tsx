import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Hash, 
  Users, 
  MessageSquare, 
  Plus, 
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useGetRooms } from "@/feat/rooms/api/room.queries";
import CreateRoomDialog from "@/feat/rooms/components/CreateRoomDialog";

import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

export default function WorkspaceHomePage() {
  const { activeWorkspace } = useActiveWorkspace();
  const workspaceId = activeWorkspace?._id;

  const {
    data: rooms = [],
    isLoading,
  } = useGetRooms(
    workspaceId ?? "",
    !!workspaceId
  );

  const textChannels = rooms.filter(
    (room) => room.type === "text"
  ).length;

  const recentRooms = rooms.slice(0, 4);

  if (!activeWorkspace) {
    return (
      <PageLayout variant="constrained" className="flex items-center justify-center h-full text-center">
        <div className="flex flex-col items-center gap-4 opacity-40">
          <Activity size={60} strokeWidth={1} className="animate-pulse text-primary" />
          <p className="text-lg font-black tracking-tight uppercase">Establishing Workspace Context</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="full" className="h-full overflow-hidden bg-background">
      <div className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth text-left">
        
        {/* Dynamic Header Section */}
        <section className="relative px-4 py-8 md:px-8 md:py-16 lg:px-12 lg:py-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-primary/[0.02] to-transparent">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
            <div className="absolute top-40 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-2xl shadow-primary/20 border border-primary/20"
              >
                <Hash size={32} strokeWidth={2.5} />
              </motion.div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-500 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active Workspace
                  </span>
                  <div className="hidden sm:block h-1 w-1 rounded-full bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/20 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                    ID: {activeWorkspace._id.slice(-6)}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                  {activeWorkspace.name}
                </h1>
                <p className="max-w-2xl text-base md:text-lg font-medium text-muted-foreground/80 leading-relaxed">
                  {activeWorkspace.description || "Empower your team with seamless real-time collaboration and organized communication channels."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <CreateRoomDialog
                workspaceId={workspaceId!}
                trigger={
                  <Button size="lg" className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    <Plus className="mr-2 h-5 w-5" strokeWidth={3} />
                    New Channel
                  </Button>
                }
              />
              <Link to={`/w/${activeWorkspace.slug}/members`} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 border-white/5 bg-white/[0.03] backdrop-blur-xl px-6 font-black hover:bg-white/[0.06] hover:border-white/10 transition-all">
                  <Users className="mr-2 h-5 w-5" />
                  Manage Team
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 grid gap-12">
          
          {/* Dashboard Stats */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <ModernStatCard 
              label="Total Channels" 
              value={rooms.length} 
              icon={<Hash className="h-5 w-5" />} 
              color="text-primary"
              bg="bg-primary/10"
            />
            <ModernStatCard 
              label="Active Members" 
              value={activeWorkspace.memberCount || 1} 
              icon={<Users className="h-5 w-5" />} 
              color="text-indigo-400"
              bg="bg-indigo-400/10"
            />
            <ModernStatCard 
              label="Text Channels" 
              value={textChannels} 
              icon={<MessageSquare className="h-5 w-5" />} 
              color="text-violet-400"
              bg="bg-violet-400/10"
            />
            <ModernStatCard 
              label="Security Level" 
              value={activeWorkspace.visibility === 'public' ? 'Standard' : 'Private'} 
              icon={<ShieldCheck className="h-5 w-5" />} 
              color="text-primary/80"
              bg="bg-primary/5"
            />
          </section>

          <div className="grid gap-12 lg:grid-cols-3 items-start">
            {/* Main Channel List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <Activity size={14} className="text-primary/50" /> Available Channels ({rooms.length})
                </h2>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-all">
                  View All
                </Link>
              </div>

              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 w-full animate-pulse rounded-[2rem] bg-white/[0.02] border border-white/5" />
                  ))}
                </div>
              ) : rooms.length === 0 ? (
                <div className="rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] py-24 text-center px-6">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white/[0.02] text-white/10 border border-white/5">
                    <Hash size={48} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-white/40 uppercase tracking-widest mb-2">
                    No channels available
                  </h3>
                  <p className="text-sm font-medium text-white/20 mb-8 max-w-sm mx-auto">Start by creating a new channel for your team to begin collaborating.</p>
                  <CreateRoomDialog
                    workspaceId={workspaceId!}
                    trigger={
                      <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px]">
                        Create First Channel
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="grid gap-4">
                  {rooms.map((room, idx) => (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={`/w/${activeWorkspace.slug}/rooms/${room._id}`}
                        className="group flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/[0.02] p-5 md:p-6 transition-all hover:bg-white/[0.04] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/10 transition-all shadow-inner border border-white/5">
                            <Hash size={24} strokeWidth={2.5} />
                          </div>

                          <div className="space-y-1">
                            <p className="text-lg font-black text-white group-hover:text-primary transition-colors">
                              {room.name}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground/40 line-clamp-1 max-w-[200px] sm:max-w-md">
                              {room.description || "No description provided for this channel."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/5 group-hover:border-primary/20 group-hover:text-primary transition-all">
                            <Users size={10} /> {room.memberCount || 0}
                          </div>
                          <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center text-muted-foreground/20 group-hover:text-white group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                            <ChevronRight size={20} strokeWidth={3} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
              {/* Recent Activity Card */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 overflow-hidden relative group/card">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover/card:opacity-[0.06] transition-opacity">
                  <Activity size={140} strokeWidth={1} />
                </div>
                
                <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <Zap size={14} className="text-primary" /> Quick Access
                </h3>

                <div className="grid gap-3">
                  {recentRooms.length > 0 ? (
                    recentRooms.map(room => (
                      <Link 
                        key={room._id} 
                        to={`/w/${activeWorkspace.slug}/rooms/${room._id}`}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group/item"
                      >
                        <div className="flex items-center gap-3">
                          <Hash size={16} className="text-white/20 group-hover/item:text-primary transition-colors" />
                          <span className="text-sm font-black text-white/70 group-hover/item:text-white truncate max-w-[150px]">
                            {room.name}
                          </span>
                        </div>
                        <ArrowUpRight size={14} className="text-white/10 group-hover/item:text-primary group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs font-medium text-white/10 py-4 text-center italic">No recent channels</p>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <Link to={`/w/${activeWorkspace.slug}/members`} className="flex items-center justify-between group/link">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white group-hover/link:text-primary transition-colors">Team Members</p>
                      <p className="text-xs font-medium text-white/20">Manage permissions & roles</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:bg-primary/20 group-hover/link:text-primary transition-all border border-white/5 group-hover/link:border-primary/20">
                      <Users size={16} className="text-white/20" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Tips Card */}
              <div className="rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group/tip">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover/tip:scale-110 transition-transform duration-500">
                  <Zap size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                  <div className="mb-6 h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Zap size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Pro Tip</h3>
                  <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">
                    Use channels to keep your projects organized. Different topics, different rooms—one productive workspace.
                  </p>
                  <Button variant="ghost" className="w-full rounded-xl bg-white/10 border border-white/10 font-black hover:bg-white/20 text-white transition-all">
                    Explore Guides
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ModernStatCard({ label, value, icon, color, bg }: { label: string; value: string | number; icon: React.ReactNode, color: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/40 p-8 shadow-sm transition-all hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner", bg, color)}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-black text-white tracking-tighter">
          {value}
        </p>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          {label}
        </p>
      </div>
      <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-[0.02] pointer-events-none">
        {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 100 })}
      </div>
    </motion.div>
  );
}
