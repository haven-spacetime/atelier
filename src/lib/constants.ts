// ── Job Statuses ──────────────────────────────────────────────────────────────

export const JOB_STATUSES = [
  "INQUIRY",
  "QUOTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "QC",
  "COMPLETE",
  "INVOICED",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<string, string> = {
  INQUIRY: "Inquiry",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  QC: "Quality Check",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

export const JOB_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  INQUIRY: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
  QUOTED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  SCHEDULED: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  QC: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  COMPLETE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  INVOICED: { bg: "bg-[#C4A265]/10", text: "text-[#C4A265]", dot: "bg-[#C4A265]" },
};

// Dashboard uses a simpler color scheme (bg + text only, no dot)
export function getJobStatusBadgeClass(status: string): string {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-[#C4A265]/15 text-[#C4A265]";
    case "QC":
      return "bg-[#FF9800]/15 text-[#FF9800]";
    case "COMPLETE":
    case "INVOICED":
      return "bg-[#4CAF50]/15 text-[#4CAF50]";
    case "SCHEDULED":
      return "bg-[#2196F3]/15 text-[#2196F3]";
    case "QUOTED":
      return "bg-[#9C27B0]/15 text-[#9C27B0]";
    case "INQUIRY":
    default:
      return "bg-[#888888]/15 text-[#888888]";
  }
}

// ── Job Types ─────────────────────────────────────────────────────────────────

export const JOB_TYPES = ["WRAP", "PPF", "CERAMIC", "TINT", "CUSTOM", "DEALERSHIP"] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const JOB_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  WRAP: { bg: "bg-purple-500/10", text: "text-purple-400" },
  PPF: { bg: "bg-blue-500/10", text: "text-blue-400" },
  CERAMIC: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  TINT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  CUSTOM: { bg: "bg-pink-500/10", text: "text-pink-400" },
  DEALERSHIP: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

// Schedule page uses a slightly different type color scheme (with border)
export const SCHEDULE_TYPE_COLORS: Record<string, string> = {
  WRAP: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PPF: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CERAMIC: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  TINT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  CUSTOM: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  DEALERSHIP: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

// ── Invoice Statuses ──────────────────────────────────────────────────────────

export const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]",
  SENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  OVERDUE: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ── Inventory Statuses ────────────────────────────────────────────────────────

export const INVENTORY_STATUSES = ["AVAILABLE", "PENDING", "SOLD"] as const;

export type InventoryStatus = (typeof INVENTORY_STATUSES)[number];

export const INVENTORY_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  SOLD: "bg-[#1E1E1E] text-[#666666] border-[#2A2A2A]",
};

// ── Marketing Statuses ────────────────────────────────────────────────────────

export const MARKETING_STATUSES = ["DRAFT", "SCHEDULED", "SENT"] as const;

export type MarketingStatus = (typeof MARKETING_STATUSES)[number];

export const MARKETING_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]",
  SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SENT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};
