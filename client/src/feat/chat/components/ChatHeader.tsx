import { 
  IconHash, 
  IconUsers, 
  IconSearch, 
  IconBell, 
  IconPinned, 
  IconInfoCircle,
  IconChevronDown,
  IconAt
} from "@tabler/icons-react";

interface Props {
  roomName: string;
  isDM?: boolean;
}

export default function ChatHeader({
  roomName,
  isDM = false,
}: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1 font-bold text-foreground">
          {isDM ? (
            <IconAt size={20} className="text-muted-foreground" />
          ) : (
            <IconHash size={20} className="text-muted-foreground" />
          )}
          <h2 className="truncate text-base tracking-tight">{roomName}</h2>
          <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-muted transition-colors">
            <IconChevronDown size={14} className="text-muted-foreground" />
          </button>
        </div>
        
        {!isDM && (
          <>
            <div className="mx-1 h-4 w-[1px] bg-border" />
            <div className="hidden items-center gap-1 text-[13px] font-medium text-muted-foreground md:flex">
              <IconUsers size={14} />
              <span>12</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <HeaderAction icon={<IconSearch size={19} />} label="Search" />
        <HeaderAction icon={<IconPinned size={19} />} label="Pinned" />
        <HeaderAction icon={<IconBell size={19} />} label="Notifications" />
        <HeaderAction icon={<IconInfoCircle size={19} />} label="Details" />
      </div>
    </header>
  );
}

function HeaderAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button 
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
    >
      {icon}
    </button>
  );
}
