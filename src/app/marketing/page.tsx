import Link from "next/link";
import { Send, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { MARKETING_STATUS_COLORS } from "@/lib/constants";
import { parseJsonArray } from "@/lib/format";

export default async function MarketingPage() {
  let campaigns: Awaited<ReturnType<typeof prisma.marketingCampaign.findMany>> = [];

  try {
    campaigns = await prisma.marketingCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database may not be seeded yet — render empty state
  }

  return (
    <>
      <Header title="Marketing" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
          </p>
          <Link
            href="/marketing/new"
            className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
          >
            <Plus size={16} />
            New Campaign
          </Link>
        </div>

        {/* Campaign List or Empty State */}
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
              <Send size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">No campaigns yet</h2>
            <p className="mt-1 text-sm text-[#888888]">
              Create your first marketing campaign to reach your customers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const statusColor =
                MARKETING_STATUS_COLORS[campaign.status] ??
                "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]";

              const tags = parseJsonArray(campaign.recipientTags);

              const deliveredPct =
                campaign.recipientCount > 0
                  ? Math.round((campaign.deliveredCount / campaign.recipientCount) * 100)
                  : 0;
              const readPct =
                campaign.recipientCount > 0
                  ? Math.round((campaign.readCount / campaign.recipientCount) * 100)
                  : 0;

              return (
                <div
                  key={campaign.id}
                  className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 transition-colors duration-200 hover:border-[#C4A265]"
                >
                  {/* Top row: name + status */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium text-[#F5F5F5]">{campaign.name}</h3>
                    <span
                      className={`shrink-0 inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusColor}`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  {/* Message preview */}
                  <p className="mt-2 text-sm text-[#888888] line-clamp-2">{campaign.message}</p>

                  {/* Delivery stats for SENT campaigns */}
                  {campaign.status === "SENT" && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {/* Sent */}
                      <div className="rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] p-3">
                        <p className="text-xs text-[#888888]">Sent</p>
                        <p className="mt-1 text-lg font-medium text-[#F5F5F5]">
                          {campaign.recipientCount}
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-[#2A2A2A]">
                          <div className="h-1 rounded-full bg-[#C4A265] w-full" />
                        </div>
                      </div>

                      {/* Delivered */}
                      <div className="rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] p-3">
                        <p className="text-xs text-[#888888]">Delivered</p>
                        <p className="mt-1 text-lg font-medium text-[#F5F5F5]">
                          {campaign.deliveredCount}
                          <span className="ml-1 text-xs text-[#888888]">({deliveredPct}%)</span>
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-[#2A2A2A]">
                          <div
                            className="h-1 rounded-full bg-emerald-500"
                            style={{ width: `${deliveredPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Read */}
                      <div className="rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] p-3">
                        <p className="text-xs text-[#888888]">Read</p>
                        <p className="mt-1 text-lg font-medium text-[#F5F5F5]">
                          {campaign.readCount}
                          <span className="ml-1 text-xs text-[#888888]">({readPct}%)</span>
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-[#2A2A2A]">
                          <div
                            className="h-1 rounded-full bg-blue-500"
                            style={{ width: `${readPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient tags */}
                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
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

                  {/* Date info */}
                  <p className="mt-4 text-xs text-[#666666]">
                    {campaign.status === "SENT" && campaign.sentAt
                      ? `Sent ${formatDate(campaign.sentAt)}`
                      : `Created ${formatDate(campaign.createdAt)}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
