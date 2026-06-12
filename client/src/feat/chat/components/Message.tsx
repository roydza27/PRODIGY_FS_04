import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  IconArrowBackUp,
  IconDots,
  IconMoodSmile,
  IconCopy,
  IconEdit,
  IconTrash,
  IconFile,
  IconDownload,
  IconCheck,
  IconX
} from "@tabler/icons-react";

import UserCardPopover from "@/feat/users/components/UserCardPopover";

import { cn } from "@/lib/utils";
import { MessageStatus } from "../types/message.types";
import MessageStatusIndicator from "./MessageStatusIndicator";
import { useMessageActions } from "../hooks/useMessageActions";

interface MessageProps {
  id: string;
  author: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
  };

  content: string;
  timestamp: Date;

  isGroupStart?: boolean;
  isContinuation?: boolean;
  isDM?: boolean;
  isCurrentUser?: boolean;
  status?: MessageStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
  roomId?: string;
  conversationId?: string;
}

export default function Message({
  id,
  author,
  content,
  timestamp,
  isGroupStart = true,
  isDM = false,
  isCurrentUser = false,
  status = MessageStatus.SENT,
  isEdited = false,
  isDeleted = false,
  attachments = [],
  roomId,
  conversationId,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const { editMessage, deleteMessage, isEditing: isSubmittingEdit } = useMessageActions(roomId, conversationId);

  const handleEdit = async () => {
    if (editValue.trim() === content || !editValue.trim()) {
      setIsEditing(false);
      return;
    }
    try {
      await editMessage({ messageId: id, text: editValue });
      setIsEditing(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(id);
    } catch {
      // Error handled by hook
    }
  };

  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-3 flex flex-wrap gap-3">
        {attachments.map((file, idx) => {
          const isImage = file.type.startsWith("image/");
          
          if (isImage) {
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group/img relative overflow-hidden rounded-2xl border border-border/20 shadow-sm"
              >
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="max-h-[300px] max-w-full object-contain bg-muted/20" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100">
                  <a 
                    href={file.url} 
                    download={file.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-110"
                  >
                    <IconDownload size={20} />
                  </a>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex min-w-[200px] max-w-[300px] items-center gap-4 rounded-2xl border border-border/20 bg-muted/30 p-4 transition-all hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <IconFile size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-foreground/90">{file.name}</p>
                <p className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <a 
                href={file.url} 
                download={file.name}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <IconDownload size={18} />
              </a>
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (isDM) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "group relative flex w-full px-6 transition-all text-left duration-300", 
          isGroupStart ? "mt-6" : "mt-1",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex max-w-[70%] flex-col",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          {isGroupStart && !isCurrentUser && (
            <span className="mb-1.5 ml-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
              {author.name}
            </span>
          )}

          <div
            className={cn(
              "relative group/bubble overflow-hidden rounded-[22px] px-5 py-3 transition-all duration-300",
              isCurrentUser
                ? "bg-primary text-primary-foreground shadow-[0_8px_16px_-4px_rgba(var(--primary),0.2)] rounded-tr-none"
                : "bg-muted/50 text-foreground border border-border/20 backdrop-blur-sm rounded-tl-none",
              !isGroupStart && (isCurrentUser ? "rounded-tr-[22px]" : "rounded-tl-[22px]"),
              isDeleted && "opacity-60 grayscale-[0.5]",
              "hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    key="editing"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="min-w-[200px] space-y-2"
                  >
                    <textarea
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleEdit();
                        } else if (e.key === "Escape") {
                          setIsEditing(false);
                        }
                      }}
                      className="w-full resize-none bg-transparent text-[15px] font-medium leading-relaxed text-primary-foreground focus:outline-none placeholder:text-primary-foreground/40"
                      rows={Math.min(editValue.split("\n").length, 5)}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <IconX size={14} />
                      </button>
                      <button onClick={handleEdit} disabled={isSubmittingEdit} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary hover:bg-white/90 transition-colors">
                        <IconCheck size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="viewing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className={cn(
                      "whitespace-pre-wrap break-words pr-14 text-[15px] font-medium leading-relaxed selection:bg-white/20",
                      isDeleted && "italic text-muted-foreground/60"
                    )}>
                      {content}
                    </p>
                    {renderAttachments()}
                    {isEdited && !isDeleted && (
                      <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                        Edited
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "absolute bottom-0 right-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter opacity-0 transition-opacity group-hover/bubble:opacity-60",
                  isCurrentUser
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{format(timestamp, "h:mm a")}</span>
                {isCurrentUser && (
                  <MessageStatusIndicator 
                    status={status} 
                    className={cn(
                      "transition-all duration-300",
                      status === MessageStatus.SEEN ? "opacity-100" : ""
                    )}
                  />
                )}
              </div>
            </div>
            
            {isCurrentUser && !isDeleted && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        {/* Floating Action Bar */}
        {!isDeleted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1 }}
            className={cn(
              "absolute -top-5 z-20 hidden items-center gap-0.5 rounded-xl border border-border/50 bg-card/90 p-1 shadow-2xl backdrop-blur-xl transition-all animate-in zoom-in-95 group-hover:flex",
              isCurrentUser ? "right-10" : "left-10"
            )}
          >
            <HeaderAction icon={<IconMoodSmile size={16} stroke={2.5} />} label="React" />
            <HeaderAction icon={<IconArrowBackUp size={16} stroke={2.5} />} label="Reply" />
            <div className="mx-1 h-3 w-[1px] bg-border" />
            <HeaderAction icon={<IconCopy size={16} stroke={2.5} />} label="Copy" onClick={() => navigator.clipboard.writeText(content)} />
            {isCurrentUser && (
              <>
                <HeaderAction icon={<IconEdit size={16} stroke={2.5} />} label="Edit" onClick={() => { setIsEditing(true); setEditValue(content); }} />
                <HeaderAction icon={<IconTrash size={16} stroke={2.5} />} label="Delete" variant="destructive" onClick={handleDelete} />
              </>
            )}
            <div className="mx-1 h-3 w-[1px] bg-border" />
            <HeaderAction icon={<IconDots size={16} stroke={2.5} />} label="More" />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex w-full gap-5 px-8 transition-all duration-200",
        isGroupStart ? "mt-8 py-2" : "py-0.5",
        "hover:bg-muted/20"
      )}
    >
      {/* Action Bar */}
      {!isDeleted && (
        <div className="absolute -top-5 right-10 z-20 hidden items-center gap-0.5 rounded-xl border border-border/50 bg-card/90 p-1 shadow-2xl backdrop-blur-xl group-hover:flex">
          <HeaderAction icon={<IconMoodSmile size={18} stroke={2} />} label="React" />
          <HeaderAction icon={<IconArrowBackUp size={18} stroke={2} />} label="Reply" />
          <HeaderAction icon={<IconCopy size={18} stroke={2} />} label="Copy" onClick={() => navigator.clipboard.writeText(content)} />
          {isCurrentUser && (
            <>
              <HeaderAction icon={<IconEdit size={18} stroke={2} />} label="Edit" onClick={() => { setIsEditing(true); setEditValue(content); }} />
              <HeaderAction icon={<IconTrash size={18} stroke={2} />} label="Delete" variant="destructive" onClick={handleDelete} />
            </>
          )}
          <div className="mx-1 h-4 w-[1px] bg-border" />
          <HeaderAction icon={<IconDots size={18} stroke={2} />} label="More" />
        </div>
      )}

      {/* Avatar / Timestamp */}
      <div className="flex w-12 shrink-0 justify-center">
        {isGroupStart ? (
          <UserCardPopover user={author}>
            <button
              type="button"
              className="relative rounded-2xl outline-none ring-primary/20 transition-all focus-visible:ring-4 hover:scale-105 active:scale-95"
            >
              <Avatar className="h-12 w-12 rounded-2xl shadow-md border-2 border-background">
                <AvatarImage
                  src={author.avatarUrl}
                  alt={author.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 font-black text-primary text-sm">
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </UserCardPopover>
        ) : (
          <div className="opacity-0 transition-opacity group-hover:opacity-100 mt-1">
            <span className="font-black text-[10px] text-muted-foreground/30 tracking-tighter uppercase">
              {format(timestamp, "HH:mm")}
            </span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="min-w-0 flex-1">
        {isGroupStart && (
          <div className="mb-1.5 flex items-baseline gap-3">
            <UserCardPopover user={author}>
              <button
                type="button"
                className="cursor-pointer text-[16px] font-black text-foreground/90 transition-colors hover:text-primary hover:underline underline-offset-4 decoration-2"
              >
                {author.name}
              </button>
            </UserCardPopover>
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
              {format(timestamp, "h:mm a")}
            </span>
          </div>
        )}

        <div className="relative text-left">
          {isEditing ? (
            <div className="mt-2 flex flex-col gap-2 max-w-2xl bg-muted/30 rounded-2xl border border-border/20 p-4">
              <textarea
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  } else if (e.key === "Escape") {
                    setIsEditing(false);
                  }
                }}
                className="w-full resize-none bg-transparent text-[15px] font-medium leading-relaxed text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                rows={Math.min(editValue.split("\n").length, 8)}
              />
              <div className="flex justify-end gap-3 pt-2 border-t border-border/10">
                <button onClick={() => setIsEditing(false)} className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleEdit} 
                  disabled={isSubmittingEdit} 
                  className="text-[11px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-all"
                >
                  {isSubmittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={cn(
                "whitespace-pre-wrap break-words text-[15px] font-medium leading-relaxed text-foreground/80 selection:bg-primary/20",
                isDeleted && "italic text-muted-foreground/60"
              )}>
                {content}
              </p>
              {renderAttachments()}
              {isEdited && !isDeleted && (
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                  Edited
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HeaderAction({ 
  icon, 
  label, 
  variant = "default",
  onClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  variant?: "default" | "destructive",
  onClick?: () => void
}) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: variant === "destructive" ? "hsl(var(--destructive)/0.1)" : "hsl(var(--muted))" }}
      whileTap={{ scale: 0.95 }}
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 active:scale-95",
        variant === "destructive" ? "text-destructive hover:text-destructive" : "text-muted-foreground/60 hover:text-foreground"
      )}
    >
      {icon}
    </motion.button>
  );
}