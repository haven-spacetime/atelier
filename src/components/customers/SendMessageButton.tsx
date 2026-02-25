"use client";

import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  name: string;
  phone: string;
}

const TEMPLATES = [
  {
    label: "Appointment Reminder",
    build: (name: string) =>
      `Hey ${name}! Just a reminder that your appointment at Atelier Motors is coming up. We'll see you soon! 🔑`,
  },
  {
    label: "Job Update",
    build: (name: string) =>
      `Hey ${name}! Just checking in — your vehicle is looking great in the shop. We'll send over progress photos soon. 🛠`,
  },
  {
    label: "Ready for Pickup",
    build: (name: string) =>
      `Great news, ${name}! Your vehicle is ready for pickup at Atelier Motors. Come by anytime — we can't wait to show you the results! 🔥`,
  },
  {
    label: "Quote Ready",
    build: (name: string) =>
      `Hey ${name}! Your quote is ready. Give us a call or swing by and we'll walk you through everything. — Atelier Motors`,
  },
];

export default function SendMessageButton({ name, phone }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const firstName = name.split(" ")[0];

  function applyTemplate(build: (n: string) => string) {
    setMessage(build(firstName));
    setStatus("idle");
  }

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
        body: JSON.stringify({ phone, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to send message");
        setStatus("error");
      } else {
        setStatus("success");
        setMessage("");
      }
    } catch {
      setErrorMsg("Network error — is BlueBubbles running?");
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors duration-200 hover:border-[#C4A265]/40 hover:text-[#C4A265]"
      >
        <MessageSquare size={13} />
        iMessage
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Drawer */}
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-[#2A2A2A] bg-[#0E0E0E] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] px-5 py-4">
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Send iMessage</p>
                <p className="text-xs text-[#888888]">{phone}</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded p-1 text-[#555555] transition-colors hover:text-[#F5F5F5]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Templates */}
            <div className="border-b border-[#2A2A2A] px-5 py-3">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#555555]">
                Quick Templates
              </p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => applyTemplate(t.build)}
                    className="rounded border border-[#2A2A2A] bg-[#141414] px-2.5 py-1 text-[11px] text-[#888888] transition-colors hover:border-[#C4A265]/40 hover:text-[#C4A265]"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compose area */}
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
                Sent via iMessage
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
