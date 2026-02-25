export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/**
 * Return Monday 00:00 and Sunday 23:59:59.999 for the week containing `anchor`.
 * Week starts on Monday (ISO standard).
 */
export function getWeekBounds(anchor: Date): { monday: Date; sunday: Date } {
  const day = anchor.getDay(); // 0=Sun … 6=Sat
  const diffToMon = day === 0 ? -6 : 1 - day;

  const monday = new Date(anchor);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + diffToMon);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

/**
 * Bucket items by day-of-week index where 0=Mon and 6=Sun.
 * Items without a scheduledDate are skipped.
 */
export function bucketByDayOfWeek<T extends { scheduledDate: Date | string | null }>(
  items: T[],
): T[][] {
  const buckets: T[][] = Array.from({ length: 7 }, () => []);

  for (const item of items) {
    if (item.scheduledDate) {
      const d = new Date(item.scheduledDate);
      const dow = d.getDay(); // 0=Sun
      const idx = dow === 0 ? 6 : dow - 1; // remap to 0=Mon
      buckets[idx].push(item);
    }
  }

  return buckets;
}
