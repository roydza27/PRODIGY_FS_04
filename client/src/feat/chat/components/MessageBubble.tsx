import type { Message } from "../types/message.types";

interface Props {
  message: Message;
}

export default function MessageBubble({
  message,
}: Props) {
  return (
    <div className="mb-4">
      <div
        className="
          rounded-lg
          bg-muted
          px-4
          py-3
          max-w-xl
        "
      >
        {message.content}
      </div>
    </div>
  );
}