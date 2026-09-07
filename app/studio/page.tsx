"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  ChevronRight,
  FolderKanban,
  Plus,
  Coins,
  ArrowUpRight,
} from "lucide-react";

export default function StudioDashboardPage() {
  const { user } = useAuth();

  // Exactly 6 AI Tools (3 in one row on desktop)
  const aiTools = [
    {
      title: "AI Skin & Face Analysis",
      tag: "Skin & Tone",
      desc: "Remove blemishes, smooth pores, enhance dewy glow and balance natural complexion.",
      href: "/studio/skin-face",
      image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      badge: "Popular",
    },
    {
      title: "Beauty Studio",
      tag: "Virtual Makeup",
      desc: "Instant lipstick try-on, radiant blush, eye enhancers, contouring and glamorous glam.",
      href: "/studio/beauty",
      image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      badge: "Featured",
    },
    {
      title: "Fashion & Wardrobe",
      tag: "Virtual Try-On",
      desc: "Try on trending outfits, designer apparel, luxury streetwear and seasonal wardrobe sets.",
      href: "/studio/fashion",
      image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
      badge: "Trending",
    },
    {
      title: "Hair & Beard Styling",
      tag: "Grooming & Hair",
      desc: "Experiment with modern hairstyles, vibrant hair dyes, fades, and realistic beard shaping.",
      href: "/studio/hair-beard",
      image: "/ai-photo-editing-images/hairstyle.jpg",
    },
    {
      title: "AI Extras & Magic Tools",
      tag: "Magic Eraser",
      desc: "One-click background remover, object cleanup, photo colorization and pop art effects.",
      href: "/studio/extras",
      image: "/ai-photo-editing-images/bg-remove.jpg",
      badge: "New",
    },
    {
      title: "Face Swap & Relighting",
      tag: "Portrait AI",
      desc: "High-precision face swapping, 3D studio relighting, and ultra-resolution portrait upscale.",
      href: "/studio/extras",
      image: "/ai-photo-editing-images/face-swap.jpg",
    },
  ];


  return (
    <div className="space-y-10 pb-12">
      {/* 1. Full-Width Top Banner */}
      <div className="relative w-full rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white overflow-hidden shadow-xl shadow-purple-500/15 border border-purple-400/20">
        {/* Soft Ambient decorative blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/15 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 fill-pink-300 text-pink-300" />
              <span>Next-Gen AI Photo Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              AI Photo Editing <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-200 via-purple-100 to-white bg-clip-text text-transparent drop-shadow-xs">
                redefine for you
              </span>
            </h1>

            <p className="text-purple-100/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Transform portraits with studio relighting, try on virtual fashion,
              perfect skin textures, and generate breathtaking photo enhancements
              powered by state-of-the-art neural models.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/studio/skin-face"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-purple-950 shadow-md hover:bg-purple-50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Start Editing Now</span>
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-black/25 backdrop-blur-md text-white border border-white/10">
                <Coins className="w-4 h-4 text-amber-300" />
                <span>{user?.credits ?? 50} Credits Available</span>
              </div>
            </div>
          </div>

          {/* Right: Images Montage */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative flex items-center justify-center w-full max-w-sm">
              {/* Primary Image Card */}
              <div className="relative w-44 h-56 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30 -rotate-6 transition-transform hover:rotate-0 duration-300">
                <Image
                  src="/ai-photo-editing-images/head-shot-generator.jpg"
                  alt="AI Portrait Studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 176px, 192px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                    Studio Portrait
                  </span>
                </div>
              </div>

              {/* Secondary Overlapping Image Card */}
              <div className="relative w-40 h-52 sm:w-44 sm:h-60 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30 rotate-6 -ml-12 mt-6 sm:mt-8 transition-transform hover:rotate-0 duration-300 z-10">
                <Image
                  src="/ai-photo-editing-images/ai-makeup-try-on.jpg"
                  alt="AI Beauty Retouch"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 176px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                    Beauty Glam
                  </span>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full shadow-xl text-[11px] font-bold flex items-center gap-1.5 border border-purple-100 z-20 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span>4K Neural Generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Tools in Cards (Grid, 3 in one row, max 6 tools) */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                AI Tools & Capabilities
              </h2>
              <span className="hidden sm:inline-flex text-[11px] font-semibold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                6 Tools Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select an AI capability to open the dedicated workspace editor
            </p>
          </div>
        </div>

        {/* 3 cards per row on desktop (lg:grid-cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-xs hover:shadow-xl hover:border-purple-200/80 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 overflow-hidden"
            >
              {/* Left: Tool Image from public/ai-photo-editing-images */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-100">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 768px) 96px, 112px"
                />
                {tool.badge && (
                  <span className="absolute top-1.5 left-1.5 bg-purple-600/90 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Right: Tool Name + 2-Line Smaller Description */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                    {tool.tag}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recent Projects by Users */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recent Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your recent generations and photo editing workflows
            </p>
          </div>

          <Link
            href="/studio/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Empty State Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[280px] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100/60 shadow-xs">
            <FolderKanban className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            No projects yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
            Your saved creations, background edits, and photo transformations will appear here once you start editing.
          </p>
          <Link
            href="/studio/skin-face"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Start Your First Project</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
