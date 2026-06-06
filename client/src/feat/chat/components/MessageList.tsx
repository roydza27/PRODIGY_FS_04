import { useEffect, useRef } from "react";
import {
  differenceInMinutes,
  isSameDay,
} from "date-fns";

import { useAuthStore } from "@/app/stores/auth.store";

import Message from "./Message";
import MessageDateDivider from "./MessageDateDivider";

import type { Message as MessageType } from "../types/message.types";

interface MessageListProps {
  messages?: MessageType[];
  isDM?: boolean;
}

export default function MessageList({
  messages = [],
  isDM = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  /**
   * Always scroll to the latest message.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages]);

  return (
    <div className="flex min-h-full flex-col px-2 py-4">
      {messages.map((message, index) => {
        const previousMessage =
          messages[index - 1];

        const senderId =
          typeof message.senderId === "string"
            ? message.senderId
            : message.senderId?._id;

        const previousSenderId =
          typeof previousMessage?.senderId ===
          "string"
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
                name:
                  message.senderId.name ??
                  "Unknown User",
                username: (message.senderId as any)
                  .username,
                avatarUrl:
                  message.senderId.avatarUrl,
              }
            : {
                _id: message.senderId,
                name: "Unknown User",
              };

        const isCurrentUser = senderId === currentUserId;

        return (
          <div key={message._id}>
            {showDateDivider && (
              <MessageDateDivider
                date={
                  new Date(message.createdAt)
                }
              />
            )}

            <Message
              author={author}
              content={message.text}
              timestamp={
                new Date(message.createdAt)
              }
              isGroupStart={isGroupStart}
              isContinuation={!isGroupStart}
              isDM={isDM}
              isCurrentUser={isCurrentUser}
            />
          </div>
        );
      })}

      <div
        ref={bottomRef}
        className="h-1 w-full"
      />
    </div>
  );
}