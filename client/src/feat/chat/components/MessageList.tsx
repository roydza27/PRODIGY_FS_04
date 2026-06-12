import { useEffect, useRef, useState, type UIEvent, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInMinutes, isSameDay } from "date-fns";
import { IconChevronDown } from "@tabler/icons-react";

import { useAuthStore } from "@/app/stores/auth.store";

import Message from "./Message";
import MessageDateDivider from "./MessageDateDivider";

import type { Message as MessageType } from "../types/message.types";

interface MessageListProps {
  messages?: MessageType[];
  isDM?: boolean;
  isTyping?: boolean; 
  typingUsers?: Array<{ _id: string; name: string; avatarUrl?: string }> | null;    
}

export default function MessageList({
  messages = [],
  isDM = false,
  isTyping = false,
  typingUsers = [], 
}: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const prevMessageCountRef = useRef(messages.length);

  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id;

  // ==========================================================================
  // SCROLL LOGIC
  // ==========================================================================
  const performScroll = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior });
    }
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    performScroll(behavior);
    setUnreadCount(0);
    setShowScrollButton(false);
  }, [performScroll]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if user is scrolled up more than 150px from the bottom
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollButton(isScrolledUp);

    // If user manually scrolls to the bottom, clear the unread badge
    if (!isScrolledUp && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  // Initial load auto-scroll
  useEffect(() => {
    performScroll("auto");
  }, [performScroll]);

  // Handle incoming messages
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      const newMessagesCount = messages.length - prevMessageCountRef.current;
      const latestMessage = messages[messages.length - 1];
      
      const senderId =
        typeof latestMessage.senderId === "string"
          ? latestMessage.senderId
          : latestMessage.senderId?._id;

      const isMyMessage = senderId === currentUserId;

      if (showScrollButton && !isMyMessage) {
        // If scrolled up and someone else sent a message, just increment badge
        setUnreadCount((prev) => prev + newMessagesCount);
      } else {
        // Force scroll to bottom if we are already at the bottom OR I sent the message
        scrollToBottom("smooth");
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, showScrollButton, currentUserId, scrollToBottom]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar"
      >
        <div className="flex min-h-full flex-col justify-end">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];

              const senderId =
                typeof message.senderId === "string"
                  ? message.senderId
                  : message.senderId?._id;

              const previousSenderId =
                typeof previousMessage?.senderId === "string"
                  ? previousMessage.senderId
                  : previousMessage?.senderId?._id;

              const isGroupStart =
                !previousMessage ||
                previousSenderId !== senderId ||
                differenceInMinutes(
                  new Date(message.createdAt),
                  new Date(previousMessage.createdAt)
                ) > 5;

              const showDateDivider =
                !previousMessage ||
                !isSameDay(
                  new Date(message.createdAt),
                  new Date(previousMessage.createdAt)
                );

              const author =
                typeof message.senderId === "object"
                  ? {
                      _id: message.senderId._id,
                      name: message.senderId.name ?? "Unknown User",
                      username: (message.senderId as Record<string, string>).username,
                      avatarUrl: message.senderId.avatarUrl,
                    }
                  : {
                      _id: message.senderId,
                      name: "Unknown User",
                    };

              const isCurrentUser = senderId === currentUserId;

              return (
                <motion.div 
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showDateDivider && (
                    <MessageDateDivider
                      date={new Date(message.createdAt)}
                    />
                  )}

                  <Message
                    id={message._id}
                    author={author}
                    content={message.text}
                    timestamp={new Date(message.createdAt)}
                    isGroupStart={isGroupStart}
                    isContinuation={!isGroupStart}
                    isDM={isDM}
                    isCurrentUser={isCurrentUser}
                    status={message.status}
                    isEdited={message.isEdited}
                    isDeleted={message.isDeleted}
                    attachments={message.attachments}
                    roomId={message.roomId}
                    conversationId={message.conversationId}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && typingUsers && typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className="flex w-full mt-2 mb-4"
              >
                <div className="flex items-end gap-3 px-4">
                  {!isDM && (
                    <div className="flex -space-x-3 mb-0.5">
                      {typingUsers.slice(0, 3).map((user) => (
                        <div key={user._id} className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border-2 border-background shadow-sm">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="typing" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-black text-foreground">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex h-[36px] items-center rounded-2xl rounded-bl-sm bg-muted/30 px-3.5 shadow-sm border border-border/10 w-fit">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="h-1.5 w-1.5 rounded-full bg-foreground" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                      {typingUsers.length === 1 
                        ? `${typingUsers[0].name} is typing...`
                        : typingUsers.length === 2
                        ? `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
                        : `${typingUsers.length} people are typing...`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={scrollAnchorRef} className="h-4 w-full" />
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-4 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#202c33] text-[#8696a0] shadow-xl border border-white/5 transition-colors hover:bg-[#2a3942] hover:text-[#d1d7db] active:scale-95"
          >
            <IconChevronDown size={22} stroke={2.5} className="mt-0.5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-background shadow-sm"
                >
                  {unreadCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
