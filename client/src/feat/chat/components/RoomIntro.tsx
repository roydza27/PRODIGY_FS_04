import { 
  IconHash, 
  IconUsers, 
  IconLock, 
  IconWorld, 
  IconPlus, 
  IconSettings 
} from "@tabler/icons-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface Props {
  roomName: string;
  description?: string;
  isPrivate?: boolean;
  memberCount?: number;
}

export default function RoomIntro({
  roomName,
  description,
  isPrivate = false,
  memberCount = 0,
}: Props) {
  return (
    <div className="px-6 py-20 lg:px-12 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 text-left">
        {/* Room Icon with glassmorphism */}
        <div className="group relative mb-10 inline-block">
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-primary to-blue-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-110" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-card/40 border border-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
            {isPrivate ? (
              <IconLock size={52} className="text-primary" stroke={1.5} />
            ) : (
              <IconHash size={56} className="text-primary" stroke={1.5} />
            )}
          </div>
        </div>

        {/* Room Info */}
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Welcome to</span>
              <div className="h-px w-12 bg-primary/20" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground lg:text-8xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {roomName}
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            {description ?? `This is the very beginning of the history of the #${roomName} channel. Join the conversation, share ideas, and connect with your team members in this professional space.`}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="px-5 py-2.5 gap-2.5 rounded-2xl font-bold border-border/40 bg-muted/40 backdrop-blur-sm transition-all hover:bg-muted hover:scale-105">
            <IconUsers size={20} className="text-primary" stroke={2} />
            <span className="text-foreground">{memberCount.toLocaleString()} Members</span>
          </Badge>
          <Badge variant="secondary" className="px-5 py-2.5 gap-2.5 rounded-2xl font-bold border-border/40 bg-muted/40 backdrop-blur-sm transition-all hover:bg-muted hover:scale-105">
            {isPrivate ? (
              <IconLock size={20} className="text-primary" stroke={2} />
            ) : (
              <IconWorld size={20} className="text-primary" stroke={2} />
            )}
            <span className="text-foreground">{isPrivate ? "Private Room" : "Public Channel"}</span>
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Button size="lg" className="rounded-2xl h-14 px-10 text-base font-black shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95">
            <IconPlus size={22} className="mr-2.5" stroke={3} />
            Invite Members
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 text-base font-black border-border/50 bg-background/40 backdrop-blur-md transition-all hover:bg-muted/80 hover:scale-105 active:scale-95">
            <IconSettings size={22} className="mr-2.5" stroke={2} />
            Configure Room
          </Button>
        </div>
      </div>

      <div className="mt-20 border-b border-border/20" />
    </div>
  );
}
