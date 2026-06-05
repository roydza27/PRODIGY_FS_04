import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  IconPlus, 
  IconMoodSmile, 
  IconSend,
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconCode,
  IconLink,
  IconList,
  IconListNumbers
} from "@tabler/icons-react";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { socketService } from "@/services/socket/socket.service";
import { useAuthStore } from "@/app/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import type { MessagesResponse, Message } from "../types/message.types";
import { cn } from "@/lib/utils";

export default function MessageComposer() {
  const [text, setText] = useState("");
  const { roomId } = useParams();
  const { activeWorkspace } = useActiveWorkspace();
  const workspaceId = activeWorkspace?._id;
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || !workspaceId || !roomId || !user) return;

    const newMessageData = {
      workspaceId,
      roomId,
      type: "room",
      text: text.trim(),
    };

    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      workspaceId,
      roomId,
      senderId: {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      type: "room",
      text: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<MessagesResponse>(
      ["messages", roomId],
      (oldData) => {
        if (!oldData) return [optimisticMessage];
        return [optimisticMessage, ...oldData];
      }
    );

    // Emit socket event
    socketService.emit("message:send", newMessageData);

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-6 pb-6 pt-2">
      <div className="mx-auto max-w-5xl">
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/30 transition-all duration-200">
          
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-0.5 border-b border-border/50 bg-muted/30 px-2 py-1">
            <ToolbarButton icon={<IconBold size={16} />} />
            <ToolbarButton icon={<IconItalic size={16} />} />
            <ToolbarButton icon={<IconStrikethrough size={16} />} />
            <div className="mx-1 h-4 w-[1px] bg-border/50" />
            <ToolbarButton icon={<IconLink size={16} />} />
            <ToolbarButton icon={<IconList size={16} />} />
            <ToolbarButton icon={<IconListNumbers size={16} />} />
            <div className="mx-1 h-4 w-[1px] bg-border/50" />
            <ToolbarButton icon={<IconCode size={16} />} />
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-2 p-3">
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <IconPlus size={20} />
            </button>
            
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message #general"
              className="flex-1 max-h-[400px] resize-none bg-transparent py-1.5 text-[15px] text-foreground placeholder-muted-foreground focus:outline-none"
            />

            <div className="flex items-center gap-1 self-end mb-0.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <IconMoodSmile size={20} />
              </button>
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                  text.trim() 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100" 
                    : "bg-muted text-muted-foreground scale-95 opacity-50"
                )}
              >
                <IconSend size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-end px-1">
          <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            <b>Enter</b> to send • <b>Shift + Enter</b> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
      {icon}
    </button>
  );
}
