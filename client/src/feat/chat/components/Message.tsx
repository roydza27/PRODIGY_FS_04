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
  IconX,
  IconMaximize,
  IconPlayerPlay,
  IconPhoto,
  IconMicrophone,
  IconLoader2,
} from "@tabler/icons-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import UserCardPopover from "@/feat/users/components/UserCardPopover";
import MediaLightbox from "./MediaLightbox";

import { cn, getAssetUrl } from "@/lib/utils";
import type { IAttachment, IReaction } from "../types/message.types";
import { MessageStatus } from "../types/message.types";
import MessageStatusIndicator from "./MessageStatusIndicator";
import { useMessageActions } from "../hooks/useMessageActions";
import { useChatStore } from "@/app/stores/chat.store";
import { ReactionPicker } from "./ReactionPicker";

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
  attachments?: IAttachment[];
  reactions?: IReaction[];
  roomId?: string;
  conversationId?: string;
  isMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
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
  reactions = [],
  roomId,
  conversationId,
  isMenuOpen = false,
  onMenuToggle,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [openPreviews, setOpenPreviews] = useState<Record<string, boolean>>({});
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { editMessage, deleteMessage, isEditing: isSubmittingEdit, isDeleting, addReaction } = useMessageActions(roomId, conversationId);
  const { setReplyTo } = useChatStore();

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

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMessage(id);
      setShowDeleteDialog(false);
    } catch {
      // Error handled by hook
    }
  };

  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) return null;

    const images = attachments
      .filter((a) => a.type === "IMAGE" || a.mimeType?.startsWith("image/"))
      .map((a) => ({ ...a, url: getAssetUrl(a.url) }));
    const videos = attachments
      .filter((a) => a.type === "VIDEO" || a.mimeType?.startsWith("video/"))
      .map((a) => ({ ...a, url: getAssetUrl(a.url) }));
    const audios = attachments
      .filter((a) => a.type === "AUDIO" || a.mimeType?.startsWith("audio/"))
      .map((a) => ({ ...a, url: getAssetUrl(a.url) }));
    const files = attachments
      .filter((a) => !a.mimeType?.startsWith("image/") && !a.mimeType?.startsWith("video/") && !a.mimeType?.startsWith("audio/"))
      .map((a) => ({ ...a, url: getAssetUrl(a.url) }));

    const sizeLabel = (bytes: number) =>
      bytes > 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${(bytes / 1024).toFixed(0)} KB`;

    return (
      <div className="mt-2 flex flex-col gap-2">

        {/* ── Images mosaic ── */}
        {images.length > 0 && (
          <div
            className={cn(
              "grid gap-1 overflow-hidden rounded-2xl",
              images.length === 1 ? "grid-cols-1" :
                images.length === 2 ? "grid-cols-2" :
                  "grid-cols-2"
            )}
          >
            {images.map((img, idx) => {
              const hasFailed = failedUrls[img.url];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden bg-muted/20 border border-border/10",
                    images.length >= 3 && idx === 0 && "col-span-2",
                    images.length === 1 ? "max-h-[400px]" : "max-h-[220px]"
                  )}
                  onClick={() => !hasFailed && setLightboxIndex(idx)}
                >
                  {hasFailed ? (
                    <div className="flex h-[200px] w-full flex-col items-center justify-center bg-muted/50 p-4 text-center">
                      <IconPhoto size={28} className="text-muted-foreground/60" />
                      <span className="mt-1 text-[11px] font-bold text-muted-foreground/80">Image failed to load</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setFailedUrls((prev) => ({ ...prev, [img.url]: true }))}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                          <IconMaximize size={18} stroke={2} />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Videos ── */}
        {videos.map((vid, idx) => {
          const hasFailed = failedUrls[vid.url];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="group overflow-hidden rounded-2xl border border-border/40 bg-black shadow-sm"
            >
              {hasFailed ? (
                <div className="flex h-[200px] w-full flex-col items-center justify-center bg-muted/30 p-4 text-center text-muted-foreground">
                  <IconPlayerPlay size={28} className="text-muted-foreground/60" />
                  <span className="mt-1 text-[12px] font-bold text-muted-foreground/80">Unable to preview video</span>
                  <span className="text-[10px] text-muted-foreground/50 mt-1 font-semibold">Download to watch instead</span>
                </div>
              ) : (
                <video
                  src={vid.url}
                  controls
                  preload="metadata"
                  className="max-h-[360px] w-full rounded-2xl"
                  playsInline
                  onError={() => setFailedUrls((prev) => ({ ...prev, [vid.url]: true }))}
                />
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/90 backdrop-blur-md">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-pink-500">
                  <IconPlayerPlay size={13} stroke={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "truncate text-[12px] font-bold",
                    isCurrentUser ? "text-white" : "text-foreground/90"
                  )}>{vid.filename}</p>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isCurrentUser ? "text-white/70" : "text-muted-foreground/60"
                  )}>
                    VIDEO · {sizeLabel(vid.filesize)}
                  </p>
                </div>
                <a
                  href={vid.url}
                  download={vid.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-all hover:bg-white hover:text-black shadow-sm",
                    isCurrentUser ? "border-white/40 text-white/70" : "border-border/40 text-muted-foreground/60"
                  )}
                  title={`Download ${vid.filename}`}
                >
                  <IconDownload size={13} stroke={2} />
                </a>
              </div>
            </motion.div>
          );
        })}

        {/* ── Audio ── */}
        {audios.map((aud, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group flex flex-col gap-2 overflow-hidden rounded-2xl border p-3 min-w-[240px] max-w-[320px] shadow-sm transition-all hover:shadow-md",
                isCurrentUser ? "bg-muted/30 border-white/20" : "bg-card/40 border-border/40"
              )}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                  isCurrentUser ? "bg-white/20 text-white" : "bg-orange-500/20 text-orange-500"
                )}>
                  <IconMicrophone size={20} stroke={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "truncate text-[13px] font-bold",
                    isCurrentUser ? "text-white" : "text-foreground/90"
                  )}>{aud.filename.startsWith("Voice_Note_") ? "Voice Message" : aud.filename}</p>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest mt-0.5",
                    isCurrentUser ? "text-white/70" : "text-muted-foreground/60"
                  )}>
                    AUDIO · {sizeLabel(aud.filesize)}
                  </p>
                </div>
              </div>
              <audio
                controls
                src={aud.url}
                className="h-10 w-full"
              />
            </motion.div>
          );
        })}

        {/* ── Documents & Files ── */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file, idx) => {
              const mimeType = file.mimeType ?? "";
              const isPdf = mimeType === "application/pdf";
              const isWord = mimeType.includes("msword") || mimeType.includes("wordprocessingml");
              const isExcel = mimeType.includes("ms-excel") || mimeType.includes("spreadsheetml");
              const isPpt = mimeType.includes("ms-powerpoint") || mimeType.includes("presentationml");
              const isArchive = mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z") || /\.(zip|rar|7z)$/i.test(file.filename);

              const accent = isPdf
                ? { border: "border-red-500/30 hover:border-red-500/60", icon: "bg-red-500/15 text-red-500", label: "PDF" }
                : isWord
                  ? { border: "border-blue-500/30 hover:border-blue-500/60", icon: "bg-blue-500/15 text-blue-500", label: "DOCX" }
                  : isExcel
                    ? { border: "border-green-500/30 hover:border-green-500/60", icon: "bg-green-500/15 text-green-500", label: "XLSX" }
                    : isPpt
                      ? { border: "border-orange-500/30 hover:border-orange-500/60", icon: "bg-orange-500/15 text-orange-500", label: "PPTX" }
                      : isArchive
                        ? { border: "border-yellow-500/30 hover:border-yellow-500/60", icon: "bg-yellow-500/15 text-yellow-600", label: "ARCHIVE" }
                        : { border: "border-primary/30 hover:border-primary/60", icon: "bg-primary/15 text-primary", label: "FILE" };

              const isPreviewOpen = !!openPreviews[file.url];
              const previewFailed = failedUrls[file.url];

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex min-w-[240px] max-w-[320px] items-center gap-3 rounded-2xl border p-3 transition-all hover:shadow-md",
                      isCurrentUser ? "bg-primary-foreground/10 border-primary-foreground/30" : "bg-card/40 border-border/40",
                      accent.border
                    )}
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accent.icon)}>
                      <IconFile size={22} stroke={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "truncate text-[13px] font-bold",
                        isCurrentUser ? "text-white" : "text-foreground/90"
                      )}>{file.filename}</p>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest mt-0.5",
                        isCurrentUser ? "text-white/70" : "text-muted-foreground/60"
                      )}>
                        {accent.label} · {sizeLabel(file.filesize)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isPdf && (
                        <button
                          type="button"
                          onClick={() => setOpenPreviews((prev) => ({ ...prev, [file.url]: !prev[file.url] }))}
                          className={cn(
                            "flex h-8 px-2.5 items-center justify-center rounded-xl border text-[11px] font-bold transition-all hover:bg-white hover:text-black",
                            isCurrentUser ? "border-white/40 text-white/80" : "border-border/60 text-muted-foreground"
                          )}
                          title="Toggle PDF preview"
                        >
                          {isPreviewOpen ? "Hide" : "Preview"}
                        </button>
                      )}
                      <a
                        href={file.url}
                        download={file.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all hover:bg-white hover:text-black shadow-sm",
                          isCurrentUser ? "border-white/40 text-white/70" : "border-border/60 text-muted-foreground/60"
                        )}
                        title={`Download ${file.filename}`}
                      >
                        <IconDownload size={15} stroke={2} />
                      </a>
                    </div>
                  </motion.div>

                  {/* Inline PDF Preview Frame */}
                  {isPdf && isPreviewOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-lg border border-border/40 rounded-2xl overflow-hidden bg-card shadow-lg p-1"
                    >
                      {previewFailed ? (
                        <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20">
                          <p className="font-bold text-foreground/75">Unable to preview this file.</p>
                          <p className="mt-1 text-[11px]">Please <a href={file.url} download target="_blank" rel="noopener noreferrer" className="text-primary underline font-bold">Download instead</a>.</p>
                        </div>
                      ) : (
                        <iframe
                          src={file.url}
                          className="w-full h-[400px] rounded-xl border-none"
                          title={`Preview ${file.filename}`}
                          onError={() => setFailedUrls((prev) => ({ ...prev, [file.url]: true }))}
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };



  if (isDM) {
    return (
      <>
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
              "flex max-w-[85%] items-center gap-2",
              isCurrentUser ? "flex-row-reverse" : "flex-row"
            )}
          >

            <div
              className={cn(
                "relative group/bubble overflow-hidden rounded-[22px] px-5 py-3 transition-all duration-300",
                "bg-muted/50 border border-border/20 backdrop-blur-sm",
                isCurrentUser ? "text-white" : "text-foreground",
                isCurrentUser ? "rounded-tr-none" : "rounded-tl-none",
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
                        className="w-full resize-none bg-transparent text-[15px] font-medium leading-relaxed text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                        rows={Math.min(editValue.split("\n").length, 5)}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditing(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/20 hover:bg-muted/30 transition-colors">
                          <IconX size={14} />
                        </button>
                        <button onClick={handleEdit} disabled={isSubmittingEdit} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                          <IconCheck size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ) : isDeleted ? (
                    <motion.div
                      key="deleted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1.5 pr-14 py-1 select-none text-left"
                    >
                      <span className="text-[15px]">🚫</span>
                      <p className="text-[14px] italic font-medium text-muted-foreground/60">
                        This message was deleted.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-2"
                    >
                      {content && (
                        <p className="whitespace-pre-wrap break-words text-[15px] font-medium leading-relaxed selection:bg-primary/20">
                          {content}
                        </p>
                      )}

                      {renderAttachments()}

                      {isEdited && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                          Edited
                        </span>
                      )}

                      <div className="flex justify-end items-center gap-1 text-[10px] text-muted-foreground">
                        <span>{format(timestamp, "h:mm a")}</span>

                        {isCurrentUser && (
                          <MessageStatusIndicator
                            status={status}
                            className={cn(
                              status === MessageStatus.SEEN
                                ? "text-blue-500"
                                : "opacity-60"
                            )}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isCurrentUser && !isDeleted && (
                <div className="absolute inset-0 bg-gradient-to-tr from-muted/10 to-transparent pointer-events-none" />
              )}
            </div>

            {/* Action Menu Trigger */}
            {!isDeleted && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => onMenuToggle?.(!isMenuOpen)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95",
                    isMenuOpen ? "bg-muted text-muted-foreground" : "text-muted-foreground/40 hover:bg-muted/50 hover:text-muted-foreground"
                  )}
                >
                  <IconDots size={18} stroke={2} />
                </button>
              </div>
            )}
          </div>

          {/* Floating Action Bar (Now Menu) */}
          <AnimatePresence>
            {isMenuOpen && !isDeleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute z-30 flex items-center gap-0.5 rounded-xl border border-border/50 bg-card/95 p-1 shadow-2xl backdrop-blur-xl",
                  isCurrentUser ? "top-full right-16 mt-1" : "top-full left-16 mt-1"
                )}
              >
                <HeaderAction icon={<IconMoodSmile size={16} stroke={2.5} />} label="React" onClick={() => onMenuToggle?.(false)} />
                <HeaderAction icon={<IconArrowBackUp size={16} stroke={2.5} />} label="Reply" onClick={() => { 
                  setReplyTo({ 
                    _id: id, 
                    senderId: author, 
                    text: content, 
                    createdAt: timestamp.toISOString(), 
                    attachments
                  } as any); 
                  onMenuToggle?.(false); 
                }} />
                <div className="mx-1 h-3 w-[1px] bg-border" />
                <HeaderAction icon={<IconCopy size={16} stroke={2.5} />} label="Copy" onClick={() => { navigator.clipboard.writeText(content); onMenuToggle?.(false); }} />
                {isCurrentUser && (
                  <>
                    <HeaderAction icon={<IconEdit size={16} stroke={2.5} />} label="Edit" onClick={() => { setIsEditing(true); setEditValue(content); onMenuToggle?.(false); }} />
                    <HeaderAction icon={<IconTrash size={16} stroke={2.5} />} label="Delete" variant="destructive" onClick={() => { handleDelete(); onMenuToggle?.(false); }} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {lightboxIndex !== null && !isDeleted && (
          <MediaLightbox
            images={attachments.filter((a) => a.type === "IMAGE" || a.mimeType?.startsWith("image/"))}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "group relative flex w-full gap-5 px-8 transition-all duration-200",
          isGroupStart ? "mt-8 py-2" : "py-0.5",
          "hover:bg-muted/20"
        )}
      >
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
        <div className="min-w-0 flex-1 flex items-start gap-4">
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
              ) : isDeleted ? (
                <div className="flex gap-1.5 py-1 select-none text-left">
                  <span className="text-[15px]">🚫</span>
                  <p className="text-[14px] italic font-medium text-muted-foreground/60">
                    This message was deleted.
                  </p>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap break-words text-[15px] font-medium leading-relaxed text-foreground/80 selection:bg-primary/20">
                    {content}
                  </p>

                  {/* Reactions */}
                  {reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.emoji}
                          type="button"
                          onClick={() => addReaction({ messageId: id, emoji: reaction.emoji })}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-bold transition-all hover:scale-105 active:scale-95",
                            "bg-card border-border shadow-sm text-foreground"
                          )}
                        >
                          <span className="text-base">{reaction.emoji}</span>
                          <span className="text-muted-foreground">{reaction.users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {renderAttachments()}
                  {isEdited && (
                    <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                      Edited
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Persistent Action Menu Button - Far Right in Rooms */}
          {!isDeleted && (
            <div className="flex-shrink-0 relative">
              <button
                onClick={() => onMenuToggle?.(!isMenuOpen)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95",
                  isMenuOpen ? "bg-muted text-muted-foreground shadow-inner" : "text-muted-foreground/20 hover:bg-muted hover:text-muted-foreground"
                )}
              >
                <IconDots size={20} stroke={2.5} />
              </button>

              {/* Action Bar Popup (Directly Underneath) */}
              <AnimatePresence>
                {isMenuOpen && !isDeleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 z-30 mt-1 flex items-center gap-0.5 rounded-xl border border-border/50 bg-card/95 p-1 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="relative">
                    <HeaderAction icon={<IconMoodSmile size={18} stroke={2} />} label="React" onClick={() => setShowReactionPicker(!showReactionPicker)} />
                    {showReactionPicker && (
                      <ReactionPicker 
                        onSelect={(emoji: string) => { addReaction({ messageId: id, emoji }); setShowReactionPicker(false); }} 
                        onClose={() => setShowReactionPicker(false)} 
                      />
                    )}
                  </div>
                    <HeaderAction icon={<IconArrowBackUp size={18} stroke={2} />} label="Reply" onClick={() => { 
                      setReplyTo({ 
                        _id: id, 
                        senderId: author, 
                        text: content, 
                        createdAt: timestamp.toISOString(), 
                        attachments
                      } as any); 
                      onMenuToggle?.(false); 
                    }} />
                    <HeaderAction icon={<IconCopy size={18} stroke={2} />} label="Copy" onClick={() => { navigator.clipboard.writeText(content); onMenuToggle?.(false); }} />
                    {isCurrentUser && (
                      <>
                        <HeaderAction icon={<IconEdit size={18} stroke={2} />} label="Edit" onClick={() => { setIsEditing(true); setEditValue(content); onMenuToggle?.(false); }} />
                        <HeaderAction icon={<IconTrash size={18} stroke={2} />} label="Delete" variant="destructive" onClick={() => { handleDelete(); onMenuToggle?.(false); }} />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
      {lightboxIndex !== null && !isDeleted && (
        <MediaLightbox
          images={attachments
            .filter((a) => a.type === "IMAGE" || a.mimeType?.startsWith("image/"))
            .map((a) => ({ ...a, url: getAssetUrl(a.url) }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be removed for everyone in this {isDM ? "chat" : "room"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              variant="destructive"
              className="min-w-[100px]"
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95",
        variant === "destructive" ? "text-destructive hover:text-destructive" : "text-muted-foreground/60 hover:text-foreground"
      )}
    >
      {icon}
    </motion.button>
  );
}