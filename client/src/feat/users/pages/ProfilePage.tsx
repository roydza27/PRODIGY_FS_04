import { useAuthStore } from "@/app/stores/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { usePresenceStore } from "@/app/stores/presence.store";
import { 
  CalendarDays, 
  Mail, 
  Edit2, 
  Users2,
  ExternalLink,
  MessageSquare,
  Building,
  UserPlus,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../api/user.queries";

export const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isLoading: isAuthLoading } = useAuthStore();
  
  const isOwnProfile = !userId || userId === currentUser?.id;

  const { 
    data: fetchedUser, 
    isLoading: isUserLoading, 
    isError 
  } = useUser(isOwnProfile ? undefined : userId);

  const displayUser = isOwnProfile ? currentUser : fetchedUser;
  const isLoading = isAuthLoading || (!isOwnProfile && isUserLoading);
  const online = usePresenceStore((state) => displayUser ? state.onlineUsers.has(displayUser.id || (displayUser as any)._id) : false);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[800px] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <Skeleton className="h-[200px] w-full" />
          <div className="px-6 pb-8">
            <div className="relative -mt-[60px] mb-6">
              <Skeleton className="h-[120px] w-[120px] rounded-full border-[8px] border-card" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !displayUser) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-xl font-medium text-muted-foreground">User not found.</div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(displayUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-full w-full flex-col overflow-y-auto bg-background pb-12 text-left">
      {/* Immersive Banner */}
      <div className="relative h-[240px] w-full bg-gradient-to-r from-primary/80 via-primary to-primary-foreground/20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 right-6 flex gap-3">
          {isOwnProfile ? (
            <Button variant="secondary" size="sm" className="bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" className="bg-primary text-white hover:bg-primary/90 border-none shadow-lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="secondary" size="sm" className="bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[800px] px-4 md:px-8">
        <div className="relative -mt-20 flex flex-col gap-6 md:flex-row md:items-end">
          {/* Large Avatar */}
          <div className="relative inline-block">
            <div className="rounded-full bg-card p-2 shadow-2xl">
              <Avatar className="h-[160px] w-[160px] border-none">
                <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-4xl font-bold text-primary">
                  {displayUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={cn(
              "absolute bottom-4 right-4 h-8 w-8 rounded-full border-[6px] border-card shadow-lg",
              online ? "bg-emerald-500" : "bg-zinc-500"
            )} />
          </div>

          {/* User Header Info */}
          <div className="flex-1 space-y-2 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">{displayUser.name}</h1>
              {displayUser.authProvider === "google" && (
                <Badge variant="outline" className="border-primary/50 text-primary text-[10px] font-bold">
                  GOOGLE VERIFIED
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xl text-zinc-400">
               <span className="font-medium">@{displayUser.username}</span>
               {displayUser.statusMessage && (
                 <>
                   <span className="text-zinc-600">•</span>
                   <span className="italic text-zinc-300">"{displayUser.statusMessage}"</span>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-12 space-y-8">
          <div className="rounded-2xl bg-card p-8 shadow-xl ring-1 ring-white/5">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <Users2 size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">About Me</h3>
              </div>
              <p className="text-[16px] leading-relaxed text-zinc-200">
                {displayUser.bio || "This user hasn't added a bio yet."}
              </p>
            </section>

            <Separator className="my-10 bg-white/5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarDays size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Member Since</h3>
                </div>
                <div className="text-[16px] text-white font-medium">{joinedDate}</div>
              </section>

              {(isOwnProfile || displayUser.isActive) && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Email</h3>
                  </div>
                  <div className="text-[16px] text-white font-medium flex items-center gap-2 group cursor-pointer">
                    {isOwnProfile ? displayUser.email : displayUser.email.replace(/(.{3})(.*)(?=@)/, "$1***")}
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                  </div>
                </section>
              )}
            </div>

            {!isOwnProfile && (
              <>
                <Separator className="my-10 bg-white/5" />
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Building size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Mutual Workspaces</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-zinc-400">
                      JS
                    </div>
                    <div className="text-[14px] text-zinc-300">
                      You share <span className="text-white font-bold">1 workspace</span> with this user.
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          <p className="text-center text-xs text-zinc-500">
            {isOwnProfile 
              ? "This is your public profile. It's visible to members of your shared workspaces."
              : "This profile is only visible to you and members of your shared workspaces."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
