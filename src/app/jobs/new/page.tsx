"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import { JOB_TYPES } from "@/lib/constants";

// ── Types ──────────────────────────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
}

// ── Reusable field components ──────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-[#888888] mb-1.5">
      {children}
      {required && <span className="ml-1 text-[#C4A265]">*</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#555555] outline-none transition-colors duration-200 focus:border-[#C4A265] disabled:opacity-40 disabled:cursor-not-allowed";

const selectCls =
  "w-full rounded bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2.5 text-sm text-[#F5F5F5] outline-none transition-colors duration-200 focus:border-[#C4A265] disabled:opacity-40 disabled:cursor-not-allowed appearance-none";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-6">
      <h2 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wide mb-4 pb-3 border-b border-[#2A2A2A]">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────

export default function NewJobPage() {
  const router = useRouter();

  // Dropdown data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Form fields
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [materialNotes, setMaterialNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [bayNumber, setBayNumber] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load customers on mount
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data);
      } catch {
        // silently fail — user can retry
      } finally {
        setLoadingCustomers(false);
      }
    }
    fetchCustomers();
  }, []);

  // Reload vehicles when customer changes
  useEffect(() => {
    if (!customerId) {
      setVehicles([]);
      setVehicleId("");
      return;
    }
    async function fetchVehicles() {
      setLoadingVehicles(true);
      setVehicleId("");
      try {
        const res = await fetch(`/api/vehicles?customerId=${customerId}`);
        const data = await res.json();
        setVehicles(data);
      } catch {
        setVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    }
    fetchVehicles();
  }, [customerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerId || !vehicleId || !type || !title.trim()) {
      setError("Customer, vehicle, job type, and title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          vehicleId,
          type,
          title,
          description: description || undefined,
          materialNotes: materialNotes || undefined,
          assignedTo: assignedTo || undefined,
          bayNumber: bayNumber || undefined,
          scheduledDate: scheduledDate || undefined,
          quotedPrice: quotedPrice || undefined,
          depositAmount: depositAmount || undefined,
        }),
      });

      if (res.status === 201) {
        const job = await res.json();
        router.push(`/jobs/${job.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create job. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header title="New Job" />

      <div className="max-w-3xl mx-auto p-6">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={15} />
          Back to Jobs
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Section 1: Customer & Vehicle ── */}
          <SectionCard title="Customer & Vehicle">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Customer */}
              <div>
                <Label required>Customer</Label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={loadingCustomers}
                  className={selectCls}
                >
                  <option value="">
                    {loadingCustomers ? "Loading customers..." : "Select a customer..."}
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div>
                <Label required>Vehicle</Label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  disabled={!customerId || loadingVehicles}
                  className={selectCls}
                >
                  <option value="">
                    {!customerId
                      ? "Select a customer first..."
                      : loadingVehicles
                        ? "Loading vehicles..."
                        : vehicles.length === 0
                          ? "No vehicles on file"
                          : "Select a vehicle..."}
                  </option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} — {v.color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── Section 2: Job Details ── */}
          <SectionCard title="Job Details">
            {/* Title — full width */}
            <div>
              <Label required>Job Title</Label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Body Satin Black Wrap"
                className={inputCls}
              />
            </div>

            {/* Type */}
            <div>
              <Label required>Job Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                <option value="">Select a type...</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the job scope, customer requests, or special instructions..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Material Notes */}
            <div>
              <Label>Material Notes</Label>
              <textarea
                value={materialNotes}
                onChange={(e) => setMaterialNotes(e.target.value)}
                rows={2}
                placeholder="e.g. 3M 1080-S12 Satin Black, 75 sq ft estimated"
                className={`${inputCls} resize-none`}
              />
            </div>
          </SectionCard>

          {/* ── Section 3: Scheduling & Assignment ── */}
          <SectionCard title="Scheduling & Assignment">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Assigned To */}
              <div>
                <Label>Assigned To</Label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Mike, Danny"
                  className={inputCls}
                />
              </div>

              {/* Bay Number */}
              <div>
                <Label>Bay Number</Label>
                <input
                  type="number"
                  value={bayNumber}
                  onChange={(e) => setBayNumber(e.target.value)}
                  min={1}
                  max={6}
                  placeholder="1 – 6"
                  className={inputCls}
                />
              </div>

              {/* Scheduled Date */}
              <div>
                <Label>Scheduled Date</Label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 4: Pricing ── */}
          <SectionCard title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Quoted Price */}
              <div>
                <Label>Quoted Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className={`${inputCls} pl-7`}
                  />
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <Label>Deposit Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className={`${inputCls} pl-7`}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Submit ── */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-[#C4A265] px-4 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Job..." : "Create Job"}
            </button>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
        </form>
      </div>
    </>
  );
}
