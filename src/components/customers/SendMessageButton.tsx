"use client";

import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle, AlertCircle, Car } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobContext {
  id: string;
  title: string;
  type: string;
  status: string;
  vehicle: { year: number; make: string; model: string };
}

interface Props {
  customerId: string;
  name: string;
  phone: string;
  jobs?: JobContext[];
}

const JOB_TYPE_EMOJI: Record<string, string> = {
  WRAP: "🎨",
  PPF: "🛡️",
  CERAMIC: "✨",
  TINT: "🌑",
  CUSTOM: "⚡",
  DEALERSHIP: "🏢",
};

const STATUS_LABEL: Record<string, string> = {
  INQUIRY: "Inquiry",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  QC: "Quality Check",
  COMPLETE: "Complete",
  INVOICED: "Invoiced",
};

const STATUS_COLOR: Record<string, string> = {
  INQUIRY: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  QUOTED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  SCHEDULED: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  IN_PROGRESS: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  QC: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  COMPLETE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  INVOICED: "text-[#C4A265] bg-[#C4A265]/10 border-[#C4A265]/20",
};

function buildTemplates(firstName: string, job?: JobContext) {
  const car = job ? `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}` : "vehicle";
  const jobRef = job ? ` on the ${car}` : "";

  return [
    {
      label: "Appointment Reminder",
      build: () =>
        `Hey ${firstName}! Just a reminder your appointment${jobRef} at Atelier Motors is coming up. We'll see you soon! 🔑`,
    },
    {
      label: "Job Update",
      build: () =>
        `Hey ${firstName}! Your ${car} ${job ? `— ${job.title} —` : ""} is coming along great in the shop. We'll send over progress photos soon. 🛠`,
    },
    {
      label: "Ready for Pickup",
      build: () =>
        `Great news, ${firstName}! Your ${car} is ready for pickup at Atelier Motors. We can't wait to show you the results! 🔥`,
    },
    {
      label: "Quote Ready",
      build: () =>
        `Hey ${firstName}! Your quote${jobRef} is ready. Give us a call or swing by and we'll walk you through everything. — Atelier Motors`,
    },
    {
      label: "Follow-up",
      build: () =>
        `Hey ${firstName}! Just following up on the ${job ? job.title : "service"} for your ${car}. Let us know if you have any questions! — Atelier Motors`,
    },
  ];
}

export default function SendMessageButton({ customerId, name, phone, jobs = [] }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobContext | undefined>(
    jobs.find(
      (j) => j.status === "IN_PROGRESS" || j.status === "QUOTED" || j.status === "SCHEDULED",
    ),
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const firstName = name.split(" ")[0];
  const templates = buildTemplates(firstName, selectedJob);

  function handleOpen() {
    setOpen(true);
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  }

  function handleClose() {
    setOpen(false);
    setMessage("");
    setStatus("idle");
  }

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message, customerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to send message");
        setStatus("error");
        setSending(false);
      } else {
        setSending(false);
        setStatus("success");
        setMessage("");
        // Refresh server data in background after success feedback is visible
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error — is BlueBubbles running?");
      setStatus("error");
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors duration-200 hover:border-[#C4A265]/40 hover:text-[#C4A265]"
      >
        <MessageSquare size={13} />
        iMessage
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          <div className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-[#2A2A2A] bg-[#0E0E0E] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] px-5 py-4">
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Send iMessage</p>
                <p className="text-xs text-[#555555]">{phone}</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded p-1 text-[#555555] transition-colors hover:text-[#F5F5F5]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Job context selector */}
            {jobs.length > 0 && (
              <div className="border-b border-[#2A2A2A] px-5 py-3">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-[#555555]">
                  Re: Job Context
                </p>
                <div className="space-y-1.5">
                  {jobs.map((job) => {
                    const isSelected = selectedJob?.id === job.id;
                    const emoji = JOB_TYPE_EMOJI[job.type] ?? "🔧";
                    const statusStyle =
                      STATUS_COLOR[job.status] ?? "text-[#888888] bg-[#1E1E1E] border-[#2A2A2A]";
                    return (
                      <button
                        key={job.id}
                        onClick={() => {
                          setSelectedJob(isSelected ? undefined : job);
                          setMessage(""); // clear message when context changes
                          setStatus("idle");
                        }}
                        className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "border-[#C4A265]/40 bg-[#C4A265]/5"
                            : "border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]"
                        }`}
                      >
                        <span className="mt-0.5 text-base leading-none">{emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-[#F5F5F5]">{job.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#666666]">
                            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                          </p>
                          <span
                            className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${statusStyle}`}
                          >
                            {STATUS_LABEL[job.status] ?? job.status}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-[#C4A265]" />
                        )}
                      </button>
                    );
                  })}
                  {selectedJob && (
                    <button
                      onClick={() => {
                        setSelectedJob(undefined);
                        setMessage("");
                      }}
                      className="text-[11px] text-[#555555] hover:text-[#888888]"
                    >
                      Clear context
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* No vehicles fallback */}
            {jobs.length === 0 && (
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] px-5 py-3 text-xs text-[#555555]">
                <Car size={12} />
                No active jobs — templates will use generic vehicle references
              </div>
            )}

            {/* Templates */}
            <div className="border-b border-[#2A2A2A] px-5 py-3">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#555555]">
                Quick Templates
              </p>
              <div className="flex flex-wrap gap-2">
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setMessage(t.build());
                      setStatus("idle");
                    }}
                    className="rounded border border-[#2A2A2A] bg-[#141414] px-2.5 py-1 text-[11px] text-[#888888] transition-colors hover:border-[#C4A265]/40 hover:text-[#C4A265]"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compose */}
            <div className="flex flex-1 flex-col px-5 py-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#555555]">Message</p>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setStatus("idle");
                }}
                placeholder={`Write a message to ${firstName}…`}
                rows={6}
                className="flex-1 resize-none rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 text-sm text-[#F5F5F5] placeholder-[#444444] outline-none transition-colors focus:border-[#C4A265]/50"
              />
              <p className="mt-1.5 text-right text-[10px] text-[#555555]">{message.length} chars</p>
            </div>

            {/* Status feedback */}
            {status === "success" && (
              <div className="mx-5 mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400">
                <CheckCircle size={15} />
                Sent via iMessage · Last contacted updated
              </div>
            )}
            {status === "error" && (
              <div className="mx-5 mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span className="font-medium">Failed to send</span>
                </div>
                <p className="mt-1 pl-5">{errorMsg}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-[#2A2A2A] px-5 py-4">
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="flex w-full items-center justify-center gap-2 rounded bg-[#C4A265] px-4 py-2.5 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#D4B275] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={14} />
                {sending ? "Sending…" : "Send iMessage"}
              </button>
              <p className="mt-2.5 text-center text-[10px] text-[#444444]">
                Delivered via BlueBubbles · blue bubble
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
