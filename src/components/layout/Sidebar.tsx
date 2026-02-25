"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Calendar,
  FileText,
  Car,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Jobs", href: "/jobs", icon: Wrench },
  { label: "Schedule", href: "/schedule", icon: Calendar },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Inventory", href: "/inventory", icon: Car },
  { label: "Marketing", href: "/marketing", icon: Send },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-20 flex h-screen flex-col border-r border-[#2A2A2A] bg-[#0A0A0A] transition-all duration-200 ease-in-out ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Wordmark */}
      <div className="flex h-16 items-center justify-between border-b border-[#2A2A2A] px-4">
        {!collapsed && (
          <span className="font-display text-2xl tracking-wider text-[#A0A0A0]">atelier</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded text-[#888888] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active ? "text-white" : "text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
              }`}
            >
              {/* Active indicator — gold left border */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#C4A265]" />
              )}
              <Icon size={18} className={active ? "text-[#C4A265]" : ""} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings */}
      <div className="border-t border-[#2A2A2A] px-2 py-4">
        <Link
          href="/settings"
          className={`group flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
            isActive("/settings")
              ? "text-white"
              : "text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
          }`}
        >
          {isActive("/settings") && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#C4A265]" />
          )}
          <Settings size={18} className={isActive("/settings") ? "text-[#C4A265]" : ""} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
