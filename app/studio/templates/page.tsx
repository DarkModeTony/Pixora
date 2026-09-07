"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutTemplate, Sparkles, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      title: "Clean Editorial Portrait",
      category: "Skin & Beauty",
      img: "/images/skin-face.jpg",
    },
    {
      title: "Streetwear Lookbook",
      category: "Fashion",
      img: "/images/fashion-man.jpg",
    },
    {
      title: "Modern Fade & Beard",
      category: "Grooming",
      img: "/images/hair-beard.jpg",
    },
    {
      title: "Cyberpunk Neon Art",
      category: "AI Extras",
      img: "/images/creative-edit.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Photo Templates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          One-click preset aesthetic recipes designed by top digital creators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.title}
            className="group bg-white rounded-3xl p-3 border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 mb-3">
              <Image
                src={tpl.img}
                alt={tpl.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-1">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                {tpl.category}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {tpl.title}
              </h3>
              <Link
                href="/studio/skin-face"
                className="mt-3 w-full py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
