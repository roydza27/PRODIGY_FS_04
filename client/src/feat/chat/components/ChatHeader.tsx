import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { 
  IconHash, 
  IconSearch, 
  IconDotsVertical,
  IconInfoCircle,
  IconSquareCheck,
  IconClock,
  IconHeart,
  IconLayoutList,
  IconCircleX,
  IconCircleMinus,
  IconTrash,
  IconFolder,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PresenceStatus } from "@/shared/components/ui/presence-status";
import { formatLastSeen } from "@/utils/date";
import { clearChat } from "../api/message.api";

interface Props {
  roomName: string;
  isDM?: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
  username?: string;
  status?: string;
  memberCount?: number;
  isOnline?: boolean;
  lastSeenAt?: string;
  showFiles?: boolean;
  onToggleFiles?: () => void;
  contextId?: string;
}

// ============================================================================
// POP-UP MENU COMPONENT
// ============================================================================
function ChatOptionsMenu({ 
  isOpen, 
  onClose,
  isDM,
  isAdmin,
  contextId
}: { 
  isOpen: boolean; 
  onClose: () => void;
  isDM: boolean;
  isAdmin?: boolean;
  contextId?: string;
}) {
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleClearChat = async () => {
    if (!contextId) return;
    try {
      await clearChat(isDM ? "dm" : "room", contextId);
      if (isDM) {
        queryClient.invalidateQueries({ queryKey: ["conversation-messages", contextId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["messages", contextId] });
      }
      onClose();
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menuItems = [
    { icon: <IconInfoCircle size={18} stroke={1.5} />, label: "Contact info" },
    { icon: <IconSearch size={18} stroke={1.5} />, label: "Search" },
    { icon: <IconSquareCheck size={18} stroke={1.5} />, label: "Select messages" },
    { icon: <IconClock size={18} stroke={1.5} />, label: "Disappearing messages" },
    { icon: <IconHeart size={18} stroke={1.5} />, label: "Add to favourites" },
    { icon: <IconLayoutList size={18} stroke={1.5} />, label: "Add to list" },
    { icon: <IconCircleX size={18} stroke={1.5} />, label: "Close chat" },
    ...(!isDM && !isAdmin ? [] : [{ icon: <IconCircleMinus size={18} stroke={1.5} />, label: "Clear chat", onClick: handleClearChat }]),
    { icon: <IconTrash size={18} stroke={1.5} className="text-destructive" />, label: "Delete chat", isDestructive: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-4 top-[56px] z-50 w-56 rounded-xl bg-popover py-2 shadow-xl border border-border/50"
        >
          <ul className="flex flex-col text-[14.5px] text-popover-foreground">
            {menuItems.map((item, index) => (
              <li 
                key={index}
                onClick={() => {
                  item.onClick ? item.onClick() : onClose();
                }}
                className={cn(
                  "flex items-center gap-3.5 px-5 py-2.5 cursor-pointer transition-colors hover:bg-muted/80",
                  item.isDestructive ? "text-destructive hover:bg-destructive/10" : "text-popover-foreground/80 hover:text-popover-foreground"
                )}
              >
                <span className="opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// MAIN HEADER COMPONENT
// ============================================================================
export default function ChatHeader({
  roomName,
  isDM = false,
  isAdmin = false,
  avatarUrl,
  username,
  status,
  isOnline = false,
  lastSeenAt,
  showFiles = false,
  onToggleFiles,
  contextId,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Cleaned up the status text to be more minimal
  const displayStatus = status || (isOnline ? "online" : formatLastSeen(lastSeenAt).toLowerCase());

  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between border-b border-border/30 bg-background px-4">
      
      {/* Left Section: Avatar & Info */}
      <div className="flex items-center gap-3.5 cursor-pointer group">
        {isDM ? (
          <div className="relative flex items-center justify-center">
            {/* Perfectly Round Avatar */}
            <Avatar className="h-10 w-10 rounded-full bg-muted/50 border border-border/20">
              <AvatarImage src={avatarUrl} alt={roomName} className="object-cover" />
              <AvatarFallback className="rounded-full bg-muted text-foreground font-medium text-[15px]">
                {roomName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Clean Status Dot */}
            <PresenceStatus 
              online={isOnline} 
              size="sm" 
              className="absolute -bottom-0.5 -right-0.5" 
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-muted-foreground border border-border/50">
            <IconHash size={20} stroke={2} />
          </div>
        )}
        
        {/* Name and Status (Refined Typography) */}
        <div className="flex flex-col justify-center gap-0.5 text-left">
          <div className="flex items-center gap-2 leading-none">
            {!isDM &&
              <h2 className="text-[16px] font-medium text-foreground/95">
              {roomName}
            </h2>
            }
            {isDM && username && (
              <span className="text-[16px] font-normal text-muted-foreground/50 hidden sm:inline-block">
                {username}
              </span>
            )}
          </div>
          
          {isDM &&
          <span className={cn(
            "py-0.5 text-[12px] leading-none transition-colors",
            isOnline ? "text-emerald-500/90" : "text-muted-foreground/60"
          )}>
            {displayStatus}
          </span>
        }
        </div>
      </div>

      {/* Right Section: Minimal Actions */}
      <div className="flex items-center gap-1 text-muted-foreground/70">
        {onToggleFiles && (
          <button
            title="Shared Files"
            aria-label="Toggle shared files panel"
            onClick={onToggleFiles}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95",
              showFiles
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <IconFolder size={20} stroke={1.5} />
          </button>
        )}

        <button 
          title="Search"
          aria-label="Search messages"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted/50 hover:text-foreground active:scale-95"
        >
          <IconSearch size={20} stroke={1.5} />
        </button>
        
        <button 
          title="Menu"
          aria-label="Open chat options"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95",
            isMenuOpen 
              ? "bg-muted/50 text-foreground" 
              : "hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <IconDotsVertical size={20} stroke={1.5} />
        </button>
      </div>

      {/* Options Menu Pop-up */}
      <ChatOptionsMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        isDM={isDM}
        isAdmin={isAdmin}
        contextId={contextId}
      />
    </header>
  );
}
