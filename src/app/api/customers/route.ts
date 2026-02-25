import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: { vehicles: true, jobs: true },
        },
        jobs: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { vehicle: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, notes, tags } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
        tags: JSON.stringify(tags || []),
        lastContactedAt: new Date(),
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if ((error as Record<string, unknown>).code === "P2002") {
      return NextResponse.json(
        { error: "A customer with that email already exists" },
        { status: 409 },
      );
    }
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
