import ChatPreview from "./ChatPreview"

export default function RealtimeSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Real-Time Messaging
          </div>

          <h2 className="mb-6 text-5xl font-bold text-white">
            Communication that feels instant.
          </h2>

          <p className="text-lg text-zinc-400">
            Built on modern real-time architecture
            so messages appear instantly across
            your workspace.
          </p>
        </div>

        <ChatPreview />
      </div>
    </section>
  );
}