import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Car,
  Wrench,
  MessageSquare,
  DollarSign,
  Activity,
  Briefcase,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

// ── Status & type configs (mirrors jobs page) ──────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  INQUIRY: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
  QUOTED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  SCHEDULED: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  QC: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  COMPLETE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  INVOICED: { bg: "bg-[#C4A265]/10", text: "text-[#C4A265]", dot: "bg-[#C4A265]" },
};

const STATUS_LABELS: Record<string, string> = {
  INQUIRY: "Inquiry",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  QC: "QC",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  WRAP: { bg: "bg-purple-500/10", text: "text-purple-400" },
  PPF: { bg: "bg-blue-500/10", text: "text-blue-400" },
  CERAMIC: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  TINT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  CUSTOM: { bg: "bg-pink-500/10", text: "text-pink-400" },
  DEALERSHIP: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: {
        include: {
          jobs: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      jobs: {
        include: {
          vehicle: true,
        },
        orderBy: { createdAt: "desc" },
      },
      invoices: true,
    },
  });

  if (!customer) {
    notFound();
  }

  const tags: string[] = (() => {
    try {
      return JSON.parse(customer.tags);
    } catch {
      return [];
    }
  })();

  // ── Computed stats ──────────────────────────────
  const totalSpent = customer.invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.total, 0);

  const activeJobs = customer.jobs.filter(
    (j) => j.status === "IN_PROGRESS" || j.status === "QC"
  ).length;

  const totalJobs = customer.jobs.length;
  const vehicleCount = customer.vehicles.length;

  return (
    <>
      <Header title={customer.name} />
      <div className="p-6">
        {/* Back link */}
        <Link
          href="/customers"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#C4A265]"
        >
          <ArrowLeft size={14} />
          Back to Customers
        </Link>

        {/* Customer name + Quick Contact bar */}
        <div className="mt-2 mb-4">
          <h1 className="text-2xl font-semibold text-[#F5F5F5]">{customer.name}</h1>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#1E1E1E] px-2 py-0.5 text-xs text-[#C4A265] border border-[#2A2A2A]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quick Contact actions */}
          <div className="mt-3 flex items-center gap-2">
            {customer.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors duration-200 hover:border-[#C4A265]/40 hover:text-[#C4A265]"
                title={`Call ${customer.phone}`}
              >
                <Phone size={13} />
                Call
              </a>
            )}
            <a
              href={`mailto:${customer.email}`}
              className="inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors duration-200 hover:border-[#C4A265]/40 hover:text-[#C4A265]"
              title={`Email ${customer.email}`}
            >
              <Mail size={13} />
              Email
            </a>
            <Link
              href={`/marketing/new?customer=${id}`}
              className="inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors duration-200 hover:border-[#C4A265]/40 hover:text-[#C4A265]"
              title="Send SMS"
            >
              <MessageSquare size={13} />
              SMS
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center gap-2 text-[#888888]">
              <DollarSign size={13} />
              <span className="text-[10px] uppercase tracking-widest">Total Spent</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-[#C4A265]">
              {totalSpent > 0 ? formatCurrency(totalSpent) : "--"}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center gap-2 text-[#888888]">
              <Activity size={13} />
              <span className="text-[10px] uppercase tracking-widest">Active Jobs</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-[#F5F5F5]">
              {activeJobs}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center gap-2 text-[#888888]">
              <Briefcase size={13} />
              <span className="text-[10px] uppercase tracking-widest">Total Jobs</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-[#F5F5F5]">
              {totalJobs}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center gap-2 text-[#888888]">
              <Car size={13} />
              <span className="text-[10px] uppercase tracking-widest">Vehicles</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-[#F5F5F5]">
              {vehicleCount}
            </p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column — wider */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h2 className="mb-4 text-base font-medium text-[#F5F5F5]">
                Customer Information
              </h2>

              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 text-[#888888]" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">
                      Email
                    </p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="mt-0.5 text-sm text-[#F5F5F5] transition-colors hover:text-[#C4A265]"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {customer.phone && (
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 text-[#888888]" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#888888]">
                        Phone
                      </p>
                      <a
                        href={`tel:${customer.phone}`}
                        className="mt-0.5 text-sm text-[#F5F5F5] transition-colors hover:text-[#C4A265]"
                      >
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                {customer.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 text-[#888888]" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#888888]">
                        Address
                      </p>
                      <p className="mt-0.5 text-sm text-[#F5F5F5]">
                        {customer.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {customer.notes && (
                  <div className="flex items-start gap-2">
                    <StickyNote size={14} className="mt-0.5 text-[#888888]" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#888888]">
                        Notes
                      </p>
                      <p className="mt-0.5 text-sm text-[#F5F5F5] whitespace-pre-wrap">
                        {customer.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Jobs List */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium text-[#F5F5F5]">
                  Jobs
                </h2>
                <span className="text-xs text-[#888888]">
                  {customer.jobs.length} total
                </span>
              </div>

              {customer.jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wrench size={24} className="mb-2 text-[#888888]" />
                  <p className="text-sm text-[#888888]">No jobs yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#2A2A2A] text-xs uppercase tracking-wider text-[#888888]">
                        <th className="pb-3 pr-4 font-medium">Title</th>
                        <th className="pb-3 pr-4 font-medium">Vehicle</th>
                        <th className="pb-3 pr-4 font-medium">Type</th>
                        <th className="pb-3 pr-4 font-medium">Bay</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium text-right">
                          Price
                        </th>
                        <th className="pb-3 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {customer.jobs.map((job) => {
                        const sc = STATUS_COLORS[job.status] ?? STATUS_COLORS.INQUIRY;
                        const tc = TYPE_COLORS[job.type] ?? { bg: "bg-[#1E1E1E]", text: "text-[#888888]" };
                        return (
                          <tr
                            key={job.id}
                            className="cursor-pointer transition-colors duration-200 hover:bg-[#1A1A1A]"
                          >
                            <td className="py-3 pr-4">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="font-medium text-[#F5F5F5] hover:text-[#C4A265] transition-colors duration-200"
                              >
                                {job.title}
                              </Link>
                            </td>
                            <td className="py-3 pr-4 text-[#888888]">
                              {job.vehicle.year} {job.vehicle.make}{" "}
                              {job.vehicle.model}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}
                              >
                                {job.type}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-xs text-[#888888]">
                              {job.bayNumber != null ? `Bay ${job.bayNumber}` : "--"}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                {STATUS_LABELS[job.status] ?? job.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-right text-[#F5F5F5]">
                              {job.quotedPrice != null
                                ? formatCurrency(job.quotedPrice)
                                : "--"}
                            </td>
                            <td className="py-3 text-right text-[#888888]">
                              {formatDate(job.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Vehicles Card — with inline job history */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium text-[#F5F5F5]">
                  Vehicles
                </h2>
                <span className="text-xs text-[#888888]">
                  {customer.vehicles.length} total
                </span>
              </div>

              {customer.vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Car size={24} className="mb-2 text-[#888888]" />
                  <p className="text-sm text-[#888888]">No vehicles yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.vehicles.map((vehicle) => {
                    const vehicleJobs = vehicle.jobs ?? [];
                    return (
                      <div
                        key={vehicle.id}
                        className="rounded border border-[#2A2A2A] bg-[#0A0A0A] p-3"
                      >
                        {/* Vehicle header */}
                        <p className="text-sm font-medium text-[#F5F5F5]">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#888888]">
                          {vehicle.color && <span>{vehicle.color}</span>}
                          {vehicle.vin && (
                            <span className="font-mono">{vehicle.vin}</span>
                          )}
                        </div>

                        {/* Inline jobs for this vehicle */}
                        {vehicleJobs.length > 0 && (
                          <div className="mt-3 space-y-1.5 border-t border-[#1E1E1E] pt-2">
                            <p className="text-[10px] uppercase tracking-widest text-[#555555]">
                              Job History
                            </p>
                            {vehicleJobs.map((vj) => {
                              const sc = STATUS_COLORS[vj.status] ?? STATUS_COLORS.INQUIRY;
                              return (
                                <Link
                                  key={vj.id}
                                  href={`/jobs/${vj.id}`}
                                  className="flex items-center justify-between rounded px-2 py-1 transition-colors duration-150 hover:bg-[#141414]"
                                >
                                  <span className="text-xs text-[#CCCCCC] truncate pr-2">
                                    {vj.title}
                                  </span>
                                  <span
                                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.text}`}
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                    {STATUS_LABELS[vj.status] ?? vj.status}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {vehicleJobs.length === 0 && (
                          <p className="mt-2 text-[11px] text-[#444444]">No jobs yet</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
