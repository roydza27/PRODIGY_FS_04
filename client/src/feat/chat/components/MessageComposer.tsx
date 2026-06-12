import { useEffect, useRef, useState } from "react";
import {
  IconMoodSmile,
  IconPlus,
  IconSend,
  IconMicrophone,
  IconMarkdown,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
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
  const [attachments, setAttachments] = useState<Array<{ url: string; name: string; type: string; size: number, isUploading?: boolean }>>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { activeWorkspace } = useActiveWorkspace();
  const workspaceId = propWorkspaceId || activeWorkspace?._id;

  // Auto-resize logic
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "24px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    const isUploading = attachments.some(a => a.isUploading);
    if ((!trimmed && attachments.length === 0) || isUploading) return;

    // Use the socket service to send message with attachments
    socketService.sendMessage({
      workspaceId,
      roomId,
      conversationId,
      text: trimmed,
      attachments: attachments.map(({ url, name, type, size }) => ({ url, name, type, size })),
    });
    
    // Stop typing immediately when the message is sent
    if (conversationId) {
      socketService.emit("dm:typing:stop", { workspaceId, conversationId });
    } else if (roomId) {
      socketService.emit("room:typing:stop", { workspaceId, roomId });
    }

    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      isUploading: true,
    }));

    setAttachments(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      setTimeout(() => {
        setAttachments(prev => prev.map(a => a.url === file.url ? { ...a, isUploading: false } : a));
      }, 1000 + (Math.random() * 2000));
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTextChange = (value: string) => {
    setText(value);
    
    const isCurrentlyTyping = text.trim().length > 0;
    const isNowTyping = value.trim().length > 0;

    if (conversationId) {
      // Start typing if there was no text and now there is text
      if (!isCurrentlyTyping && isNowTyping) {
        socketService.emit("dm:typing:start", { workspaceId, conversationId });
      } 
      // Stop typing only if text is completely cleared out
      else if (isCurrentlyTyping && !isNowTyping) {
        socketService.emit("dm:typing:stop", { workspaceId, conversationId });
      }
    } else if (roomId) {
      // Start typing if there was no text and now there is text
      if (!isCurrentlyTyping && isNowTyping) {
        socketService.emit("room:typing:start", { workspaceId, roomId });
      } 
      // Stop typing only if text is completely cleared out
      else if (isCurrentlyTyping && !isNowTyping) {
        socketService.emit("room:typing:stop", { workspaceId, roomId });
      }
    }
  };

  return (
    <div className="relative w-full bg-background/80 backdrop-blur-xl border-t border-border/40 px-4 py-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Main Input Container */}
        <div className={cn(
          "relative flex flex-col gap-2 rounded-[24px] border p-2 transition-all duration-300",
          isFocused 
            ? "border-primary/30 bg-muted/30 shadow-[0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-primary/20" 
            : "border-border/50 bg-muted/20"
        )}>
          
          <div className="flex items-end gap-2">
            {/* Left Actions */}
            <div className="flex items-center gap-1 pl-1 pb-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary">
                <IconMoodSmile size={22} stroke={2} />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <IconPlus size={22} stroke={2.5} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
              />
            </div>

            {/* Textarea Area */}
            <div className="flex-1 px-2 py-2">
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((file, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative flex items-center gap-2 rounded-xl border border-border/40 bg-background px-3 py-1.5 shadow-sm"
                    >
                      {file.isUploading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-[1px]">
                           <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      )}
                      
                      {file.type.startsWith("image/") ? (
                        <div className="h-6 w-6 overflow-hidden rounded-md border border-border/20">
                          <img src={file.url} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <IconPlus size={12} className="rotate-45" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="max-w-[100px] truncate text-[11px] font-bold text-foreground/70">{file.name}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/40 leading-none">
                          {(file.size / 1024).toFixed(0)}KB
                        </span>
                      </div>
                      <button 
                        onClick={() => removeAttachment(idx)}
                        className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <IconX size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
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
                {(!text.trim() && attachments.length === 0) ? (
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
            (text.length > 0 || attachments.length > 0) ? "opacity-100" : "opacity-0"
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
