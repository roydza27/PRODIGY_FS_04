import { useEffect, useRef, useState } from "react";
import {
  IconMoodSmile,
  IconPlus,
  IconSend,
  IconMicrophone,
  IconMarkdown,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useSendMessage } from "../hooks/useSendMessage";
import { socketService } from "@/services/socket/socket.service";

interface MessageComposerProps {
  workspaceId?: string;
  roomId?: string;
  conversationId?: string;
  placeholderName?: string;
}

export default function MessageComposer({
  workspaceId: propWorkspaceId,
  roomId,
  conversationId,
  placeholderName = "John",
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  // NOTE: Removed the typingTimeoutRef completely
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { activeWorkspace } = useActiveWorkspace();
  const workspaceId = propWorkspaceId || activeWorkspace?._id;

  const { sendMessage } = useSendMessage(
    workspaceId,
    roomId,
    conversationId
  );

  // Auto-resize logic
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "24px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    sendMessage(trimmed);
    
    // Stop typing immediately when the message is sent
    if (conversationId) {
      socketService.emit("dm:typing:stop", { conversationId });
    } else if (roomId) {
      socketService.emit("room:typing:stop", { roomId });
    }

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.focus();
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    
    const isCurrentlyTyping = text.trim().length > 0;
    const isNowTyping = value.trim().length > 0;

    if (conversationId) {
      // Start typing if there was no text and now there is text
      if (!isCurrentlyTyping && isNowTyping) {
        socketService.emit("dm:typing:start", { conversationId });
      } 
      // Stop typing only if text is completely cleared out
      else if (isCurrentlyTyping && !isNowTyping) {
        socketService.emit("dm:typing:stop", { conversationId });
      }
    } else if (roomId) {
      // Start typing if there was no text and now there is text
      if (!isCurrentlyTyping && isNowTyping) {
        socketService.emit("room:typing:start", { roomId });
      } 
      // Stop typing only if text is completely cleared out
      else if (isCurrentlyTyping && !isNowTyping) {
        socketService.emit("room:typing:stop", { roomId });
      }
    }
  };

  return (
    <div className="relative w-full bg-background/80 backdrop-blur-xl border-t border-border/40 px-4 py-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Main Input Container */}
        <div className={cn(
          "relative flex items-end gap-2 rounded-[24px] border p-2 transition-all duration-300",
          isFocused 
            ? "border-primary/30 bg-muted/30 shadow-[0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-primary/20" 
            : "border-border/50 bg-muted/20"
        )}>
          
          {/* Left Actions */}
          <div className="flex items-center gap-1 pl-1 pb-1">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary">
              <IconMoodSmile size={22} stroke={2} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary">
              <IconPlus size={22} stroke={2.5} />
            </button>
          </div>

          {/* Textarea Area */}
          <div className="flex-1 px-2 py-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={roomId ? "Message in channel" : `Message @${placeholderName}`}
              className="w-full resize-none bg-transparent text-[15px] font-medium leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none no-scrollbar min-h-[24px]"
              rows={1}
            />
          </div>

          {/* Right Action (Send/Mic) */}
          <div className="pr-1 pb-1">
            <AnimatePresence mode="wait">
              {!text.trim() ? (
                <motion.button
                  key="mic"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <IconMicrophone size={22} stroke={2} />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSend}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  <IconSend size={18} stroke={2.5} className="translate-x-0.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info Area */}
        <div className="mt-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 group cursor-help">
              <IconMarkdown size={14} className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                Markdown
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">
              Shift + Enter for new line
            </span>
          </div>

          <div className={cn(
            "flex items-center gap-1.5 transition-opacity duration-300",
            text.length > 0 ? "opacity-100" : "opacity-0"
          )}>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
              Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}