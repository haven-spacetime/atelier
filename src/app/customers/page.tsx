import Header from "@/components/layout/Header";
import CustomerList from "@/components/customers/CustomerList";
import { prisma } from "@/lib/db";
import type { CustomerWithMeta } from "@/components/customers/CustomerList";

export default async function CustomersPage() {
  let customers: CustomerWithMeta[] = [];

  try {
    const raw = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            vehicles: true,
            jobs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Serialize to plain objects with dates as ISO strings (JSON-safe)
    customers = raw.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone ?? null,
      address: c.address ?? null,
      notes: c.notes ?? null,
      tags: c.tags,
      // lastContactedAt may not exist yet — handle gracefully
      lastContactedAt:
        (c as any).lastContactedAt instanceof Date
          ? ((c as any).lastContactedAt as Date).toISOString()
          : typeof (c as any).lastContactedAt === "string"
          ? (c as any).lastContactedAt
          : null,
      createdAt: c.createdAt.toISOString(),
      _count: {
        vehicles: c._count.vehicles,
        jobs: c._count.jobs,
      },
    }));
  } catch {
    // Database may not be seeded yet
  }

  return (
    <>
      <Header title="Customers" />
      <div className="p-6">
        <CustomerList customers={customers} />
      </div>
    </>
  );
}
