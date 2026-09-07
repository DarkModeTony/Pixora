import React from "react";
import Image from "next/image";
import { SectionBadge } from "./shared/SectionBadge";
import { Upload, Sparkles, Download, Layers } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      desc: "Choose a photo from your device",
      icon: Upload,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      num: "02",
      title: "Edit with AI",
      desc: "Select a tool and let AI work its magic",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      num: "03",
      title: "Download",
      desc: "Get your high-quality, stunning result",
      icon: Download,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <section id="explore" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Realistic Smartphone App Mockup */}
          <div className="lg:col-span-6 flex justify-center relative">
            {/* Ambient background glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-gradient-to-tr from-sky-200/50 via-purple-200/40 to-pink-200/50 rounded-full blur-3xl -z-10" />

            {/* Mobile Phone Mockup Device */}
            <div className="relative w-[280px] sm:w-[320px] rounded-[3rem] p-3 bg-slate-900 shadow-2xl shadow-slate-900/30 border-4 border-slate-800 ring-1 ring-white/20">
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30" />

              {/* Phone Screen Canvas */}
              <div className="relative rounded-[2.3rem] overflow-hidden bg-white text-slate-900 pt-7 pb-4 px-3 flex flex-col gap-3 min-h-[560px]">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-3 pt-1 text-[11px] font-semibold text-slate-800">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-slate-800 rounded-full inline-block" />
                    <span className="text-[10px]">5G</span>
                  </div>
                </div>

                {/* App Header Inside Phone */}
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                      P
                    </div>
                    <span className="font-bold text-xs">Pixora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
                      🔍
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills in App */}
                <div className="flex items-center gap-1.5 overflow-x-hidden px-1 pt-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-white shadow-xs">
                    All
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Beauty
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Fashion
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Try-On
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Hair
                  </span>
                </div>

                {/* Grid of photos inside app */}
                <div className="grid grid-cols-2 gap-2 flex-grow pt-1">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                    <Image
                      src="/images/fashion-man.jpg"
                      alt="Fashion item"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                    <Image
                      src="/images/tryon-outfit.jpg"
                      alt="Try on item"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                    <Image
                      src="/images/hair-beard.jpg"
                      alt="Hair groom item"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                    <Image
                      src="/images/skin-face.jpg"
                      alt="Skin face item"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Floating pill over Phone */}
                <div className="absolute bottom-6 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      Transform Ideas
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Into Stunning Photos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: How it Works Steps */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div>
              <SectionBadge text="HOW IT WORKS" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 leading-tight">
                Edit Photos in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  3 Simple Steps
                </span>
              </h2>
              <p className="text-base text-slate-600 mt-4 max-w-md leading-relaxed">
                Get professional results in seconds. No complex tools, no learning
                curve.
              </p>
            </div>

            {/* Steps list */}
            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Number Badge */}
                    <div className="text-sm font-bold text-teal-600 bg-teal-50 border border-teal-200/50 px-2.5 py-1.5 rounded-xl shrink-0">
                      {step.num}
                    </div>

                    {/* Icon Container */}
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step details */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
