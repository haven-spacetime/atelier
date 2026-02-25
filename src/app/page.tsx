import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Wrench, Users, TrendingUp, Car } from "lucide-react";

// Status badge color mapping
function statusColor(status: string): string {
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
      return "bg-[#888888]/15 text-[#888888]";
    default:
      return "bg-[#888888]/15 text-[#888888]";
  }
}

function inventoryStatusColor(status: string): string {
  switch (status) {
    case "AVAILABLE":
      return "bg-[#4CAF50]/15 text-[#4CAF50]";
    case "PENDING":
      return "bg-[#FF9800]/15 text-[#FF9800]";
    case "SOLD":
      return "bg-[#888888]/15 text-[#888888]";
    default:
      return "bg-[#888888]/15 text-[#888888]";
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

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
    const [
      revenueResult,
      activeJobs,
      customers,
      pipelineResult,
      jobs,
      inventory,
    ] = await Promise.all([
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
    pipelineValue = pipelineResult.reduce(
      (sum, job) => sum + (job.quotedPrice ?? 0),
      0
    );
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
    },
    {
      label: "Active Jobs",
      value: activeJobsCount.toString(),
      icon: Wrench,
    },
    {
      label: "Customers",
      value: customerCount.toString(),
      icon: Users,
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(pipelineValue),
      icon: TrendingUp,
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
              <div
                key={stat.label}
                className="relative bg-[#141414] border border-[#2A2A2A] rounded-lg p-6"
              >
                <Icon
                  size={20}
                  className="absolute right-5 top-5 text-[#888888]"
                />
                <p className="text-sm text-[#888888] uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-display font-semibold text-[#F5F5F5]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Recent Jobs Table ── */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-display text-xl text-[#F5F5F5]">
              Recent Jobs
            </h2>
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
                    className="border-t border-[#2A2A2A] transition-colors duration-150 hover:bg-[#1A1A1A]"
                  >
                    <td className="px-6 py-4 text-sm text-[#F5F5F5]">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#888888]">
                      {job.customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#888888]">
                      {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(job.status)}`}
                      >
                        {formatStatus(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#F5F5F5]">
                      {job.quotedPrice != null
                        ? formatCurrency(job.quotedPrice)
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Inventory Preview ── */}
        <div>
          <h2 className="font-display text-xl text-[#F5F5F5] mb-4">
            Inventory
          </h2>

          {inventoryVehicles.length === 0 ? (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-6 py-12 text-center text-[#888888] text-sm">
              No inventory vehicles yet. Add vehicles to your inventory to see
              them here.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {inventoryVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="min-w-[260px] flex-shrink-0 bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden"
                >
                  {/* Vehicle image */}
                  {(() => {
                    let photos: string[] = [];
                    try { photos = JSON.parse(vehicle.photos); } catch {}
                    return photos.length > 0 ? (
                      <div className="h-40 overflow-hidden bg-[#1A1A1A]">
                        <img src={photos[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
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
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${inventoryStatusColor(vehicle.status)}`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
