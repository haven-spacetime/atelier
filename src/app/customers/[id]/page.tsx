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
} from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusColor: Record<string, string> = {
  INQUIRY: "bg-[#1E1E1E] text-[#888888]",
  QUOTED: "bg-[#1A1A2E] text-[#7B8CDE]",
  SCHEDULED: "bg-[#1A2E1A] text-[#81C784]",
  IN_PROGRESS: "bg-[#2E2A1A] text-[#FFB74D]",
  QC: "bg-[#2E1A2E] text-[#CE93D8]",
  COMPLETE: "bg-[#1A2E1A] text-[#4CAF50]",
  INVOICED: "bg-[#1A2E2E] text-[#4DD0E1]",
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
        orderBy: { createdAt: "desc" },
      },
      jobs: {
        include: {
          vehicle: true,
        },
        orderBy: { createdAt: "desc" },
      },
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

  return (
    <>
      <Header title={customer.name} />
      <div className="p-6">
        {/* Back link */}
        <Link
          href="/customers"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#C4A265]"
        >
          <ArrowLeft size={14} />
          Back to Customers
        </Link>

        {/* Two column layout */}
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column — wider */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h2 className="mb-4 text-base font-medium text-[#F5F5F5]">
                Customer Information
              </h2>

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888888]">
                    Name
                  </p>
                  <p className="mt-0.5 text-sm text-[#F5F5F5]">
                    {customer.name}
                  </p>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 text-[#888888]" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">
                      Email
                    </p>
                    <p className="mt-0.5 text-sm text-[#F5F5F5]">
                      {customer.email}
                    </p>
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
                      <p className="mt-0.5 text-sm text-[#F5F5F5]">
                        {customer.phone}
                      </p>
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

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">
                      Tags
                    </p>
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
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium text-right">
                          Price
                        </th>
                        <th className="pb-3 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {customer.jobs.map((job) => (
                        <tr
                          key={job.id}
                          className="transition-colors duration-200 hover:bg-[#1A1A1A]"
                        >
                          <td className="py-3 pr-4">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="text-[#F5F5F5] hover:text-[#C4A265] transition-colors duration-200"
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
                              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                statusColor[job.status] ??
                                "bg-[#1E1E1E] text-[#888888]"
                              }`}
                            >
                              {job.status.replace("_", " ")}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Vehicles Card */}
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
                <div className="space-y-3">
                  {customer.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded border border-[#2A2A2A] bg-[#0A0A0A] p-3"
                    >
                      <p className="text-sm font-medium text-[#F5F5F5]">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#888888]">
                        {vehicle.color && <span>{vehicle.color}</span>}
                        {vehicle.vin && (
                          <span className="font-mono">{vehicle.vin}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
