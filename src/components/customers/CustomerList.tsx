"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List,
  Search,
  Car,
  Wrench,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Columns3,
  Check,
  Plus,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface CustomerWithMeta {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  tags: string;
  lastContactedAt: string | null;
  lastContactMethod: string | null;
  createdAt: string;
  _count: { vehicles: number; jobs: number };
}

type SortKey = "name" | "lastContactedAt" | "jobs" | "vehicles";
type SortDir = "asc" | "desc";
type ViewMode = "table" | "grid";

type ColumnKey = "phone" | "email" | "tags" | "vehicles" | "jobs" | "lastContactedAt" | "createdAt";

interface ColumnDef {
  key: ColumnKey;
  label: string;
  defaultVisible: boolean;
}

const COLUMNS: ColumnDef[] = [
  { key: "phone", label: "Phone", defaultVisible: true },
  { key: "email", label: "Email", defaultVisible: true },
  { key: "tags", label: "Tags", defaultVisible: true },
  { key: "vehicles", label: "Vehicles", defaultVisible: true },
  { key: "jobs", label: "Jobs", defaultVisible: true },
  { key: "lastContactedAt", label: "Last Contacted", defaultVisible: true },
  { key: "createdAt", label: "Customer Since", defaultVisible: false },
];

function parseTags(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

interface Props {
  customers: CustomerWithMeta[];
}

// ─── Table header sub-components (defined outside to satisfy hooks/static-components) ──

function ThSortable({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#888888] cursor-pointer select-none whitespace-nowrap hover:text-[#C4A265] transition-colors duration-150"
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={12} className="text-[#C4A265]" />
          ) : (
            <ChevronDown size={12} className="text-[#C4A265]" />
          )
        ) : (
          <ChevronDown size={12} className="text-[#444]" />
        )}
      </span>
    </th>
  );
}

function ThStatic({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#888888] whitespace-nowrap">
      {label}
    </th>
  );
}

export default function CustomerList({ customers }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastContactedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>(
    () =>
      Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultVisible])) as Record<
        ColumnKey,
        boolean
      >,
  );

  const columnsRef = useRef<HTMLDivElement>(null);

  // Close columns dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
        setColumnsOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Filtered customers
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q),
    );
  }, [customers, search]);

  // Sorted customers
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "lastContactedAt") {
        const ta = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
        const tb = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
        cmp = ta - tb;
      } else if (sortKey === "jobs") {
        cmp = a._count.jobs - b._count.jobs;
      } else if (sortKey === "vehicles") {
        cmp = a._count.vehicles - b._count.vehicles;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleCol(key: ColumnKey) {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ─── TOOLBAR ────────────────────────────────────────────────────────────────

  const toolbar = (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
        <input
          type="text"
          placeholder="Search customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded bg-[#141414] border border-[#2A2A2A] pl-8 pr-3 text-sm text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors duration-200 focus:border-[#C4A265]"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Customer count */}
      <p className="text-sm text-[#888888]">
        {filtered.length} of {customers.length} customer
        {customers.length !== 1 ? "s" : ""}
      </p>

      {/* Columns toggle (table only) */}
      {view === "table" && (
        <div className="relative" ref={columnsRef}>
          <button
            onClick={() => setColumnsOpen((o) => !o)}
            className={`inline-flex items-center gap-1.5 rounded border px-3 h-9 text-sm transition-colors duration-200 ${
              columnsOpen
                ? "border-[#C4A265] text-[#C4A265] bg-[#1A1A1A]"
                : "border-[#2A2A2A] text-[#888888] bg-[#141414] hover:border-[#C4A265] hover:text-[#C4A265]"
            }`}
          >
            <Columns3 size={14} />
            Columns
          </button>
          {columnsOpen && (
            <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-[#2A2A2A] bg-[#141414] shadow-lg py-1">
              {COLUMNS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => toggleCol(col.key)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F5F5F5] hover:bg-[#1A1A1A] transition-colors duration-150"
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors duration-150 ${
                      visibleCols[col.key]
                        ? "border-[#C4A265] bg-[#C4A265]"
                        : "border-[#444444] bg-transparent"
                    }`}
                  >
                    {visibleCols[col.key] && <Check size={10} className="text-[#0A0A0A]" />}
                  </div>
                  {col.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center rounded border border-[#2A2A2A] bg-[#141414] overflow-hidden">
        <button
          onClick={() => setView("table")}
          title="Table view"
          className={`flex h-9 w-9 items-center justify-center transition-colors duration-200 ${
            view === "table" ? "bg-[#1A1A1A] text-[#C4A265]" : "text-[#888888] hover:text-[#F5F5F5]"
          }`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => setView("grid")}
          title="Grid view"
          className={`flex h-9 w-9 items-center justify-center transition-colors duration-200 ${
            view === "grid" ? "bg-[#1A1A1A] text-[#C4A265]" : "text-[#888888] hover:text-[#F5F5F5]"
          }`}
        >
          <LayoutGrid size={16} />
        </button>
      </div>

      {/* Add Customer */}
      <Link
        href="/customers/new"
        className="inline-flex items-center gap-2 rounded bg-[#C4A265] px-4 h-9 text-sm font-medium text-[#0A0A0A] transition-colors duration-200 hover:bg-[#D4B275]"
      >
        <Plus size={15} />
        Add Customer
      </Link>
    </div>
  );

  // ─── EMPTY STATE ─────────────────────────────────────────────────────────────

  if (customers.length === 0) {
    return (
      <>
        {toolbar}
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#2A2A2A]">
            <Users size={28} className="text-[#888888]" />
          </div>
          <h2 className="text-lg font-medium text-[#F5F5F5]">No customers yet</h2>
          <p className="mt-1 text-sm text-[#888888]">Add your first customer to get started.</p>
        </div>
      </>
    );
  }

  if (filtered.length === 0) {
    return (
      <>
        {toolbar}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-[#888888]">No customers match &ldquo;{search}&rdquo;</p>
        </div>
      </>
    );
  }

  // ─── GRID VIEW ───────────────────────────────────────────────────────────────

  if (view === "grid") {
    return (
      <>
        {toolbar}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((customer) => {
            const tags = parseTags(customer.tags);
            return (
              <Link
                key={customer.id}
                href={`/customers/${customer.id}`}
                className="block rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 transition-colors duration-200 hover:border-[#C4A265]"
              >
                <h3 className="text-lg font-medium text-[#F5F5F5]">{customer.name}</h3>
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
      </>
    );
  }

  // ─── TABLE VIEW ──────────────────────────────────────────────────────────────

  return (
    <>
      {toolbar}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-[#1A1A1A]">
              <tr>
                {/* Name — always visible, sortable */}
                <ThSortable
                  label="Name"
                  col="name"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />

                {visibleCols.phone && <ThStatic label="Phone" />}
                {visibleCols.email && <ThStatic label="Email" />}
                {visibleCols.tags && <ThStatic label="Tags" />}
                {visibleCols.vehicles && (
                  <ThSortable
                    label="Vehicles"
                    col="vehicles"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                )}
                {visibleCols.jobs && (
                  <ThSortable
                    label="Jobs"
                    col="jobs"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                )}
                {visibleCols.lastContactedAt && (
                  <ThSortable
                    label="Last Contacted"
                    col="lastContactedAt"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                )}
                {visibleCols.createdAt && <ThStatic label="Customer Since" />}
              </tr>
            </thead>
            <tbody>
              {sorted.map((customer) => {
                const tags = parseTags(customer.tags);
                const days = daysSince(customer.lastContactedAt);
                const needsFollowUp = days !== null && days > 30;
                const neverContacted = customer.lastContactedAt === null;

                return (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors duration-150 cursor-pointer"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${customer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-[#F5F5F5] hover:text-[#C4A265] transition-colors duration-150"
                      >
                        {customer.name}
                      </Link>
                    </td>

                    {/* Phone */}
                    {visibleCols.phone && (
                      <td className="px-4 py-3 text-sm text-[#888888] whitespace-nowrap">
                        {customer.phone ?? <span className="text-[#444444]">—</span>}
                      </td>
                    )}

                    {/* Email */}
                    {visibleCols.email && (
                      <td className="px-4 py-3 text-sm text-[#888888] whitespace-nowrap">
                        {customer.email}
                      </td>
                    )}

                    {/* Tags */}
                    {visibleCols.tags && (
                      <td className="px-4 py-3">
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-[#1E1E1E] px-2 py-0.5 text-xs text-[#C4A265] border border-[#2A2A2A] whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#444444] text-sm">—</span>
                        )}
                      </td>
                    )}

                    {/* Vehicles */}
                    {visibleCols.vehicles && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-[#888888]">
                          <Car size={13} />
                          <span>{customer._count.vehicles}</span>
                        </div>
                      </td>
                    )}

                    {/* Jobs */}
                    {visibleCols.jobs && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-[#888888]">
                          <Wrench size={13} />
                          <span>{customer._count.jobs}</span>
                        </div>
                      </td>
                    )}

                    {/* Last Contacted */}
                    {visibleCols.lastContactedAt && (
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {neverContacted ? (
                          <span className="text-[#555555]">Never</span>
                        ) : needsFollowUp ? (
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <AlertCircle size={13} />
                            {formatDate(customer.lastContactedAt!)}
                            {customer.lastContactMethod && (
                              <span className="text-amber-400/60 text-xs">
                                via {customer.lastContactMethod}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[#888888]">
                            {formatDate(customer.lastContactedAt!)}
                            {customer.lastContactMethod && (
                              <span className="ml-1 text-[#555555] text-xs">
                                via {customer.lastContactMethod}
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                    )}

                    {/* Customer Since */}
                    {visibleCols.createdAt && (
                      <td className="px-4 py-3 text-sm text-[#888888] whitespace-nowrap">
                        {formatDate(customer.createdAt)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
