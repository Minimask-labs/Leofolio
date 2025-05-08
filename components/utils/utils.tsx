import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, "hh:mm a")}`; 
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "hh:mm a")}`; 
  }

  const daysAgo = formatDistanceToNow(date, { addSuffix: true });
  return daysAgo;
}
