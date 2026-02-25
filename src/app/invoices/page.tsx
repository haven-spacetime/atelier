import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InvoicesPage() {
  let invoices: Awaited<ReturnType<typeof prisma.invoice.findMany>> = [];

  try {
    invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        job: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database may not be seeded yet — render empty state
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]",
    SENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    OVERDUE: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <>
      <Header title="Invoices" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
          </p>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
          >
            <Plus size={16} />
            Create Invoice
          </Link>
        </div>

        {/* Table or Empty State */}
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
              <FileText size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">
              No invoices yet
            </h2>
            <p className="mt-1 text-sm text-[#888888]">
              Create your first invoice to start tracking payments.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#141414]">
            <table className="w-full text-sm">
              {/* Table head */}
              <thead>
                <tr className="border-b border-[#2A2A2A] text-left text-xs font-medium uppercase tracking-wider text-[#888888]">
                  <th className="px-4 py-3">Invoice #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-[#2A2A2A] transition-colors duration-200 hover:bg-[#1A1A1A]"
                  >
                    {/* Invoice number */}
                    <td className="px-4 py-3 font-medium text-[#F5F5F5]">
                      {invoice.invoiceNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 text-[#888888]">
                      {(invoice as any).customer?.name ?? "\u2014"}
                    </td>

                    {/* Job */}
                    <td className="px-4 py-3 text-[#888888]">
                      {(invoice as any).job?.title ?? "\u2014"}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-right font-display text-[#C4A265]">
                      {formatCurrency(invoice.total)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          statusColors[invoice.status] ??
                          "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[#888888]">
                      {formatDate(invoice.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
