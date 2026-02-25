import { Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/db";
import { SCHEDULE_TYPE_COLORS } from "@/lib/constants";
import { getWeekBounds, bucketByDayOfWeek, DAY_LABELS } from "@/lib/schedule";

export default async function SchedulePage() {
  const now = new Date();
  const { monday, sunday } = getWeekBounds(now);

  let jobs: Awaited<ReturnType<typeof prisma.job.findMany>> = [];

  try {
    jobs = await prisma.job.findMany({
      where: {
        scheduledDate: {
          gte: monday,
          lte: sunday,
        },
      },
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { scheduledDate: "asc" },
    });
  } catch {
    // Database may not be seeded yet
  }

  const buckets = bucketByDayOfWeek(jobs);

  // Build dates for column headers
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <>
      <Header title="Schedule" />
      <div className="p-6">
        {/* Week label */}
        <p className="mb-4 text-sm text-[#888888]">
          Week of{" "}
          {monday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          &ndash;{" "}
          {sunday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Weekly grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_LABELS.map((label, i) => {
            const date = weekDates[i];
            const isToday = date.toDateString() === now.toDateString();
            const dayJobs = buckets[i];

            return (
              <div key={label} className="flex flex-col">
                {/* Column header */}
                <div
                  className={`mb-2 flex flex-col items-center rounded-lg px-2 py-2 ${
                    isToday
                      ? "bg-[#C4A265]/10 border border-[#C4A265]/30"
                      : "bg-[#141414] border border-[#2A2A2A]"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday ? "text-[#C4A265]" : "text-[#888888]"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-lg font-display ${
                      isToday ? "text-[#C4A265]" : "text-[#F5F5F5]"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Day column body */}
                <div className="flex-1 space-y-2 rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] p-2 min-h-[200px]">
                  {dayJobs.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#2A2A2A]">&mdash;</p>
                  ) : (
                    dayJobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-2.5 transition-colors duration-200 hover:border-[#C4A265]"
                      >
                        {/* Job title */}
                        <p className="text-xs font-medium text-[#F5F5F5] truncate">{job.title}</p>

                        {/* Customer name */}
                        <p className="mt-0.5 text-[11px] text-[#888888] truncate">
                          {"customer" in job &&
                            ((job.customer as Record<string, unknown>)?.name as string)}
                        </p>

                        {/* Bay number */}
                        {job.bayNumber != null && (
                          <p className="mt-1 text-[11px] text-[#666666]">Bay {job.bayNumber}</p>
                        )}

                        {/* Job type badge */}
                        <span
                          className={`mt-1.5 inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                            SCHEDULE_TYPE_COLORS[job.type] ??
                            "bg-[#1E1E1E] text-[#888888] border-[#2A2A2A]"
                          }`}
                        >
                          {job.type}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if no jobs at all */}
        {jobs.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
              <Calendar size={28} className="text-[#888888]" />
            </div>
            <h2 className="text-lg font-medium text-[#F5F5F5]">No jobs scheduled this week</h2>
            <p className="mt-1 text-sm text-[#888888]">
              Jobs with a scheduled date will appear here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
