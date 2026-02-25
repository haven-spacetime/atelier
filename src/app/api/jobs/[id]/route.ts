import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_STATUSES = [
  "INQUIRY",
  "QUOTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "QC",
  "COMPLETE",
  "INVOICED",
] as const;

type JobStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status as JobStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.job.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const now = new Date();

    // Run job update + customer lastContactedAt update in a transaction
    const [updatedJob] = await prisma.$transaction([
      prisma.job.update({
        where: { id },
        data: {
          status,
          ...(status === "COMPLETE" ? { completedDate: now } : {}),
        },
        include: {
          customer: true,
          vehicle: true,
        },
      }),
      prisma.customer.update({
        where: { id: existing.customerId },
        data: { lastContactedAt: now },
      }),
    ]);

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
