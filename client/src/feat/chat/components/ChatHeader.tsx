import { 
  IconHash, 
  IconUsers, 
  IconSearch, 
  IconBell, 
  IconPinned, 
  IconInfoCircle,
  IconChevronDown,
  IconAt,
  IconStar,
  IconPhone,
  IconVideo
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  roomName: string;
  isDM?: boolean;
  avatarUrl?: string;
  username?: string;
  status?: string;
  memberCount?: number;
  isOnline?: boolean;
}

export default function ChatHeader({
  roomName,
  isDM = false,
  avatarUrl,
  username,
  status,
  memberCount,
  isOnline = false,
}: Props) {
  const displayStatus = status || (isOnline ? "Active now" : "Offline");

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-3 font-bold text-foreground">
          {isDM ? (
            <div className="relative">
              <Avatar className="h-10 w-10 rounded-xl shadow-sm transition-transform hover:scale-105">
                <AvatarImage src={avatarUrl} alt={roomName} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                  {roomName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background shadow-sm transition-colors duration-300",
                isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"
              )} />
            </div>
          ) : (
            <div className="group flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
              <IconHash size={22} className="transition-transform group-hover:rotate-12" />
            </div>
          )}
          
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-[16px] font-black tracking-tight">{roomName}</h2>
              {isDM && username && (
                <span className="hidden text-[13px] font-medium text-muted-foreground/60 md:inline">
                  @{username}
                </span>
              )}
              <button className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-muted transition-colors">
                <IconChevronDown size={14} className="text-muted-foreground" />
              </button>
              <button className="ml-1 flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/40 hover:text-yellow-500 transition-colors">
                <IconStar size={14} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {isDM ? (
                <span className={cn(
                  "flex items-center gap-1.5 text-[11px] font-bold transition-colors duration-300",
                  isOnline ? "text-emerald-500/90" : "text-muted-foreground/60"
                )}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                    isOnline ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
                  )} />
                  {displayStatus}
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-muted-foreground/60"># channel</span>
                  {memberCount !== undefined && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <button className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/60 hover:text-primary transition-colors">
                        <IconUsers size={12} />
                        <span>{memberCount}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 md:gap-1">
        {isDM && (
          <>
            <HeaderAction icon={<IconPhone size={20} stroke={1.5} />} label="Voice Call" />
            <HeaderAction icon={<IconVideo size={20} stroke={1.5} />} label="Video Call" />
            <div className="mx-2 h-6 w-[1px] bg-border/60" />
          </>
        )}
        <HeaderAction icon={<IconSearch size={20} stroke={1.5} />} label="Search" />
        <HeaderAction icon={<IconPinned size={20} stroke={1.5} />} label="Pinned Messages" />
        <HeaderAction icon={<IconBell size={20} stroke={1.5} />} label="Mute Notifications" />
        <HeaderAction icon={<IconInfoCircle size={20} stroke={1.5} />} label="Details" />
      </div>
    </header>
  );
}

function HeaderAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button 
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95"
    >
      {icon}
    </button>
  );
}
