import { useEffect, useRef } from "react";
import Message from "./Message";
import type { Message as MessageType } from "../types/message.types";
import { isSameDay, differenceInMinutes } from "date-fns";
import MessageDateDivider from "./MessageDateDivider";

interface MessageListProps {
  messages?: MessageType[];
}

export default function MessageList({ messages = [] }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col-reverse py-4">
      <div ref={bottomRef} />
      
      {messages.map((message, index) => {
        const nextMessage = messages[index + 1];
        const prevMessage = messages[index - 1];

        // Since we are flex-col-reverse and mapping through a newest-first array:
        // prevMessage is "newer" (lower in UI)
        // nextMessage is "older" (higher in UI)
        
        const isLastInGroup = !prevMessage || 
          prevMessage.senderId._id !== message.senderId._id ||
          differenceInMinutes(new Date(prevMessage.createdAt), new Date(message.createdAt)) > 5;

        const isFirstInGroup = !nextMessage || 
          nextMessage.senderId._id !== message.senderId._id ||
          differenceInMinutes(new Date(message.createdAt), new Date(nextMessage.createdAt)) > 5;

        // Date divider logic: show if the next message (older) is on a different day
        const showDateDivider = !nextMessage || !isSameDay(new Date(message.createdAt), new Date(nextMessage.createdAt));

        return (
          <div key={message._id}>
            <Message
              author={{
                name: message.senderId.name || "Unknown User",
                avatarUrl: message.senderId.avatarUrl,
              }}
              content={message.text}
              timestamp={new Date(message.createdAt)}
              isGroupStart={isFirstInGroup}
              isContinuation={!isFirstInGroup}
            />
            {showDateDivider && (
              <MessageDateDivider date={new Date(message.createdAt)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
