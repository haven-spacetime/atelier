"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-6">
      {/* Left: Page title */}
      <h1 className="font-display text-2xl text-[#F5F5F5]">{title}</h1>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
          />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-56 rounded bg-[#141414] pl-9 pr-3 text-sm text-[#F5F5F5] placeholder-[#888888] border border-[#2A2A2A] outline-none transition-colors duration-200 focus:border-[#C4A265]"
          />
        </div>

        {/* Notification bell */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded text-[#888888] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* User avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4A265] text-xs font-semibold text-[#0A0A0A]">
          BV
        </div>
      </div>
    </header>
  );
}
