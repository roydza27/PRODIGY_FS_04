import { 
  Bell, 
  Check, 
  Trash2, 
  Mail, 
  AtSign, 
  MessageSquare,
  Zap
} from "lucide-react";
import { useNotificationStore } from "@/app/stores/notification.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpen = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Notifications"
          onClick={handleOpen}
          className={cn(
            "group relative rounded-md p-2 transition-all duration-200 text-zinc-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#18181B] border-white/10 shadow-2xl rounded-2xl" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h4 className="text-[13px] font-black uppercase tracking-widest text-foreground">Notifications</h4>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
              onClick={() => markAllAsRead()}
              title="Mark all as read"
            >
              <Check className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => clearAll()}
              title="Clear all"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        
        <div className="h-[400px] overflow-y-auto no-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-30">
              <Zap className="size-10 mb-4 stroke-1" />
              <p className="text-[11px] font-black uppercase tracking-widest">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b border-white/5 transition-colors cursor-default hover:bg-white/[0.02]",
                    !n.isRead && "bg-white/[0.03]"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <NotificationIcon type={n.type} />
                      <span className="text-[11px] font-bold text-foreground/90">{n.title}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-600 whitespace-nowrap">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-zinc-400 leading-relaxed pl-6">
                    {n.description}
                  </p>
                  {!n.isRead && (
                    <div className="flex justify-end mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "invitation": return <Mail className="size-3.5 text-blue-400" />;
    case "mention": return <AtSign className="size-3.5 text-purple-400" />;
    case "dm": return <MessageSquare className="size-3.5 text-emerald-400" />;
    default: return <Bell className="size-3.5 text-zinc-400" />;
  }
}
