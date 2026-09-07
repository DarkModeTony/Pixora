"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Menu, Sparkles, Bell, Search, Plus } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/90 h-16 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile Toggle & Quick Search / Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-500 w-64 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools, templates, projects..."
            className="bg-transparent border-none outline-none w-full text-slate-800 placeholder:text-slate-400 text-xs"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications, & Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick New Project Button */}
        <Link
          href="/studio/skin-face"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Edit</span>
        </Link>

        {/* Notifications Icon */}
        <button
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[10px] text-purple-600 font-semibold capitalize leading-none">
              {user?.plan ? `${user.plan} Plan` : "Free Plan"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
