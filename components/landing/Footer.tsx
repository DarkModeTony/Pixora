"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-slate-100">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-sm">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Pixora
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              AI photo editing for a more confident you.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                📷
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                ▶️
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                🎵
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition-colors"
                aria-label="X / Twitter"
              >
                ✕
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                in
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#features" className="hover:text-slate-950 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-slate-950 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Download
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  What&apos;s New
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-500">
              Get the latest features and tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-slate-900"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Pixora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
