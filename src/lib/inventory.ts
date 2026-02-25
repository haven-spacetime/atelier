import { INVENTORY_STATUSES, type InventoryStatus } from "./constants";

/**
 * Get the index of a status in the inventory pipeline (0-based).
 * Returns -1 if the status is not recognized.
 */
export function getInventoryStatusIndex(status: string): number {
  return INVENTORY_STATUSES.indexOf(status as InventoryStatus);
}

/**
 * Get the next status in the inventory pipeline, or null if already at SOLD.
 */
export function getNextInventoryStatus(status: string): InventoryStatus | null {
  const idx = getInventoryStatusIndex(status);
  if (idx < 0 || idx >= INVENTORY_STATUSES.length - 1) return null;
  return INVENTORY_STATUSES[idx + 1];
}

/**
 * Calculate margin percentage: (ask - cost) / cost * 100.
 * Returns null if either value is null/undefined or cost is zero.
 */
export function calcMarginPercent(
  askingPrice: number | null | undefined,
  costBasis: number | null | undefined,
): number | null {
  if (askingPrice == null || costBasis == null || costBasis === 0) return null;
  return ((askingPrice - costBasis) / costBasis) * 100;
}

/**
 * Calculate profit: ask - cost.
 * Returns null if either value is null/undefined.
 */
export function calcProfit(
  askingPrice: number | null | undefined,
  costBasis: number | null | undefined,
): number | null {
  if (askingPrice == null || costBasis == null) return null;
  return askingPrice - costBasis;
}
