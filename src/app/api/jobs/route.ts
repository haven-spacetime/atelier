import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      vehicleId,
      type,
      title,
      description,
      estimatedHours,
      materialNotes,
      assignedTo,
      bayNumber,
      scheduledDate,
      quotedPrice,
      depositAmount,
    } = body;

    if (!customerId || !vehicleId || !type || !title) {
      return NextResponse.json(
        { error: "customerId, vehicleId, type, and title are required" },
        { status: 400 },
      );
    }

    const job = await prisma.job.create({
      data: {
        customerId,
        vehicleId,
        type,
        title: title.trim(),
        status: "INQUIRY",
        description: description?.trim() || null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        materialNotes: materialNotes?.trim() || null,
        assignedTo: assignedTo?.trim() || null,
        bayNumber: bayNumber ? parseInt(bayNumber) : null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        quotedPrice: quotedPrice ? parseFloat(quotedPrice) : null,
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        photos: JSON.stringify([]),
      },
      include: { customer: true, vehicle: true },
    });

    // Update customer's lastContactedAt
    await prisma.customer.update({
      where: { id: customerId },
      data: { lastContactedAt: new Date() },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
