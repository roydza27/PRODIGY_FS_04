export default function EmptyRoomState() {
  return (
    <div className="px-2 py-4 text-center rounded-lg bg-white/[0.02] border border-dashed border-white/5 mx-2">
      <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed">
        No channels yet.<br />
        Create one to start chatting.
      </p>
    </div>
  );
}