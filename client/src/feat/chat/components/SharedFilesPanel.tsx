import { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconFile,
  IconDownload,
  IconFolder,
  IconLoader2,
  IconPhoto,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { cn, getAssetUrl } from "@/lib/utils";
import {
  useRoomSharedFiles,
  useConversationSharedFiles,
} from "../hooks/useSharedFiles";
import type { IAttachment, Message } from "../types/message.types";
import MediaLightbox from "./MediaLightbox";

interface SharedFilesPanelProps {
  open: boolean;
  onClose: () => void;
  roomId?: string;
  conversationId?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatGroupDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}

function getAccent(mimeType: string = "") {
  if (mimeType === "application/pdf")
    return { color: "text-red-500", bg: "bg-red-500/10", label: "PDF" };
  if (
    mimeType === "application/msword" ||
    mimeType.includes("wordprocessingml")
  )
    return { color: "text-blue-500", bg: "bg-blue-500/10", label: "DOC" };
  if (mimeType === "application/vnd.ms-excel" || mimeType.includes("spreadsheetml"))
    return { color: "text-green-500", bg: "bg-green-500/10", label: "XLS" };
  if (mimeType === "application/vnd.ms-powerpoint" || mimeType.includes("presentationml"))
    return { color: "text-orange-500", bg: "bg-orange-500/10", label: "PPT" };
  if (
    mimeType === "application/zip" ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("x-zip")
  )
    return { color: "text-yellow-600", bg: "bg-yellow-500/10", label: "ZIP" };
  if (mimeType === "text/plain")
    return { color: "text-muted-foreground", bg: "bg-muted/40", label: "TXT" };
  return { color: "text-primary", bg: "bg-primary/10", label: "FILE" };
}

function formatSize(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

// Group messages by date and flatten into attachment rows
interface AttachmentRow {
  attachment: IAttachment;
  message: Message;
  dateGroup: string;
}

function buildRows(messages: Message[]): AttachmentRow[] {
  const rows: AttachmentRow[] = [];
  for (const msg of messages) {
    if (!msg.attachments?.length) continue;
    const dateGroup = formatGroupDate(msg.createdAt);
    for (const att of msg.attachments) {
      rows.push({
        attachment: {
          ...att,
          url: getAssetUrl(att.url),
        },
        message: msg,
        dateGroup,
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SharedFilesPanel({
  open,
  onClose,
  roomId,
  conversationId,
}: SharedFilesPanelProps) {
  const {
    data: roomFiles,
    isLoading: roomLoading,
  } = useRoomSharedFiles(open && roomId ? roomId : undefined);

  const {
    data: dmFiles,
    isLoading: dmLoading,
  } = useConversationSharedFiles(
    open && conversationId ? conversationId : undefined
  );

  const [activeTab, setActiveTab] = useState<"media" | "files">("media");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const messages = roomId ? (roomFiles ?? []) : (dmFiles ?? []);
  const isLoading = roomId ? roomLoading : dmLoading;
  const rows = buildRows(messages);

  const mediaRows = rows.filter(({ attachment }) => {
    const mime = attachment.mimeType ?? "";
    return attachment.type === "IMAGE" || attachment.type === "VIDEO" || mime.startsWith("image/") || mime.startsWith("video/");
  });

  const fileRows = rows.filter(({ attachment }) => {
    const mime = attachment.mimeType ?? "";
    return attachment.type !== "IMAGE" && attachment.type !== "VIDEO" && !mime.startsWith("image/") && !mime.startsWith("video/");
  });

  const imagesOnly = mediaRows
    .map((r) => r.attachment)
    .filter((a) => a.type === "IMAGE" || a.mimeType?.startsWith("image/"));

  const handleImageClick = (att: IAttachment) => {
    const idx = imagesOnly.findIndex((img) => img.url === att.url);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  // Group by date label (for Files tab)
  const groups = fileRows.reduce<Record<string, AttachmentRow[]>>((acc, row) => {
    if (!acc[row.dateGroup]) acc[row.dateGroup] = [];
    acc[row.dateGroup].push(row);
    return acc;
  }, {});


  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30 bg-background/20 backdrop-blur-[1px] lg:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 z-40 flex h-full w-[320px] flex-col border-l border-border/40 bg-background/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconFolder size={16} stroke={2} />
                </div>
                <div>
                  <p className="text-[14px] font-black text-foreground/90">Shared Files</p>
                  {!isLoading && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                      {rows.length} {rows.length === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              >
                <IconX size={16} stroke={2.5} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/30 px-3">
              <button
                onClick={() => setActiveTab("media")}
                className={cn(
                  "flex-1 py-3 text-center text-[12px] font-black uppercase tracking-widest transition-colors relative",
                  activeTab === "media" ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                Media
                {activeTab === "media" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={cn(
                  "flex-1 py-3 text-center text-[12px] font-black uppercase tracking-widest transition-colors relative",
                  activeTab === "files" ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                Files
                {activeTab === "files" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/40">
                  <IconLoader2 size={28} className="animate-spin" />
                  <p className="text-[11px] font-black uppercase tracking-widest">
                    Loading items…
                  </p>
                </div>
              ) : activeTab === "media" ? (
                mediaRows.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground/30">
                      <IconPhoto size={32} stroke={1.5} />
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-foreground/40">
                        No media yet
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground/30">
                        Shared photos and videos will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {mediaRows.map(({ attachment, message }, idx) => {
                      const isVideo = attachment.type === "VIDEO" || attachment.mimeType?.startsWith("video/");
                      return (
                        <motion.div
                          key={`${message._id}-${idx}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted/20 border border-border/10"
                          onClick={() => {
                            if (!isVideo) {
                              handleImageClick(attachment);
                            } else {
                              window.open(attachment.url, "_blank");
                            }
                          }}
                        >
                          {isVideo ? (
                            <div className="relative h-full w-full">
                              <video
                                src={attachment.url}
                                className="h-full w-full object-cover"
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <IconPlayerPlay size={16} className="text-white fill-white/20" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          )}
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="w-full truncate text-[9px] font-bold text-white leading-none">
                              {attachment.filename}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : fileRows.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground/30">
                    <IconFile size={32} stroke={1.5} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-foreground/40">
                      No files yet
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground/30">
                      Shared documents and files will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  {Object.entries(groups).map(([dateLabel, groupRows]) => (
                    <div key={dateLabel}>
                      {/* Date group header */}
                      <div className="sticky top-0 z-10 bg-background/90 px-5 py-2 backdrop-blur-sm">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                          {dateLabel}
                        </p>
                      </div>

                      {/* File rows */}
                      <div className="px-3 pb-2">
                        {groupRows.map(({ attachment, message }, rowIdx) => {
                          const accent = getAccent(attachment.mimeType);
                          const senderName =
                            typeof message.senderId === "object"
                              ? message.senderId.name
                              : "Unknown";

                          return (
                            <motion.div
                              key={`${message._id}-${rowIdx}`}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: rowIdx * 0.03 }}
                              className={cn(
                                "group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all",
                                "hover:border-border/30 hover:bg-muted/30"
                              )}
                            >
                              {/* Icon */}
                              <div
                                className={cn(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                  accent.bg,
                                  accent.color
                                )}
                              >
                                <IconFile size={18} stroke={2} />
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-bold text-foreground/90">
                                  {attachment.filename}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    {accent.label}
                                  </span>
                                  <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                                  <span className="text-[9px] font-bold text-muted-foreground/30">
                                    {formatSize(attachment.filesize)}
                                  </span>
                                  <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                                  <span className="truncate text-[9px] font-bold text-muted-foreground/30">
                                    {senderName}
                                  </span>
                                </div>
                              </div>

                              {/* Download */}
                              <a
                                href={attachment.url}
                                download={attachment.filename}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                title={`Download ${attachment.filename}`}
                              >
                                <IconDownload size={14} stroke={2} />
                              </a>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>

          {/* Media Lightbox */}
          {lightboxIndex !== null && (
            <MediaLightbox
              images={imagesOnly}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
