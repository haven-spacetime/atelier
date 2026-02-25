import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Car, Camera, Calendar, Clock, Hash } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INVENTORY_STATUS_COLORS } from "@/lib/constants";
import { formatStatus, parseJsonArray } from "@/lib/format";
import { calcMarginPercent, calcProfit } from "@/lib/inventory";
import StatusChanger from "@/components/inventory/StatusChanger";

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vehicle = await prisma.inventoryVehicle.findUnique({
    where: { id },
  });

  if (!vehicle) return notFound();

  const statusColor =
    INVENTORY_STATUS_COLORS[vehicle.status] ?? "bg-[#1E1E1E] text-[#666666] border-[#2A2A2A]";
  const photos = parseJsonArray(vehicle.photos);
  const profit = calcProfit(vehicle.askingPrice, vehicle.costBasis);
  const margin = calcMarginPercent(vehicle.askingPrice, vehicle.costBasis);

  return (
    <>
      <Header title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <div className="p-6">
        {/* Back link + status badge */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#F5F5F5]"
          >
            <ArrowLeft size={16} />
            Back to Inventory
          </Link>

          <span
            className={`inline-flex rounded border px-3 py-1 text-sm font-medium ${statusColor}`}
          >
            {formatStatus(vehicle.status)}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-semibold text-[#F5F5F5]">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>

        {/* Status Changer Pipeline */}
        <StatusChanger vehicleId={vehicle.id} currentStatus={vehicle.status} />

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#888888]">
              Asking Price
            </p>
            <p className="mt-1.5 text-lg font-semibold text-[#C4A265]">
              {vehicle.askingPrice != null ? formatCurrency(vehicle.askingPrice) : "--"}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#888888]">
              Cost Basis
            </p>
            <p className="mt-1.5 text-lg font-semibold text-[#F5F5F5]">
              {vehicle.costBasis != null ? formatCurrency(vehicle.costBasis) : "--"}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#888888]">
              Profit
            </p>
            <p
              className={`mt-1.5 text-lg font-semibold ${
                profit == null
                  ? "text-[#F5F5F5]"
                  : profit >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
              }`}
            >
              {profit != null ? formatCurrency(profit) : "--"}
            </p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#888888]">
              Margin
            </p>
            <p
              className={`mt-1.5 text-lg font-semibold ${
                margin == null
                  ? "text-[#F5F5F5]"
                  : margin >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
              }`}
            >
              {margin != null ? `${margin.toFixed(1)}%` : "--"}
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Main content (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Photos Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
              <h2 className="mb-4 text-lg font-medium text-[#F5F5F5]">Photos</h2>

              {photos.length > 0 ? (
                <div className="space-y-3">
                  {/* Hero image */}
                  <div className="aspect-video overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Thumbnail grid */}
                  {photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {photos.slice(1).map((url, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Photo ${i + 2}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
                  <div className="flex flex-col items-center gap-2 text-[#555555]">
                    <Camera size={32} />
                    <span className="text-sm">No photos</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description Card */}
            {vehicle.description && (
              <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
                <h2 className="mb-3 text-lg font-medium text-[#F5F5F5]">Description</h2>
                <p className="text-sm leading-relaxed text-[#CCCCCC] whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Vehicle Specs Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Vehicle Specs
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888888]">Color</p>
                  <p className="mt-0.5 text-sm text-[#F5F5F5]">{vehicle.color}</p>
                </div>

                {vehicle.vin && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">VIN</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-sm text-[#F5F5F5]">
                      <Hash size={13} className="text-[#888888]" />
                      {vehicle.vin}
                    </p>
                  </div>
                )}

                {vehicle.mileage != null && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">Mileage</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                      <Car size={13} className="text-[#888888]" />
                      {vehicle.mileage.toLocaleString()} mi
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates Card */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#888888]">
                Dates
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888888]">Listed</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Calendar size={13} className="text-[#888888]" />
                    {formatDate(vehicle.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888888]">Last Updated</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#F5F5F5]">
                    <Clock size={13} className="text-[#888888]" />
                    {formatDate(vehicle.updatedAt)}
                  </p>
                </div>

                {vehicle.status === "SOLD" && vehicle.soldAt && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#888888]">Sold</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-emerald-400">
                      <Calendar size={13} />
                      {formatDate(vehicle.soldAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
