import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative my-10 flex items-center px-8"
    >
      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-border/50 to-border/50" />
      <div className="mx-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
        <span className="shrink-0 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-1">
          {getDateLabel(date)}
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
      </div>
      <div className="h-px flex-grow bg-gradient-to-l from-transparent via-border/50 to-border/50" />
    </motion.div>
  );
}
