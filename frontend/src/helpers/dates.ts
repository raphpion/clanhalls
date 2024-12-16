import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatDateToLocal(
  dateString: string | undefined,
  includeTime = false,
) {
  if (!dateString) return undefined;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(parseISO(dateString), timeZone);

  const formatStr = includeTime ? 'MMMM d yyyy, h:mm a' : 'MMMM d yyyy';

  return format(zonedDate, formatStr);
}
