import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "./shared/SectionBadge";
import {
  ArrowRight,
  Play,
  Sparkles,
  Wand2,
  Sliders,
  Crop,
  Layers,
  Sparkle,
  SlidersHorizontal,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background soft ambient glows */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 -z-10 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <SectionBadge text="AI POWERED PHOTO EDITING" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Your Style <br />
              <span className="text-slate-900">Smarter with AI</span>
              <span className="inline-block ml-3 text-amber-400">✦</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
              Edit, enhance and transform your photos with powerful AI tools for
              skin & face, fashion, virtual try-on, hair & beard and more — all
              in one app.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/studio"
                className="rounded-full px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-lg shadow-slate-900/15 hover:shadow-xl hover:-translate-y-0.5 transition-all group inline-flex items-center justify-center"
              >
                <span>Try Now</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                className="rounded-full px-6 py-4 border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-800 font-semibold text-base shadow-xs hover:shadow-sm transition-all inline-flex items-center justify-center cursor-pointer"
              >
                <Play className="mr-2 w-4 h-4 fill-slate-800 text-slate-800" />
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof Creators Cluster */}
            <div className="pt-6 flex items-center gap-4">
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden shadow-xs relative">
                  <Image
                    src="/images/skin-face.jpg"
                    alt="Creator avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden shadow-xs relative">
                  <Image
                    src="/images/fashion-man.jpg"
                    alt="Creator avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden shadow-xs relative">
                  <Image
                    src="/images/hair-beard.jpg"
                    alt="Creator avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden shadow-xs relative">
                  <Image
                    src="/images/hero-main.jpg"
                    alt="Creator avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">1M+</p>
                <p className="text-xs text-slate-500 font-medium">Happy Creators</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg">
              {/* Main Photo Card with soft gradient outline backdrop */}
              <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-b from-pink-200/50 via-purple-100/40 to-indigo-100/40 shadow-2xl shadow-purple-500/10">
                <div className="relative aspect-3/4 rounded-[2.2rem] overflow-hidden bg-slate-100">
                  <Image
                    src="/images/hero-main.jpg"
                    alt="Model portrait after AI enhancement"
                    fill
                    priority
                    className="object-cover object-top hover:scale-102 transition-transform duration-700"
                  />

                  {/* "After" Badge Tag */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    After
                  </div>
                </div>
              </div>

              {/* Floating Mini Thumbnail Card (Before / Alternative Preview) */}
              <div className="absolute -bottom-4 -left-6 sm:-left-8 w-24 sm:w-28 aspect-square rounded-2xl p-1.5 bg-white shadow-xl shadow-slate-900/10 border border-slate-100 hover:scale-105 transition-transform">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/images/skin-face.jpg"
                    alt="Original photo thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating AI Guarantee Pill Badge */}
              <div className="absolute bottom-6 right-4 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl py-2.5 px-4 shadow-xl shadow-purple-500/15 border border-purple-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Natural results
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Powered by AI
                  </p>
                </div>
              </div>

              {/* Floating Tool Panel (Right side floating action bar) */}
              <div className="hidden sm:flex flex-col gap-3 absolute top-8 -right-8 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100">
                <div className="flex flex-col items-center gap-1 group cursor-pointer p-1.5 rounded-xl hover:bg-purple-50 transition-colors">
                  <Wand2 className="w-4 h-4 text-slate-700 group-hover:text-purple-600" />
                  <span className="text-[9px] font-medium text-slate-500 group-hover:text-purple-600">
                    Retouch
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer p-1.5 rounded-xl hover:bg-purple-50 transition-colors">
                  <Sparkle className="w-4 h-4 text-slate-700 group-hover:text-purple-600" />
                  <span className="text-[9px] font-medium text-slate-500 group-hover:text-purple-600">
                    Looks
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer p-1.5 rounded-xl hover:bg-purple-50 transition-colors">
                  <Crop className="w-4 h-4 text-slate-700 group-hover:text-purple-600" />
                  <span className="text-[9px] font-medium text-slate-500 group-hover:text-purple-600">
                    Crop
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer p-1.5 rounded-xl hover:bg-purple-50 transition-colors">
                  <SlidersHorizontal className="w-4 h-4 text-slate-700 group-hover:text-purple-600" />
                  <span className="text-[9px] font-medium text-slate-500 group-hover:text-purple-600">
                    Adjust
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer p-1.5 rounded-xl hover:bg-purple-50 transition-colors">
                  <Layers className="w-4 h-4 text-slate-700 group-hover:text-purple-600" />
                  <span className="text-[9px] font-medium text-slate-500 group-hover:text-purple-600">
                    Effects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
