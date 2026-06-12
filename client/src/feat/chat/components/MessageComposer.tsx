import { useEffect, useRef, useState, useCallback } from "react";
import {
  IconMoodSmile,
  IconPlus,
  IconSend,
  IconMicrophone,
  IconMarkdown,
  IconX,
  IconFile,
  IconFileText,
  IconAlertCircle,
  IconRefresh,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconPlayerStopFilled,
  IconTrash,
  IconArrowBackUp,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getAssetUrl } from "@/lib/utils";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { socketService } from "@/services/socket/socket.service";
import { uploadFiles } from "@/feat/chat/api/upload.api";
import { useAudioRecorder } from "@/feat/chat/hooks/useAudioRecorder";
import type { IAttachment } from "@/feat/chat/types/message.types";
import { useChatStore } from "@/app/stores/chat.store";

interface MessageComposerProps {
  workspaceId?: string;
  roomId?: string;
  conversationId?: string;
  placeholderName?: string;
  onSend?: (text: string, attachments: IAttachment[]) => void;
}

// ---------------------------------------------------------------------------
// Attachment state tracked in the composer (extends IAttachment with UI state)
// ---------------------------------------------------------------------------
interface PendingAttachment extends IAttachment {
  /** Temp client-side id before server confirms upload */
  _tempId: string;
  /** True while the file is being uploaded to the server */
  uploading: boolean;
  /** Upload progress 0-100 */
  progress: number;
  /** Error message if upload failed */
  error?: string;
  /** Original File object to allow retry */
  _file?: File;
}

// ---------------------------------------------------------------------------
// Helper — derive file category icon and colour
// ---------------------------------------------------------------------------
function getFileCategory(mimeType: string) {
  if (
    mimeType === "application/pdf"
  ) return { label: "PDF", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };

  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return { label: "DOC", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };

  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) return { label: "XLS", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };

  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) return { label: "PPT", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };

  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-zip-compressed" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/vnd.rar" ||
    mimeType === "application/x-7z-compressed"
  ) return { label: "ZIP", color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };

  if (mimeType === "text/plain")
    return { label: "TXT", color: "text-muted-foreground", bg: "bg-muted/40", border: "border-border/40" };

  if (mimeType.startsWith("image/"))
    return { label: "IMG", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };

  if (mimeType.startsWith("video/"))
    return { label: "VID", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" };

  if (mimeType.startsWith("audio/"))
    return { label: "AUDIO", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" };

  return { label: "FILE", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
}

// ---------------------------------------------------------------------------
// Document MIME types accepted by the document picker
// ---------------------------------------------------------------------------
const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain";

const FILE_ACCEPT =
  ".zip,.rar,.7z,application/zip,application/x-zip-compressed,application/x-rar-compressed,application/vnd.rar,application/x-7z-compressed,application/octet-stream";

const PHOTO_ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif";
const VIDEO_ACCEPT = ".mp4,.webm,.mov,.mkv,video/mp4,video/webm,video/quicktime,video/x-matroska";
const AUDIO_ACCEPT = ".mp3,.wav,.ogg,.m4a,.aac,.flac,audio/*";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MessageComposer({
  workspaceId: propWorkspaceId,
  roomId,
  conversationId,
  placeholderName = "John",
  onSend,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useAudioRecorder();

  const { activeWorkspace } = useActiveWorkspace();
  const workspaceId = propWorkspaceId || activeWorkspace?._id;

  const { replyTo, setReplyTo } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "24px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [text]);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  // ---------------------------------------------------------------------------
  // Upload a batch of files
  // ---------------------------------------------------------------------------
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Create pending entries immediately so the UI reacts
    const pending: PendingAttachment[] = files.map((file) => ({
      _tempId: `temp-${Date.now()}-${Math.random()}`,
      id: undefined,
      type: "FILE" as const,
      url: "",
      filename: file.name,
      filesize: file.size,
      mimeType: file.type,
      uploading: true,
      progress: 0,
      _file: file,
    }));

    setAttachments((prev) => [...prev, ...pending]);

    // Upload all files in one multipart request
    try {
      const results = await uploadFiles(files, (pct) => {
        setAttachments((prev) =>
          prev.map((a) =>
            pending.some((p) => p._tempId === a._tempId)
              ? { ...a, progress: pct }
              : a
          )
        );
      });

      // Replace pending entries with confirmed server attachments
      setAttachments((prev) => {
        let resultIdx = 0;
        return prev.map((a) => {
          if (pending.some((p) => p._tempId === a._tempId)) {
            const confirmed = results[resultIdx++];
            if (confirmed) {
              return {
                ...confirmed,
                _tempId: a._tempId,
                uploading: false,
                progress: 100,
              };
            }
          }
          return a;
        });
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Upload failed. Try again.";

      setAttachments((prev) =>
        prev.map((a) =>
          pending.some((p) => p._tempId === a._tempId)
            ? { ...a, uploading: false, error: errorMsg }
            : a
        )
      );
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Drag-and-drop
  // ---------------------------------------------------------------------------
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (files.length > 0) await processFiles(files);
  }, [processFiles]);

  // ---------------------------------------------------------------------------
  // Clipboard paste (Ctrl+V screenshots / copied images)
  // ---------------------------------------------------------------------------
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const imageFiles = Array.from(e.clipboardData.items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((f): f is File => f !== null);
    if (imageFiles.length > 0) {
      e.preventDefault();
      await processFiles(imageFiles);
    }
  }, [processFiles]);

  // ---------------------------------------------------------------------------
  // File input handler
  // ---------------------------------------------------------------------------
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // reset so same file can be re-selected
    setShowPicker(false);
    await processFiles(files);
  };

  // ---------------------------------------------------------------------------
  // Retry a failed attachment
  // ---------------------------------------------------------------------------
  const retryAttachment = useCallback(
    async (tempId: string) => {
      const attachment = attachments.find((a) => a._tempId === tempId);
      if (!attachment?._file) return;

      setAttachments((prev) =>
        prev.map((a) =>
          a._tempId === tempId
            ? { ...a, uploading: true, progress: 0, error: undefined }
            : a
        )
      );

      try {
        const results = await uploadFiles([attachment._file], (pct) => {
          setAttachments((prev) =>
            prev.map((a) =>
              a._tempId === tempId ? { ...a, progress: pct } : a
            )
          );
        });

        if (results[0]) {
          setAttachments((prev) =>
            prev.map((a) =>
              a._tempId === tempId
                ? { ...results[0], _tempId: tempId, uploading: false, progress: 100 }
                : a
            )
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Upload failed. Try again.";
        setAttachments((prev) =>
          prev.map((a) =>
            a._tempId === tempId
              ? { ...a, uploading: false, error: errorMsg }
              : a
          )
        );
      }
    },
    [attachments]
  );

  const removeAttachment = (tempId: string) => {
    setAttachments((prev) => prev.filter((a) => a._tempId !== tempId));
  };

  // ---------------------------------------------------------------------------
  // Send
  // ---------------------------------------------------------------------------
  const isUploading = attachments.some((a) => a.uploading);
  const hasErrors = attachments.some((a) => a.error);
  const confirmedAttachments = attachments
    .filter((a) => !a.uploading && !a.error && a.url)
    .map(({ _tempId, uploading, progress, error, _file, ...rest }) => rest as IAttachment);

  const canSend =
    (text.trim().length > 0 || confirmedAttachments.length > 0) &&
    !isUploading &&
    !hasErrors;

  const handleSend = () => {
    if (!canSend) return;

    if (onSend) {
      onSend(text.trim(), confirmedAttachments);
    } else {
      socketService.sendMessage({
        workspaceId,
        roomId,
        conversationId,
        text: text.trim(),
        attachments: confirmedAttachments,
        replyTo: replyTo?._id,
        messageType: (() => {
          if (confirmedAttachments.length === 0) return "TEXT";
          if (confirmedAttachments.some((a) => a.type === "VIDEO")) return "VIDEO";
          if (confirmedAttachments.some((a) => a.type === "IMAGE")) return "IMAGE";
          if (confirmedAttachments.some((a) => a.type === "DOCUMENT")) return "DOCUMENT";
          return "FILE";
        })(),
      });

      // Stop typing
      if (conversationId) {
        socketService.emit("dm:typing:stop", { workspaceId, conversationId });
      } else if (roomId) {
        socketService.emit("room:typing:stop", { workspaceId, roomId });
      }
    }

    setText("");
    setAttachments([]);
    setReplyTo(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.focus();
    }
  };

  // ---------------------------------------------------------------------------
  // Typing indicators
  // ---------------------------------------------------------------------------
  const handleTextChange = (value: string) => {
    setText(value);

    const wasTyping = text.trim().length > 0;
    const isNowTyping = value.trim().length > 0;

    if (conversationId) {
      if (!wasTyping && isNowTyping)
        socketService.emit("dm:typing:start", { workspaceId, conversationId });
      else if (wasTyping && !isNowTyping)
        socketService.emit("dm:typing:stop", { workspaceId, conversationId });
    } else if (roomId) {
      if (!wasTyping && isNowTyping)
        socketService.emit("room:typing:start", { workspaceId, roomId });
      else if (wasTyping && !isNowTyping)
        socketService.emit("room:typing:stop", { workspaceId, roomId });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      className="relative w-full bg-background/80 backdrop-blur-xl border-t border-border/40 px-4 py-4 md:px-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag-over overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/40 bg-primary/5 backdrop-blur-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <IconPhoto size={28} stroke={1.5} />
            </div>
            <p className="text-[13px] font-black uppercase tracking-widest text-primary/70">
              Drop files here
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl">
        {/* Reply Banner */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mb-2 overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-t-[20px] border border-b-0 border-primary/20 bg-primary/5 px-4 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconArrowBackUp size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary/70">
                    Replying to {replyTo.senderId.name}
                  </p>
                  <p className="truncate text-[13px] font-medium text-foreground/70">
                    {replyTo.text || (replyTo.attachments && replyTo.attachments.length > 0 ? `${replyTo.attachments[0].type === "IMAGE" ? "🖼 Photo" : replyTo.attachments[0].type === "VIDEO" ? "🎥 Video" : "📄 File"}: ${replyTo.attachments[0].filename}` : "Media")}
                  </p>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                >
                  <IconX size={14} stroke={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Input Container */}
        <div
          className={cn(
            "relative flex flex-col gap-2 rounded-[24px] border p-2 transition-all duration-300",
            isFocused
              ? "border-primary/30 bg-muted/30 shadow-[0_0_20px_rgba(139,92,246,0.05)] ring-1 ring-primary/20"
              : "border-border/50 bg-muted/20",
            replyTo && "rounded-t-none border-t-0"
          )}
        >
          {/* Attachment Strip */}
          <AnimatePresence initial={false}>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 px-3 pt-2"
              >
                {attachments.map((file) => {
                  const isImage = file.mimeType.startsWith("image/");
                  const cat = getFileCategory(file.mimeType);

                  // Image thumbnail card
                  if (isImage && !file.error && !file.uploading && file.url) {
                    return (
                      <motion.div
                        key={file._tempId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border/30 shadow-sm"
                      >
                        <img
                          src={getAssetUrl(file.url)}
                          alt={file.filename}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeAttachment(file._tempId)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <IconX size={10} stroke={3} />
                        </button>
                      </motion.div>
                    );
                  }

                  // Uploading image skeleton
                  if (isImage && file.uploading) {
                    return (
                      <motion.div
                        key={file._tempId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-purple-500/20 bg-purple-500/10"
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                          <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
                            <motion.div
                              className="h-full rounded-full bg-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ ease: "linear", duration: 0.2 }}
                            />
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-purple-500/70">
                            {file.progress}%
                          </p>
                        </div>
                        <button
                          onClick={() => removeAttachment(file._tempId)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                        >
                          <IconX size={10} stroke={3} />
                        </button>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={file._tempId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "group relative flex min-w-[180px] max-w-[240px] items-center gap-2.5 rounded-2xl border bg-background px-3 py-2 shadow-sm",
                        file.error
                          ? "border-destructive/40"
                          : cat.border
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          file.error ? "bg-destructive/10 text-destructive" : cat.bg + " " + cat.color
                        )}
                      >
                        {file.error ? (
                          <IconAlertCircle size={18} stroke={2} />
                        ) : (
                          <IconFile size={18} stroke={2} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-foreground/90 leading-tight">
                          {file.filename}
                        </p>
                        {file.error ? (
                          <p className="text-[10px] text-destructive/80 font-medium leading-tight mt-0.5 truncate">
                            {file.error}
                          </p>
                        ) : file.uploading ? (
                          <div className="mt-1.5">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
                              <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ ease: "linear", duration: 0.2 }}
                              />
                            </div>
                            <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                              {file.progress < 100 ? `${file.progress}%` : "Processing…"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                            {cat.label}{" · "}
                            {file.filesize > 1024 * 1024
                              ? `${(file.filesize / 1024 / 1024).toFixed(1)} MB`
                              : `${(file.filesize / 1024).toFixed(0)} KB`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {file.error && file._file && (
                          <button
                            onClick={() => retryAttachment(file._tempId)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title="Retry upload"
                          >
                            <IconRefresh size={12} stroke={2.5} />
                          </button>
                        )}
                        <button
                          onClick={() => removeAttachment(file._tempId)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground/60 transition-colors"
                          title="Remove"
                        >
                          <IconX size={12} stroke={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            {/* Left Actions */}
            <div className="relative flex items-center gap-1 pl-1 pb-1" ref={pickerRef}>
              <button
                onClick={() => setShowPicker((v) => !v)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary",
                  showPicker && "bg-primary/10 text-primary"
                )}
                title="Attach file"
              >
                <IconPlus
                  size={22}
                  stroke={2.5}
                  className={cn(
                    "transition-transform duration-200",
                    showPicker && "rotate-45"
                  )}
                />
              </button>

              {/* File type picker dropdown */}
              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="
                      absolute
                      bottom-full
                      left-0
                      mb-2
                      z-50
                      w-[290px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-border/50
                      bg-card/95
                      shadow-2xl
                      backdrop-blur-xl"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => { imageInputRef.current?.click(); setShowPicker(false); }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-primary/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-purple-500/10 text-purple-500">
                          <IconPhoto size={16} stroke={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground/90">Photo</p>
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                            JPG, PNG, WEBP, GIF
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => { videoInputRef.current?.click(); setShowPicker(false); }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-primary/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-pink-500/10 text-pink-500">
                          <IconVideo size={16} stroke={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground/90">Video</p>
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                            MP4, WEBM, MOV
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => { audioInputRef.current?.click(); setShowPicker(false); }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-primary/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-orange-400/10 text-orange-400">
                          <IconMusic size={16} stroke={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground/90">Audio</p>
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                            MP3, WAV, OGG, M4A
                          </p>
                        </div>
                      </button>

                      <div className="my-1 mx-3 h-px bg-border/30" />

                      <button
                        onClick={() => docInputRef.current?.click()}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-primary/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-blue-500/10 text-blue-500">
                          <IconFileText size={16} stroke={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground/90">Document</p>
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                            PDF, DOC, XLS, PPT, TXT
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-primary/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-yellow-500/10 text-yellow-600">
                          <IconFile size={16} stroke={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground/90">File</p>
                          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                            ZIP, RAR, 7Z, others
                          </p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary">
                <IconMoodSmile size={22} stroke={2} />
              </button>

              {/* Hidden file inputs */}
              <input type="file" ref={imageInputRef} className="hidden" multiple accept={PHOTO_ACCEPT} onChange={handleFileInputChange} />
              <input type="file" ref={videoInputRef} className="hidden" multiple accept={VIDEO_ACCEPT} onChange={handleFileInputChange} />
              <input type="file" ref={audioInputRef} className="hidden" multiple accept={AUDIO_ACCEPT} onChange={handleFileInputChange} />
              <input type="file" ref={docInputRef} className="hidden" multiple accept={DOCUMENT_ACCEPT} onChange={handleFileInputChange} />
              <input type="file" ref={fileInputRef} className="hidden" multiple accept={FILE_ACCEPT} onChange={handleFileInputChange} />
            </div>

            {/* Voice Recorder UI or Textarea */}
            {isRecording ? (
              <div className="flex-1 px-2 py-2 flex items-center justify-between min-h-[24px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                  <span className="text-[14px] font-bold text-red-500">
                    {Math.floor(duration / 60).toString().padStart(2, "0")}:
                    {(duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelRecording}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-[11px] font-black uppercase tracking-widest"
                  >
                    <IconTrash size={14} stroke={2.5} />
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const file = await stopRecording();
                      if (file) {
                        await processFiles([file]);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest"
                  >
                    <IconPlayerStopFilled size={12} />
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 px-2 py-2">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    roomId
                      ? "Message in channel"
                      : `Message @${placeholderName}`
                  }
                  className="w-full resize-none bg-transparent text-[15px] font-medium leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none no-scrollbar min-h-[24px]"
                  rows={1}
                />
              </div>
            )}

            {/* Right Action (Send / Mic) */}
            <div className="pr-1 pb-1">
              <AnimatePresence mode="wait">
                {!canSend && text.trim().length === 0 && attachments.length === 0 ? (
                  <motion.button
                    key="mic"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={startRecording}
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
                    disabled={!canSend}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all",
                      canSend
                        ? "bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    title={
                      isUploading
                        ? "Waiting for uploads to finish…"
                        : hasErrors
                          ? "Fix upload errors before sending"
                          : "Send"
                    }
                  >
                    <IconSend size={18} stroke={2.5} className="translate-x-0.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 group cursor-help">
              <IconMarkdown
                size={14}
                className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                Markdown
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">
              Shift + Enter for new line
            </span>
          </div>

          <AnimatePresence>
            {(text.length > 0 || attachments.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                {isUploading ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                    Uploading…
                  </span>
                ) : hasErrors ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-destructive/60">
                    Fix errors above
                  </span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Press Enter to send
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
