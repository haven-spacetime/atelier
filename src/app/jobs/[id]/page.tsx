import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Phone,
  Calendar,
  Clock,
  Warehouse,
  FileText,
  ChevronRight,
  User,
  CheckCircle,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import StagePipeline from "@/components/jobs/StagePipeline";

// ── Status config ─────────────────────────────────

const STATUS_ORDER = [
  "INQUIRY",
  "QUOTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "QC",
  "COMPLETE",
  "INVOICED",
] as const;

const STATUS_LABELS: Record<string, string> = {
  INQUIRY: "Inquiry",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  QC: "Quality Check",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  INQUIRY: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
  QUOTED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  SCHEDULED: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  QC: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  COMPLETE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  INVOICED: { bg: "bg-[#C4A265]/10", text: "text-[#C4A265]", dot: "bg-[#C4A265]" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  WRAP: { bg: "bg-purple-500/10", text: "text-purple-400" },
  PPF: { bg: "bg-blue-500/10", text: "text-blue-400" },
  CERAMIC: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  TINT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  CUSTOM: { bg: "bg-pink-500/10", text: "text-pink-400" },
  DEALERSHIP: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

// ── Page ──────────────────────────────────────────

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
    },
  });

  if (!job) return notFound();

  const statusColor = STATUS_COLORS[job.status] ?? STATUS_COLORS.INQUIRY;
  const typeColor = TYPE_COLORS[job.type] ?? { bg: "bg-[#1E1E1E]", text: "text-[#888888]" };

  const photos: string[] = (() => {
    try {
      return JSON.parse(job.photos);
    } catch {
      return [];
    }
  })();

  // Find next status for advance button
  const currentIdx = STATUS_ORDER.indexOf(job.status as (typeof STATUS_ORDER)[number]);
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;

  return (
    <>
      <Header title={job.title} />
      <div className="p-6">
        {/* Back link + status badge */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#F5F5F5]"
          >
            <ArrowLeft size={16} />
            View All Jobs
          </Link>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusColor.dot}`} />
            {STATUS_LABELS[job.status] ?? job.status}
          </div>
        </div>

        {/* Stage Pipeline */}
        <StagePipeline jobId={job.id} currentStatus={job.status} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Left: Main content (2 cols) ── */}
          <div className="space-y-6 lg:col-span-2">
            {/* Job Details Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
              <h2 className="mb-4 text-lg font-medium text-[#F5F5F5]">
                Job Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Type */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Type
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor.bg} ${typeColor.text}`}
                    >
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Bay Number */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Bay Number
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Warehouse size={14} className="text-[#888888]" />
                    {job.bayNumber != null ? `Bay ${job.bayNumber}` : "Unassigned"}
                  </p>
                </div>

                {/* Scheduled Date */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Scheduled Date
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Calendar size={14} className="text-[#888888]" />
                    {job.scheduledDate
                      ? formatDate(job.scheduledDate)
                      : "Not scheduled"}
                  </p>
                </div>

                {/* Estimated Hours */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Estimated Hours
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Clock size={14} className="text-[#888888]" />
                    {job.estimatedHours != null
                      ? `${job.estimatedHours}h`
                      : "Not estimated"}
                  </p>
                </div>

                {/* Actual Hours */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Actual Hours
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Clock size={14} className="text-[#888888]" />
                    {job.actualHours != null
                      ? `${job.actualHours}h`
                      : "Not tracked"}
                  </p>
                </div>

                {/* Assigned To */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Assigned To
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <User size={14} className="text-[#888888]" />
                    {job.assignedTo ?? "Unassigned"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <div className="mt-5 border-t border-[#2A2A2A] pt-4">
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Description
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#CCCCCC]">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Material Notes */}
              {job.materialNotes && (
                <div className="mt-4 border-t border-[#2A2A2A] pt-4">
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Material Notes
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#CCCCCC]">
                    {job.materialNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Photos Section */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
              <h2 className="mb-4 text-lg font-medium text-[#F5F5F5]">
                Photos
              </h2>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Job photo ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex aspect-square items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"
                    >
                      <Camera size={24} className="text-[#555555]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Sidebar (1 col) ── */}
          <div className="space-y-6">
            {/* Customer Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Customer
              </h3>
              <p className="text-sm font-medium text-[#F5F5F5]">
                {job.customer.name}
              </p>
              {job.customer.phone && (
                <a
                  href={`tel:${job.customer.phone}`}
                  className="mt-2 flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#C4A265]"
                >
                  <Phone size={13} />
                  {job.customer.phone}
                </a>
              )}
              <Link
                href={`/customers/${job.customer.id}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-[#C4A265] transition-colors duration-200 hover:bg-[#222222] hover:border-[#C4A265]/40"
              >
                <ExternalLink size={11} />
                View Customer
              </Link>
            </div>

            {/* Vehicle Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Vehicle
              </h3>
              <p className="text-sm font-medium text-[#F5F5F5]">
                {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
              </p>
              <p className="mt-1 text-sm text-[#888888]">{job.vehicle.color}</p>
              {job.vehicle.vin && (
                <p className="mt-1 font-mono text-xs text-[#555555]">{job.vehicle.vin}</p>
              )}
            </div>

            {/* Pricing Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Pricing
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Quoted Price</span>
                  <span className="text-sm font-medium text-[#C4A265]">
                    {job.quotedPrice != null
                      ? formatCurrency(job.quotedPrice)
                      : "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Deposit</span>
                  <span className="text-sm text-[#F5F5F5]">
                    {job.depositAmount != null
                      ? formatCurrency(job.depositAmount)
                      : "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Deposit Status</span>
                  {job.depositPaid ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <CheckCircle size={12} />
                      Paid
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#888888]">
                      Unpaid
                    </span>
                  )}
                </div>
                <div className="border-t border-[#2A2A2A] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      Final Price
                    </span>
                    <span className="text-base font-semibold text-[#C4A265]">
                      {job.finalPrice != null
                        ? formatCurrency(job.finalPrice)
                        : "--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Pipeline
              </h3>

              <div className="space-y-2">
                {STATUS_ORDER.map((s, i) => {
                  const isCompleted = i < currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isCurrent
                              ? `${statusColor.bg} ${statusColor.text}`
                              : "bg-[#1E1E1E] text-[#555555]"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={12} />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          isCurrent
                            ? "font-medium text-[#F5F5F5]"
                            : isCompleted
                              ? "text-[#888888]"
                              : "text-[#555555]"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Next stage hint */}
              {nextStatus && (
                <p className="mt-4 text-xs text-[#555555]">
                  Use the pipeline bar above to advance the stage.
                </p>
              )}

              {!nextStatus && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
                  <CheckCircle size={16} />
                  Job Complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
