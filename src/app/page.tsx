import Link from "next/link";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { getJobStatusBadgeClass, INVENTORY_STATUS_COLORS } from "@/lib/constants";
import { formatStatus, parseJsonArray } from "@/lib/format";
import { DollarSign, Wrench, Users, TrendingUp, Car, Plus, UserPlus, FileText } from "lucide-react";

export default async function DashboardPage() {
  let monthlyRevenue = 0;
  let activeJobsCount = 0;
  let customerCount = 0;
  let pipelineValue = 0;
  let recentJobs: Array<{
    id: string;
    title: string;
    status: string;
    quotedPrice: number | null;
    customer: { name: string };
    vehicle: { year: number; make: string; model: string };
  }> = [];
  let inventoryVehicles: Array<{
    id: string;
    year: number;
    make: string;
    model: string;
    color: string;
    askingPrice: number | null;
    status: string;
    photos: string;
  }> = [];

  try {
    // Get the start of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run all queries in parallel
    const [revenueResult, activeJobs, customers, pipelineResult, jobs, inventory] =
      await Promise.all([
        // Monthly revenue: sum of paid invoices this month
        prisma.invoice.findMany({
          where: {
            status: "PAID",
            paidAt: { gte: startOfMonth },
          },
          select: { total: true },
        }),

        // Active jobs count
        prisma.job.count({
          where: {
            status: { in: ["IN_PROGRESS", "QC"] },
          },
        }),

        // Total customer count
        prisma.customer.count(),

        // Pipeline value: sum of quotedPrice for INQUIRY or QUOTED jobs
        prisma.job.findMany({
          where: {
            status: { in: ["INQUIRY", "QUOTED"] },
          },
          select: { quotedPrice: true },
        }),

        // Recent 5 jobs
        prisma.job.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            customer: { select: { name: true } },
            vehicle: { select: { year: true, make: true, model: true } },
          },
        }),

        // Inventory vehicles (up to 4)
        prisma.inventoryVehicle.findMany({
          take: 4,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            year: true,
            make: true,
            model: true,
            color: true,
            askingPrice: true,
            status: true,
            photos: true,
          },
        }),
      ]);

    monthlyRevenue = revenueResult.reduce((sum, inv) => sum + inv.total, 0);
    activeJobsCount = activeJobs;
    customerCount = customers;
    pipelineValue = pipelineResult.reduce((sum, job) => sum + (job.quotedPrice ?? 0), 0);
    recentJobs = jobs;
    inventoryVehicles = inventory;
  } catch {
    // Database not available — empty state will render
  }

  const stats = [
    {
      label: "Monthly Revenue",
      value: formatCurrency(monthlyRevenue),
      icon: DollarSign,
      href: "/invoices",
    },
    {
      label: "Active Jobs",
      value: activeJobsCount.toString(),
      icon: Wrench,
      href: "/jobs",
    },
    {
      label: "Customers",
      value: customerCount.toString(),
      icon: Users,
      href: "/customers",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(pipelineValue),
      icon: TrendingUp,
      href: "/jobs",
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className="block">
                <div className="relative bg-[#141414] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C4A265] transition-colors duration-200">
                  <Icon size={20} className="absolute right-5 top-5 text-[#888888]" />
                  <p className="text-sm text-[#888888] uppercase tracking-wide">{stat.label}</p>
                  <p className="mt-2 text-3xl font-display font-semibold text-[#F5F5F5]">
                    {stat.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Quick Actions ── */}
        <div className="flex gap-3">
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] hover:bg-[#D4B275] transition-colors"
          >
            <Plus size={16} /> New Job
          </Link>
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 rounded border border-[#2A2A2A] bg-[#141414] px-4 py-2 text-sm font-medium text-[#F5F5F5] hover:border-[#C4A265] transition-colors"
          >
            <UserPlus size={16} /> New Customer
          </Link>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded border border-[#2A2A2A] bg-[#141414] px-4 py-2 text-sm font-medium text-[#F5F5F5] hover:border-[#C4A265] transition-colors"
          >
            <FileText size={16} /> New Invoice
          </Link>
        </div>

        {/* ── Recent Jobs Table ── */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-display text-xl text-[#F5F5F5]">Recent Jobs</h2>
          </div>

          {recentJobs.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#888888] text-sm">
              No jobs yet. Create your first job to get started.
            </div>
          ) : (
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
                  <th className="px-6 py-3 text-left text-xs uppercase text-[#888888] tracking-wide font-medium">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs uppercase text-[#888888] tracking-wide font-medium">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
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
          )}
        </div>

        {/* ── Inventory Preview ── */}
        <div>
          <h2 className="font-display text-xl text-[#F5F5F5] mb-4">Inventory</h2>

          {inventoryVehicles.length === 0 ? (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-6 py-12 text-center text-[#888888] text-sm">
              No inventory vehicles yet. Add vehicles to your inventory to see them here.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {inventoryVehicles.map((vehicle) => (
                <Link
                  href="/inventory"
                  key={vehicle.id}
                  className="min-w-[260px] flex-shrink-0 block"
                >
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden hover:border-[#C4A265] transition-colors duration-200">
                    {/* Vehicle image */}
                    {(() => {
                      const photos = parseJsonArray(vehicle.photos);
                      return photos.length > 0 ? (
                        <div className="h-40 overflow-hidden bg-[#1A1A1A]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photos[0]}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-[#1A1A1A]">
                          <Car size={40} className="text-[#2A2A2A]" />
                        </div>
                      );
                    })()}

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <p className="text-sm font-medium text-[#F5F5F5]">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="font-display text-lg font-semibold text-[#C4A265]">
                        {vehicle.askingPrice != null
                          ? formatCurrency(vehicle.askingPrice)
                          : "Price TBD"}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${INVENTORY_STATUS_COLORS[vehicle.status] ?? "bg-[#888888]/15 text-[#888888]"}`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
