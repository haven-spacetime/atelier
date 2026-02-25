import { JOB_STATUSES, type JobStatus } from "./constants";

/**
 * Get the index of a status in the pipeline (0-based).
 * Returns -1 if the status is not recognized.
 */
export function getStatusIndex(status: string): number {
  return JOB_STATUSES.indexOf(status as JobStatus);
}

/**
 * Get the next status in the pipeline, or null if already at the terminal state.
 */
export function getNextStatus(status: string): JobStatus | null {
  const idx = getStatusIndex(status);
  if (idx < 0 || idx >= JOB_STATUSES.length - 1) return null;
  return JOB_STATUSES[idx + 1];
}

/**
 * Whether the job is currently being worked on (IN_PROGRESS or QC).
 */
export function isActiveStatus(status: string): boolean {
  return status === "IN_PROGRESS" || status === "QC";
}

/**
 * Whether the job is in the pipeline (not yet scheduled for work).
 * INQUIRY and QUOTED are pipeline statuses.
 */
export function isPipelineStatus(status: string): boolean {
  return status === "INQUIRY" || status === "QUOTED";
}
