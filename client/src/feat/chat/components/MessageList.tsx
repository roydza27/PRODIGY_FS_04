import { useEffect, useRef } from "react";
import {
  isSameDay,
  differenceInMinutes,
} from "date-fns";

import Message from "./Message";
import MessageDateDivider from "./MessageDateDivider";

import type { Message as MessageType } from "../types/message.types";

interface MessageListProps {
  messages?: MessageType[];
}

export default function MessageList({
  messages = [],
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

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

        const nextMessage =
          messages[index + 1];

        const isGroupStart =
          !previousMessage ||
          previousMessage.senderId._id !==
            message.senderId._id ||
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
              author={{
                name:
                  message.senderId.name ??
                  "Unknown User",
                avatarUrl:
                  message.senderId.avatarUrl,
              }}
              content={message.text}
              timestamp={
                new Date(message.createdAt)
              }
              isGroupStart={isGroupStart}
              isContinuation={!isGroupStart}
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