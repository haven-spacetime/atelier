"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wrench, Filter, User, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";

// ── Types ──────────────────────────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
}

interface Job {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string | null;
  assignedTo: string | null;
  quotedPrice: number | null;
  finalPrice: number | null;
  scheduledDate: string | null;
  customer: Customer;
  vehicle: Vehicle;
}

// ── Constants ──────────────────────────────────────

const STATUS_COLUMNS = [
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
  QC: "QC",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

const JOB_TYPES = [
  "WRAP",
  "PPF",
  "CERAMIC",
  "TINT",
  "CUSTOM",
  "DEALERSHIP",
] as const;

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  WRAP: { bg: "bg-purple-500/10", text: "text-purple-400" },
  PPF: { bg: "bg-blue-500/10", text: "text-blue-400" },
  CERAMIC: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  TINT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  CUSTOM: { bg: "bg-pink-500/10", text: "text-pink-400" },
  DEALERSHIP: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

// ── Component ──────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered =
    filterType === "ALL" ? jobs : jobs.filter((j) => j.type === filterType);

  const columnJobs = (status: string) =>
    filtered.filter((j) => j.status === status);

  return (
    <>
      <Header title="Jobs" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-3">
            {/* Filter by type */}
            <div className="relative flex items-center">
              <Filter
                size={14}
                className="pointer-events-none absolute left-3 text-[#888888]"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-9 appearance-none rounded border border-[#2A2A2A] bg-[#141414] pl-9 pr-8 text-sm text-[#F5F5F5] outline-none transition-colors duration-200 focus:border-[#C4A265]"
              >
                <option value="ALL">All Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* New Job button */}
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
            >
              <Plus size={16} />
              New Job
            </Link>
          </div>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-sm text-[#888888]">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#141414]">
              <Wrench size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">No jobs yet</h2>
            <p className="mt-1 text-sm text-[#888888]">
              Create your first job to get started.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map((status) => {
              const colJobs = columnJobs(status);
              return (
                <div key={status} className="min-w-[280px] flex-shrink-0">
                  {/* Column header */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888888]">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1E1E1E] px-1.5 text-xs text-[#888888]">
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Column body */}
                  <div className="space-y-3 rounded-lg bg-[#0E0E0E] p-3 min-h-[200px]">
                    {colJobs.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-xs text-[#555555]">
                        No jobs
                      </div>
                    ) : (
                      colJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ── Job Card ───────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  const colors = TYPE_COLORS[job.type] ?? {
    bg: "bg-[#1E1E1E]",
    text: "text-[#888888]",
  };
  const price = job.finalPrice ?? job.quotedPrice;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 transition-colors duration-200 hover:border-[#C4A265]"
    >
      {/* Title */}
      <h3 className="font-medium text-[#F5F5F5]">{job.title}</h3>

      {/* Customer */}
      <p className="mt-1 text-sm text-[#888888]">{job.customer.name}</p>

      {/* Vehicle */}
      <p className="mt-0.5 text-sm text-[#888888]">
        {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
      </p>

      {/* Type badge */}
      <div className="mt-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {job.type}
        </span>
      </div>

      {/* Bottom row: price + assigned */}
      <div className="mt-3 flex items-center justify-between border-t border-[#2A2A2A] pt-3">
        {price != null ? (
          <span className="flex items-center gap-1 text-sm font-medium text-[#C4A265]">
            <DollarSign size={13} />
            {formatCurrency(price)}
          </span>
        ) : (
          <span className="text-xs text-[#555555]">No quote</span>
        )}

        {job.assignedTo && (
          <span className="flex items-center gap-1 text-xs text-[#888888]">
            <User size={12} />
            {job.assignedTo}
          </span>
        )}
      </div>
    </Link>
  );
}
