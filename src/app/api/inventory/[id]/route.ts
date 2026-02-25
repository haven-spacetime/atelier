import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["AVAILABLE", "PENDING", "SOLD"] as const;
type InventoryStatusValue = (typeof VALID_STATUSES)[number];

const ALLOWED_FIELDS = new Set([
  "year",
  "make",
  "model",
  "color",
  "vin",
  "mileage",
  "photos",
  "askingPrice",
  "costBasis",
  "status",
  "description",
]);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Filter to allowed fields only
    const data: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_FIELDS.has(key)) {
        data[key] = body[key];
      }
    }

    // Validate status if provided
    if (data.status !== undefined) {
      if (!VALID_STATUSES.includes(data.status as InventoryStatusValue)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
          { status: 400 },
        );
      }
    }

    const existing = await prisma.inventoryVehicle.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Auto-manage soldAt based on status transitions
    if (data.status !== undefined) {
      const newStatus = data.status as string;
      if (newStatus === "SOLD" && existing.status !== "SOLD") {
        data.soldAt = new Date();
      } else if (newStatus !== "SOLD" && existing.status === "SOLD") {
        data.soldAt = null;
      }
    }

    const updated = await prisma.inventoryVehicle.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/inventory/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
