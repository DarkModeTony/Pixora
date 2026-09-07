"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tight">P</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
            Pixora
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#explore"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Explore
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#blog"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="#support"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Support
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/studio"
                className="rounded-full px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Studio</span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-950 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/studio"
                className="rounded-full px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Studio</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Features
          </Link>
          <Link
            href="#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Pricing
          </Link>
          <Link
            href="#blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Blog
          </Link>
          <Link
            href="#support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Support
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {!loading && user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-full py-2.5 text-center text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Studio</span>
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full py-2.5 text-center text-sm font-semibold border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-full py-2.5 text-center text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-full py-2.5 text-center text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Studio</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
