/**
 * Replace underscores with spaces for display.
 * e.g. "IN_PROGRESS" → "IN PROGRESS"
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

/**
 * Safely parse a JSON string that is expected to be an array.
 * Returns [] on invalid JSON or non-array values.
 */
export function parseJsonArray<T = string>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
