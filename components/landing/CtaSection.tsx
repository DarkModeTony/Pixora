"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function CtaSection() {
  const { user, loading } = useAuth();

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Call to Action Details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Ready to Transform <br />
              Your Photos?
            </h2>

            <p className="text-base sm:text-lg text-slate-600 max-w-md leading-relaxed">
              Join millions and experience the future of AI photo editing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {!loading && user ? (
                <Link
                  href="/studio"
                  className="rounded-full px-7 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all group inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="rounded-full px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-lg shadow-slate-900/15 hover:shadow-xl transition-all group inline-flex items-center justify-center"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                href="#pricing"
                className="rounded-full px-6 py-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base shadow-xs hover:shadow-sm transition-all inline-flex items-center justify-center"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic floating fan arrangement of cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[300px]">
            {/* Ambient colorful backdrop blur */}
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-pink-200 via-purple-200 to-sky-200 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="relative flex items-center justify-center">
              {/* Left card: Man polo */}
              <div className="relative w-28 sm:w-36 aspect-3/4 rounded-2xl overflow-hidden shadow-xl -rotate-12 translate-y-4 hover:rotate-0 transition-transform duration-300 border-2 border-white">
                <Image
                  src="/images/fashion-man.jpg"
                  alt="Fashion style"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-sky-100/90 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>AI Style</span>
                </div>
              </div>

              {/* Center card: Woman beauty */}
              <div className="relative w-36 sm:w-44 aspect-3/4 rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white hover:scale-105 transition-transform duration-300 -translate-x-2">
                <Image
                  src="/images/hero-main.jpg"
                  alt="Hero look"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 text-purple-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  <span>Virtual Try-On</span>
                </div>
              </div>

              {/* Right Floating Badge / Mini Card */}
              <div className="relative w-24 sm:w-28 aspect-square rounded-2xl overflow-hidden shadow-xl rotate-12 -translate-y-2 hover:rotate-0 transition-transform duration-300 border-2 border-white bg-white p-2 flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Wand2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Beauty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
