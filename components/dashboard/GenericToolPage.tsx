"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, UploadCloud } from "lucide-react";

export default function GenericToolPage({
  title = "AI Tool",
  category = "AI Studio",
  description = "Upload an image to start transforming with AI.",
}: {
  title?: string;
  category?: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/studio" className="hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-purple-600 font-semibold">{category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
        </div>

        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Main Upload / Canvas Area */}
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center hover:border-purple-300 transition-colors flex flex-col items-center justify-center min-h-[380px] shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Upload photo to begin
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Drag & drop your JPG, PNG, or WEBP image here, or click to browse from
          your computer.
        </p>
        <button
          type="button"
          className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Choose Image</span>
        </button>
      </div>
    </div>
  );
}
