import { format, isToday, isYesterday } from "date-fns";

interface Props {
  date: Date;
}

export default function MessageDateDivider({ date }: Props) {
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="relative my-6 flex items-center px-6">
      <div className="flex-grow border-t border-border/40"></div>
      <span className="mx-4 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-background px-2">
        {getDateLabel(date)}
      </span>
      <div className="flex-grow border-t border-border/40"></div>
    </div>
  );
}
