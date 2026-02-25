import Link from "next/link";
import { Car, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InventoryPage() {
  let vehicles: Awaited<ReturnType<typeof prisma.inventoryVehicle.findMany>> =
    [];

  try {
    vehicles = await prisma.inventoryVehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database may not be seeded yet — render empty state
  }

  return (
    <>
      <Header title="Inventory" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
          </p>
          <Link
            href="/inventory/new"
            className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
          >
            <Plus size={16} />
            Add Vehicle
          </Link>
        </div>

        {/* Vehicle Grid or Empty State */}
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
              <Car size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">
              No inventory yet
            </h2>
            <p className="mt-1 text-sm text-[#888888]">
              Add your first vehicle to start building your inventory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => {
              const statusColor =
                vehicle.status === "AVAILABLE"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : vehicle.status === "PENDING"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : "bg-[#1E1E1E] text-[#666666] border-[#2A2A2A]";

              return (
                <div
                  key={vehicle.id}
                  className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#141414] transition-colors duration-200 hover:border-[#C4A265]"
                >
                  {/* Vehicle image */}
                  {(() => {
                    let photos: string[] = [];
                    try { photos = JSON.parse(vehicle.photos); } catch {}
                    return photos.length > 0 ? (
                      <div className="h-48 overflow-hidden bg-[#1A1A1A]">
                        <img src={photos[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-[#1A1A1A]">
                        <Car size={48} className="text-[#2A2A2A]" />
                      </div>
                    );
                  })()}

                  {/* Details */}
                  <div className="p-5">
                    {/* Year Make Model */}
                    <h3 className="font-display text-xl font-semibold text-[#F5F5F5]">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>

                    {/* Color & Mileage */}
                    <p className="mt-1 text-sm text-[#888888]">
                      {vehicle.color}
                      {vehicle.mileage != null &&
                        ` \u00B7 ${vehicle.mileage.toLocaleString()} mi`}
                    </p>

                    {/* Asking Price */}
                    {vehicle.askingPrice != null && (
                      <p className="mt-3 font-display text-2xl text-[#C4A265]">
                        {formatCurrency(vehicle.askingPrice)}
                      </p>
                    )}

                    {/* Cost Basis */}
                    {vehicle.costBasis != null && (
                      <p className="mt-0.5 text-xs text-[#666666]">
                        Cost basis: {formatCurrency(vehicle.costBasis)}
                      </p>
                    )}

                    {/* Status badge & sold date */}
                    <div className="mt-4 flex items-center gap-3">
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusColor} ${
                          vehicle.status === "SOLD" ? "line-through" : ""
                        }`}
                      >
                        {vehicle.status}
                      </span>

                      {vehicle.status === "SOLD" && vehicle.soldAt && (
                        <span className="text-xs text-[#666666]">
                          Sold {formatDate(vehicle.soldAt)}
                        </span>
                      )}
                    </div>
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
