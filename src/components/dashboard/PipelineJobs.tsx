"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getJobStatusBadgeClass } from "@/lib/constants";
import { formatStatus } from "@/lib/format";
import { getStatusIndex } from "@/lib/jobs";

interface PipelineJob {
  id: string;
  title: string;
  status: string;
  quotedPrice: number | null;
  customer: { name: string };
  vehicle: { year: number; make: string; model: string };
}

type SortKey = "status" | "price";
type SortDir = "asc" | "desc";

export default function PipelineJobs({ jobs }: { jobs: PipelineJob[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "price" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    const arr = [...jobs];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "status") {
        cmp = getStatusIndex(a.status) - getStatusIndex(b.status);
      } else {
        cmp = (a.quotedPrice ?? 0) - (b.quotedPrice ?? 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [jobs, sortKey, sortDir]);

  if (jobs.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-[#888888] text-sm">
        No active jobs in the pipeline. All caught up!
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-[#1A1A1A]">
          <th className="px-6 py-3 text-left text-xs uppercase text-[#888888] tracking-wide font-medium">
            Job Title
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase text-[#888888] tracking-wide font-medium">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase text-[#888888] tracking-wide font-medium">
            Vehicle
          </th>
          <SortableHeader
            label="Status"
            col="status"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <SortableHeader
            label="Price"
            col="price"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            align="right"
          />
        </tr>
      </thead>
      <tbody>
        {sorted.map((job) => (
          <tr
            key={job.id}
            className="border-t border-[#2A2A2A] transition-colors duration-150 hover:bg-[#1A1A1A] cursor-pointer"
          >
            <td className="px-6 py-4 text-sm text-[#F5F5F5]">
              <Link
                href={`/jobs/${job.id}`}
                className="hover:text-[#C4A265] transition-colors stretched-link"
              >
                {job.title}
              </Link>
            </td>
            <td className="px-6 py-4 text-sm text-[#888888]">{job.customer.name}</td>
            <td className="px-6 py-4 text-sm text-[#888888]">
              {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
            </td>
            <td className="px-6 py-4">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getJobStatusBadgeClass(job.status)}`}
              >
                {formatStatus(job.status)}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-right text-[#F5F5F5]">
              {job.quotedPrice != null ? formatCurrency(job.quotedPrice) : "--"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SortableHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === col;
  return (
    <th
      className={`px-6 py-3 text-xs uppercase tracking-wide font-medium cursor-pointer select-none whitespace-nowrap transition-colors duration-150 hover:text-[#C4A265] ${
        active ? "text-[#C4A265]" : "text-[#888888]"
      } ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : (
          <ChevronDown size={12} className="text-[#444]" />
        )}
      </span>
    </th>
  );
}
