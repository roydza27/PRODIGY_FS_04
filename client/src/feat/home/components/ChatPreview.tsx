export default function ChatPreview() {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#18181B] p-8 shadow-2xl">
      <div className="space-y-8">
        <ChatMessage
          name="Royal"
          message="Workspace APIs are completed."
        />

        <ChatMessage
          name="Sarah"
          message="Frontend integration started 🚀"
        />

        <ChatMessage
          name="Alex"
          message="Looks good. Ready for testing."
        />

        <div className="flex items-center gap-2 text-violet-400">
          <div className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />

          Royal is typing...
        </div>
      </div>
    </div>
  );
}

function ChatMessage({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="h-12 w-12 rounded-full bg-violet-500/20" />

      <div>
        <div className="font-medium text-white">
          {name}
        </div>

        <div className="text-zinc-400">
          {message}
        </div>
      </div>
    </div>
  );
}