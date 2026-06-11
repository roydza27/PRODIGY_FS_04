import { formatDistanceToNow, isYesterday, format, isToday } from "date-fns";

/**
 * Formats a "last seen" date into a human-readable string.
 */
export const formatLastSeen = (date?: string | Date): string => {
  if (!date) return "Offline";

  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return "Offline";

  if (isToday(d)) {
    return `Last seen ${formatDistanceToNow(d, { addSuffix: true })}`;
  }

  if (isYesterday(d)) {
    return `Last seen yesterday at ${format(d, "HH:mm")}`;
  }

  return `Last seen on ${format(d, "MMM d, yyyy")}`;
};
