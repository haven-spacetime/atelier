import Link from "next/link";
import { Users, Plus, Car, Wrench, Phone, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";

export default async function CustomersPage() {
  let customers: Awaited<ReturnType<typeof prisma.customer.findMany>> = [];

  try {
    customers = await prisma.customer.findMany({
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
  } catch {
    // Database may not be seeded yet
  }

  return (
    <>
      <Header title="Customers" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
          >
            <Plus size={16} />
            Add Customer
          </Link>
        </div>

        {/* Customer Grid or Empty State */}
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
              <Users size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">
              No customers yet
            </h2>
            <p className="mt-1 text-sm text-[#888888]">
              Add your first customer to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => {
              const tags: string[] = (() => {
                try {
                  return JSON.parse(customer.tags);
                } catch {
                  return [];
                }
              })();

              return (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="block rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 transition-colors duration-200 hover:border-[#C4A265]"
                >
                  {/* Name */}
                  <h3 className="text-lg font-medium text-[#F5F5F5]">
                    {customer.name}
                  </h3>

                  {/* Contact info */}
                  <div className="mt-2 space-y-1">
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#888888]">
                        <Phone size={13} />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-[#888888]">
                        <Mail size={13} />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-[#1E1E1E] px-2 py-0.5 text-xs text-[#C4A265] border border-[#2A2A2A]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="mt-4 flex items-center gap-4 border-t border-[#2A2A2A] pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                      <Car size={13} />
                      <span>
                        {customer._count.vehicles} vehicle
                        {customer._count.vehicles !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                      <Wrench size={13} />
                      <span>
                        {customer._count.jobs} job
                        {customer._count.jobs !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
