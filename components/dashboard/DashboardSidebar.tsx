"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Sparkles,
  Smile,
  Heart,
  Shirt,
  Scissors,
  Wand2,
  FolderKanban,
  LayoutTemplate,
  CreditCard,
  Coins,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const aiTools = [
    {
      title: "AI Skin & Face Analysis",
      href: "/studio/skin-face",
      icon: Smile,
      badge: "Popular",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      title: "Beauty",
      href: "/studio/beauty",
      icon: Heart,
    },
    {
      title: "Fashion",
      href: "/studio/fashion",
      icon: Shirt,
    },
    {
      title: "Hair & Beard",
      href: "/studio/hair-beard",
      icon: Scissors,
    },
    {
      title: "AI Extras",
      href: "/studio/extras",
      icon: Wand2,
    },
  ];

  const generalNav = [
    {
      title: "My Projects",
      href: "/studio/projects",
      icon: FolderKanban,
    },
    {
      title: "Templates",
      href: "/studio/templates",
      icon: LayoutTemplate,
    },
    {
      title: "Billing",
      href: "/studio/billing",
      icon: CreditCard,
    },
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white border-r border-slate-100/90 shadow-xs z-30 transition-all select-none">
      {/* Top Header with Logo & App Name */}
      <div className="p-5 border-b border-slate-100/80">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              Pixora
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-purple-600 uppercase">
              AI Photo Studio
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Dashboard Button */}
        <div>
          <Link
            href="/studio"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === "/studio"
                ? "bg-purple-50 text-purple-700 font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard
              className={`w-4 h-4 ${
                pathname === "/studio" ? "text-purple-600" : "text-slate-400"
              }`}
            />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* AI Tools Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AI Tools
            </span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
          <nav className="space-y-1">
            {aiTools.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-purple-600" : "text-slate-400"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workspace & Account Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </span>
          </div>
          <nav className="space-y-1">
            {generalNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-purple-600" : "text-slate-400"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Remaining Credits + User Profile */}
      <div className="p-3 border-t border-slate-100/90 bg-slate-50/50 space-y-3">
        {/* Remaining Credits Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-md shadow-purple-500/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-[10px] text-purple-100 uppercase tracking-wider font-semibold">
                  Remaining Credits
                </p>
                <p className="text-base font-extrabold leading-tight">
                  {user?.credits ?? 50}{" "}
                  <span className="text-xs font-normal text-purple-200">credits</span>
                </p>
              </div>
            </div>
            <Link
              href="/studio/billing"
              className="text-[10px] font-bold bg-white text-purple-900 px-2.5 py-1 rounded-full shadow-xs hover:bg-purple-50 transition-colors"
            >
              Top Up
            </Link>
          </div>
        </div>

        {/* User Profile Avatar & Name */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || "Guest"}
              </p>
            </div>
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/login?returnTo=/studio"
              className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors shrink-0"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
