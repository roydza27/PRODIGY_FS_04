import { MessageSquare, User, AtSign, Mail, MapPin, Calendar } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";

import { cn } from "@/lib/utils"

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
  };
  onMessage?: () => void;
  onViewProfile?: () => void;
}

export default function UserCard({
  user,
  onMessage,
  onViewProfile,
}: UserCardProps) {
  return (
    <Card className="w-[340px] overflow-hidden border-border/40 bg-card/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:shadow-primary/5">
      {/* Premium Banner */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardContent className="relative px-6 pb-6 pt-0">
        {/* Avatar with Status Overlay */}
        <div className="-mt-14 mb-4 relative inline-block group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 opacity-20 blur-sm transition-all group-hover:opacity-40" />
          <Avatar className="h-24 w-24 rounded-3xl border-4 border-background bg-card shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-3xl font-black text-primary">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-2xl border-4 border-background bg-emerald-500 shadow-lg" />
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {user.name}
            </h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wider">
              Pro Member
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <AtSign size={14} strokeWidth={3} />
            <p className="text-[13px] font-bold tracking-tight">
              {user.username || user.name.toLowerCase().replace(/\s/g, '')}
            </p>
          </div>
        </div>

        {/* User Stats/Bio Placeholder */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Points</p>
            <p className="text-lg font-black text-foreground">1,284</p>
          </div>
          <div className="rounded-2xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Streak</p>
            <p className="text-lg font-black text-foreground">12 Days</p>
          </div>
        </div>

        <Separator className="my-6 bg-border/40" />

        {/* Actions */}
        <div className="flex gap-3">
          {onMessage && (
            <Button
              type="button"
              className="flex-1 rounded-[14px] h-12 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              onClick={onMessage}
            >
              <MessageSquare className="mr-2 h-4 w-4" strokeWidth={3} />
              Message
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className={cn(
              "rounded-[14px] h-12 font-bold transition-all hover:bg-muted/80 hover:scale-[1.02] active:scale-95",
              onMessage ? "w-12 px-0" : "flex-1"
            )}
            onClick={onViewProfile}
          >
            <User className={cn("h-5 w-5", !onMessage && "mr-2")} strokeWidth={3} />
            {!onMessage && "View Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}