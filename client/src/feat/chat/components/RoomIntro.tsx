import { Hash, Users, Lock, Globe, type LucideIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface Props {
  roomName: string;
  description?: string;
  isPrivate?: boolean;
  memberCount?: number;
  icon?: LucideIcon;
}

export default function RoomIntro({
  roomName,
  description,
  isPrivate = false,
  memberCount = 0,
  icon: Icon = Hash,
}: Props) {
  return (
    <div className="px-6 py-12 lg:px-12 relative overflow-hidden">
      {/* Subtle Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 text-left">
        {/* Room Icon with subtle shadow */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-card border border-border shadow-2xl shadow-primary/5">
          <Icon size={48} className="text-primary/80" />
        </div>

        {/* Room Info */}
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tight text-foreground lg:text-7xl">
            {roomName}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {description ?? `Welcome to the official #${roomName} channel. This is the very beginning of the history of this room. Join the conversation and connect with others.`}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1.5 gap-2 rounded-full font-semibold border-border/50">
            <Users size={16} className="text-primary" />
            {memberCount.toLocaleString()} Members
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 gap-2 rounded-full font-semibold border-border/50">
            {isPrivate ? <Lock size={16} className="text-primary" /> : <Globe size={16} className="text-primary" />}
            {isPrivate ? "Private Room" : "Public Channel"}
          </Badge>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
            Join Conversation
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl px-8 font-bold border-border/50 hover:bg-muted/50">
            Room Settings
          </Button>
        </div>
      </div>

      <div className="mt-16 border-b border-border/40" />
    </div>
  );
}
