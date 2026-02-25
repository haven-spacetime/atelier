"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_ORDER = [
  "INQUIRY",
  "QUOTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "QC",
  "COMPLETE",
  "INVOICED",
] as const;

type Status = (typeof STATUS_ORDER)[number];

const STATUS_LABELS: Record<Status, string> = {
  INQUIRY: "Inquiry",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  QC: "QC",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

interface StagePipelineProps {
  jobId: string;
  currentStatus: string;
}

export default function StagePipeline({ jobId, currentStatus }: StagePipelineProps) {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState(currentStatus);
  const [loading, setLoading] = useState<string | null>(null);

  const currentIdx = STATUS_ORDER.indexOf(activeStatus as Status);

  async function handleStageClick(status: Status) {
    if (status === activeStatus || loading) return;
    setLoading(status);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setActiveStatus(status);
        router.refresh();
      }
    } catch {
      // silently fail — UI stays on old status
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-[#141414] px-6 py-4">
      {/* Label */}
      <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-[#555555]">
        Job Stage
      </p>

      {/* Pipeline row */}
      <div className="relative flex items-center">
        {/* Connecting line behind dots */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-[#2A2A2A]"
          aria-hidden="true"
        />

        {STATUS_ORDER.map((status, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;
          const isLoading = loading === status;

          return (
            <button
              key={status}
              onClick={() => handleStageClick(status)}
              disabled={!!loading}
              className={[
                "relative z-10 flex flex-1 flex-col items-center gap-1.5 transition-opacity duration-150",
                loading && !isLoading ? "opacity-40" : "",
                isFuture && !loading ? "opacity-60 hover:opacity-100" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              title={`Move to ${STATUS_LABELS[status]}`}
            >
              {/* Dot */}
              <div
                className={[
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 transition-all duration-200",
                  isCurrent
                    ? "border-[#C4A265] bg-[#C4A265] scale-125"
                    : isPast
                      ? "border-[#4CAF50] bg-[#4CAF50]"
                      : "border-[#2A2A2A] bg-[#0A0A0A]",
                  isLoading ? "animate-pulse" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />

              {/* Label */}
              <span
                className={[
                  "text-[10px] font-medium leading-tight text-center whitespace-nowrap",
                  isCurrent
                    ? "text-[#C4A265] font-bold text-[11px]"
                    : isPast
                      ? "text-[#4CAF50]"
                      : "text-[#444444]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {STATUS_LABELS[status]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
