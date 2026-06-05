export default function WorkspaceCards() {
  return (
    <div className="relative h-[500px]">
      <WorkspaceCard
        className="absolute left-0 top-12 rotate-[-6deg]"
        title="Development Team"
        members="18 Members"
        rooms="12 Rooms"
        emoji="🚀"
      />

      <WorkspaceCard
        className="absolute right-0 top-0 rotate-[5deg]"
        title="Design Team"
        members="9 Members"
        rooms="5 Rooms"
        emoji="🎨"
      />

      <WorkspaceCard
        className="absolute bottom-0 left-20"
        title="Marketing Team"
        members="14 Members"
        rooms="8 Rooms"
        emoji="📈"
      />
    </div>
  );
}

function WorkspaceCard({
  title,
  members,
  rooms,
  emoji,
  className,
}: {
  title: string;
  members: string;
  rooms: string;
  emoji: string;
  className?: string;
}) {
  return (
    <div
      className={`
      w-72
      rounded-3xl
      border
      border-white/10
      bg-[#18181B]
      p-6
      shadow-2xl
      ${className}
    `}
    >
      <div className="mb-4 text-4xl">
        {emoji}
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-zinc-400">
          <span>Members</span>
          <span>{members}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Rooms</span>
          <span>{rooms}</span>
        </div>
      </div>
    </div>
  );
}