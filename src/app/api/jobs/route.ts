import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      customer: true,
      vehicle: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
