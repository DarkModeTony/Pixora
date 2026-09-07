import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shirt, Wand2 } from "lucide-react";

export function TransformBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-[#0c1017] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle background gradient glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Headline & Action */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                More Than Editing <br />
                <span className="text-slate-100">It&apos;s a New You</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-md leading-relaxed">
                From everyday selfies to your next big look — Pixora helps you
                express your best self.
              </p>

              <div>
                <Link
                  href="/studio"
                  className="rounded-full px-7 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-base shadow-lg shadow-white/10 hover:shadow-xl transition-all group inline-flex items-center justify-center"
                >
                  <span>Explore All Features</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Side: Stack of preview photos with tags */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end gap-3 sm:gap-4 overflow-hidden pt-4 lg:pt-0">
              {/* Card 1: Style */}
              <div className="relative w-32 sm:w-44 aspect-3/4 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/images/fashion-man.jpg"
                  alt="Style transformation"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2.5 left-2 right-2 bg-black/70 backdrop-blur-md rounded-full py-1 px-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white">
                  <Shirt className="w-3 h-3 text-sky-400" />
                  <span>Style</span>
                </div>
              </div>

              {/* Card 2: Beauty (Center, elevated) */}
              <div className="relative w-36 sm:w-48 aspect-3/4 rounded-2xl overflow-hidden border-2 border-pink-400/40 shadow-2xl scale-105 z-10 hover:scale-108 transition-transform duration-300">
                <Image
                  src="/images/hero-main.jpg"
                  alt="Beauty transformation"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2.5 left-2 right-2 bg-black/70 backdrop-blur-md rounded-full py-1 px-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white">
                  <Wand2 className="w-3 h-3 text-pink-400" />
                  <span>Beauty</span>
                </div>
              </div>

              {/* Card 3: Try-On */}
              <div className="relative w-32 sm:w-44 aspect-3/4 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/images/skin-face.jpg"
                  alt="Virtual try-on preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2.5 left-2 right-2 bg-black/70 backdrop-blur-md rounded-full py-1 px-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Try-On</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
