"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { ArrowLeft, X } from "lucide-react";

const inputClass =
  "w-full rounded bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#555555] outline-none transition-colors duration-200 focus:border-[#C4A265]";

const labelClass = "block text-xs font-medium uppercase tracking-wide text-[#888888] mb-1.5";

export default function NewCustomerPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTag(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, notes, tags }),
      });

      const data = await res.json();

      if (res.status === 201) {
        router.push("/customers/" + data.id);
        return;
      }

      if (res.status === 409) {
        setError("A customer with that email already exists.");
      } else {
        setError(data.error || "Failed to create customer.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header title="New Customer" />

      <div className="p-6">
        {/* Back link */}
        <Link
          href="/customers"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors duration-200 hover:text-[#F5F5F5]"
        >
          <ArrowLeft size={15} />
          Back to Customers
        </Link>

        {/* Card */}
        <div className="mx-auto max-w-2xl rounded-lg border border-[#2A2A2A] bg-[#141414] p-8">
          <div className="mb-6">
            <h2 className="font-display text-xl text-[#F5F5F5]">Customer Details</h2>
            <p className="mt-1 text-sm text-[#666666]">
              Fill in the information below to add a new customer to the CRM.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Section: Core Info */}
            <div className="space-y-4">
              {/* Customer Name — full width */}
              <div>
                <label className={labelClass}>
                  Customer Name <span className="text-[#C4A265]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Email + Phone — 2-col grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Email <span className="text-[#C4A265]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(415) 555-0123"
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Address — full width */}
              <div>
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, San Francisco, CA 94105"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#1E1E1E]" />

            {/* Section: Notes & Tags */}
            <div className="space-y-4">
              {/* Notes */}
              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any relevant notes about this customer..."
                  rows={4}
                  disabled={isSubmitting}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags</label>
                <div className="rounded bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 transition-colors duration-200 focus-within:border-[#C4A265]">
                  {/* Existing tag pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2 empty:mb-0">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-0.5 text-xs font-medium text-[#C4A265]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          disabled={isSubmitting}
                          className="text-[#666666] hover:text-[#C4A265] transition-colors duration-150 disabled:pointer-events-none"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Tag input */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => {
                      if (tagInput.trim()) addTag(tagInput);
                    }}
                    placeholder={
                      tags.length === 0
                        ? "Type a tag and press Enter or comma — e.g. vip, repeat"
                        : "Add another tag..."
                    }
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#555555] outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-[#555555]">
                  Press Enter or comma to add. Backspace to remove the last tag.
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-5 rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-[#C4A265] py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#D4B275] disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
