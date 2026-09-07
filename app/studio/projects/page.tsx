"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  FolderKanban,
  Sparkles,
  Layers,
  Wand2,
  Eye,
  Smile,
  Shirt,
  Scissors,
  Plus,
  Download,
  Trash2,
  RefreshCcw,
  SlidersHorizontal,
  Columns2,
  Eye as FullEye,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Clock,
  Coins,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface GenerationItem {
  id: string;
  user_id: string;
  tool: string;
  source_image_url: string;
  reference_image_url: string | null;
  result_image_url: string;
  storage_key: string | null;
  options: Record<string, unknown> | null;
  credits_used: number;
  created_at: string;
}

interface ToolMeta {
  label: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  text: string;
}

const TOOL_METADATA: Record<string, ToolMeta> = {
  "makeup-transfer": {
    label: "AI Makeup Transfer",
    badge: "Makeup Transfer",
    icon: Layers,
    gradient: "from-pink-500 to-rose-600",
    border: "border-pink-200",
    text: "text-pink-700 bg-pink-50",
  },
  "makeup-tryon": {
    label: "AI Makeup Virtual Try-On",
    badge: "Virtual Try-On",
    icon: Wand2,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-200",
    text: "text-purple-700 bg-purple-50",
  },
  "eye-color": {
    label: "AI Eye Color Try-On",
    badge: "Eye Lenses",
    icon: Eye,
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-200",
    text: "text-cyan-700 bg-cyan-50",
  },
  "skin-face": {
    label: "AI Skin & Face Analysis",
    badge: "Skin & Face",
    icon: Smile,
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-200",
    text: "text-emerald-700 bg-emerald-50",
  },
  fashion: {
    label: "Fashion & Wardrobe",
    badge: "Fashion Try-On",
    icon: Shirt,
    gradient: "from-amber-500 to-orange-600",
    border: "border-amber-200",
    text: "text-amber-700 bg-amber-50",
  },
  "hair-beard": {
    label: "Hair & Beard Styling",
    badge: "Hair & Beard",
    icon: Scissors,
    gradient: "from-indigo-500 to-violet-600",
    border: "border-indigo-200",
    text: "text-indigo-700 bg-indigo-50",
  },
  extras: {
    label: "AI Extras & Magic Tools",
    badge: "AI Extras",
    icon: Sparkles,
    gradient: "from-violet-500 to-purple-600",
    border: "border-violet-200",
    text: "text-violet-700 bg-violet-50",
  },
};

function getToolMeta(toolKey: string): ToolMeta {
  return (
    TOOL_METADATA[toolKey] || {
      label: toolKey
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      badge: toolKey,
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      border: "border-purple-200",
      text: "text-purple-700 bg-purple-50",
    }
  );
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getPresetSummary(item: GenerationItem): string {
  const opt = item.options;
  if (!opt) return "Default preset";
  if (opt.templateId && typeof opt.templateId === "string") {
    return (
      opt.templateId
        .replace(/^all_/, "")
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") + " Look"
    );
  }
  if (opt.referenceUrl && typeof opt.referenceUrl === "string") {
    if (opt.referenceUrl.includes("makeup_transfer_01")) return "Red Carpet Glam";
    if (opt.referenceUrl.includes("makeup_transfer_02")) return "Soft Chic";
    if (opt.referenceUrl.includes("makeup_transfer_03")) return "Dewy Radiance";
    if (opt.referenceUrl.includes("makeup_transfer_04")) return "Sunset Bronze";
    return "Custom Reference Look";
  }
  if (opt.eyeLensUrl && typeof opt.eyeLensUrl === "string") {
    if (opt.eyeLensUrl.includes("len_01")) return "Aqua Blue Lens";
    if (opt.eyeLensUrl.includes("len_02")) return "Emerald Green Lens";
    if (opt.eyeLensUrl.includes("len_03")) return "Honey Hazel Lens";
    if (opt.eyeLensUrl.includes("len_04")) return "Smoky Gray Lens";
    if (opt.eyeLensUrl.includes("len_05")) return "Mystic Violet Lens";
    if (opt.eyeLensUrl.includes("len_06")) return "Radiant Olive Lens";
    return "Contact Lens";
  }
  return "Standard Enhanced Look";
}

export default function MyProjectsPage() {
  const { user } = useAuth();

  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToolFilter, setSelectedToolFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Comparison State
  const [activeModalItem, setActiveModalItem] = useState<GenerationItem | null>(null);
  const [modalViewMode, setModalViewMode] = useState<"slider" | "split" | "result">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Generations
  const fetchProjects = async (targetPage = 1, filter = selectedToolFilter) => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        userId: user.id,
        page: targetPage.toString(),
        limit: "20",
      });
      if (filter && filter !== "all") {
        params.append("tool", filter);
      }

      const res = await fetch(`/api/studio/projects?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setGenerations(data.generations || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects(page, selectedToolFilter);
    } else {
      setIsLoading(false);
    }
  }, [user, page, selectedToolFilter]);

  // Handle slider drag inside modal
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDraggingSlider]);

  // Download Handler
  const handleDownload = async (url: string, tool: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `pixora-${tool}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch {
      window.open(url, "_blank");
    }
  };

  // Delete Handler
  const handleDelete = async (item: GenerationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this generation from your projects?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/studio/projects?id=${item.id}&userId=${user?.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setGenerations((prev) => prev.filter((g) => g.id !== item.id));
        setTotal((prev) => Math.max(0, prev - 1));
        if (activeModalItem?.id === item.id) {
          setActiveModalItem(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Filtered by Search Query
  const filteredGenerations = useMemo(() => {
    if (!searchQuery.trim()) return generations;
    const q = searchQuery.toLowerCase();
    return generations.filter((g) => {
      const meta = getToolMeta(g.tool);
      const summary = getPresetSummary(g).toLowerCase();
      return (
        meta.label.toLowerCase().includes(q) ||
        meta.badge.toLowerCase().includes(q) ||
        summary.includes(q)
      );
    });
  }, [generations, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP MATCHING HERO BANNER */}
      <div className="relative w-full rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white overflow-hidden shadow-xl shadow-purple-500/15 border border-purple-400/20">
        {/* Ambient Decorative Blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/15 backdrop-blur-md text-white border border-white/20">
              <FolderKanban className="w-3.5 h-3.5 text-pink-300" />
              <span>Personal Creative Vault</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              My AI Projects &amp; Creations
            </h1>

            <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
              Explore, inspect, compare, and download all your generated portraits.
              Every transformation is saved safely with full Before &amp; After sliders.
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>
                  {total} {total === 1 ? "Creation" : "Creations"} Saved
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <span>{user?.credits ?? 50} Credits Remaining</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/studio/beauty"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white text-purple-950 shadow-lg hover:bg-purple-50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4 text-purple-600" />
              <span>New Generation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tool Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {[
            { id: "all", label: "All Projects" },
            { id: "makeup-transfer", label: "Makeup Transfer", icon: Layers },
            { id: "makeup-tryon", label: "Virtual Try-On", icon: Wand2 },
            { id: "eye-color", label: "Eye Color", icon: Eye },
            { id: "skin-face", label: "Skin & Face", icon: Smile },
            { id: "fashion", label: "Fashion", icon: Shirt },
            { id: "hair-beard", label: "Hair & Beard", icon: Scissors },
          ].map((tab) => {
            const isActive = selectedToolFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedToolFilter(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Refresh Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search look or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => fetchProjects(page, selectedToolFilter)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh projects"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3. GENERATION CARDS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60 p-4 flex flex-col justify-between"
            >
              <div className="h-6 w-24 bg-slate-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : !user ? (
        /* Guest Banner */
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center flex flex-col items-center justify-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
            <FolderKanban className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-800">Sign In to Save &amp; View Creations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an account or sign in to save all your photo transformations, access high-res downloads, and claim 50 free credits!
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/signup?returnTo=/studio/projects"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Create Free Account (50 Credits)
            </Link>
            <Link
              href="/login?returnTo=/studio/projects"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      ) : filteredGenerations.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
            <FolderKanban className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery ? "No matching creations found" : "No AI creations yet"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchQuery
                ? `No projects matched "${searchQuery}". Try clearing your search or switching tool filters.`
                : "Your generated beauty styles, makeup transfers, and eye color transformations will automatically appear here."}
            </p>
          </div>

          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Clear Search
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link
                href="/studio/beauty"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-200" />
                <span>Open Beauty Studio</span>
              </Link>
              <Link
                href="/studio/skin-face"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                Skin &amp; Face Analysis
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGenerations.map((item) => {
            const meta = getToolMeta(item.tool);
            const ToolIcon = meta.icon;
            const presetSummary = getPresetSummary(item);

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveModalItem(item);
                  setModalViewMode("slider");
                  setSliderPosition(50);
                }}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer select-none"
              >
                {/* Card Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.result_image_url}
                    alt={meta.label}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Header inside Image */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    {/* Tool Badge with Dedicated Icon */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md backdrop-blur-md bg-white/95 ${meta.text}`}
                    >
                      <ToolIcon className="w-3 h-3 shrink-0" />
                      <span>{meta.badge}</span>
                    </div>

                    {/* Relative Timestamp */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white/90 text-[10px] font-medium backdrop-blur-md">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatRelativeTime(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(item);
                        setModalViewMode("slider");
                        setSliderPosition(50);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-lg hover:bg-slate-100 transition-all hover:scale-105 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                      <span>Compare</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.result_image_url, item.tool);
                      }}
                      className="p-2 rounded-xl bg-white text-slate-800 shadow-lg hover:bg-slate-100 transition-all hover:scale-105 cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item, e)}
                      className="p-2 rounded-xl bg-white/90 text-rose-600 shadow-lg hover:bg-rose-50 transition-all hover:scale-105 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Info inside Image */}
                  <div className="absolute bottom-3 inset-x-3 pointer-events-none text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate max-w-[70%] drop-shadow-sm">
                        {presetSummary}
                      </span>
                      <span className="text-[10px] font-semibold text-pink-300 drop-shadow-sm">
                        5 credits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-3.5 flex items-center justify-between bg-white border-t border-slate-100">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {meta.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {presetSummary}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalItem(item);
                      setModalViewMode("slider");
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0"
                    title="Open full inspector"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. PAGINATION CONTROLS (Max 20 per page) */}
      {!isLoading && user && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} creations
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              const isCurrent = pNum === page;
              return (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE BEFORE / AFTER PREVIEW MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                {(() => {
                  const meta = getToolMeta(activeModalItem.tool);
                  const Icon = meta.icon;
                  return (
                    <>
                      <div className={`p-1.5 rounded-lg ${meta.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {meta.label}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          {getPresetSummary(activeModalItem)} &bull;{" "}
                          {new Date(activeModalItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Switcher */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 gap-1">
                  <button
                    onClick={() => setModalViewMode("slider")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      modalViewMode === "slider"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3 text-purple-500" />
                    <span>Slider</span>
                  </button>
                  <button
                    onClick={() => setModalViewMode("split")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      modalViewMode === "split"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Columns2 className="w-3 h-3 text-purple-500" />
                    <span>Split</span>
                  </button>
                  <button
                    onClick={() => setModalViewMode("result")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      modalViewMode === "result"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FullEye className="w-3 h-3 text-purple-500" />
                    <span>Result</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Canvas */}
            <div className="flex-1 flex items-center justify-center p-5 sm:p-6 overflow-hidden bg-slate-50">
              {/* SLIDER VIEW */}
              {modalViewMode === "slider" && (
                <div
                  ref={sliderContainerRef}
                  onMouseDown={(e) => {
                    setIsDraggingSlider(true);
                    handleSliderMove(e.clientX);
                  }}
                  onTouchStart={(e) => {
                    setIsDraggingSlider(true);
                    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
                  }}
                  className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-200 select-none cursor-ew-resize bg-slate-950 group"
                >
                  {/* After Image (AI Enhanced) */}
                  <div className="absolute inset-0">
                    <Image
                      src={activeModalItem.result_image_url}
                      alt="AI Enhanced Result"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="450px"
                      priority
                    />
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-purple-900/80 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md pointer-events-none">
                      <Sparkles className="w-3 h-3 text-pink-300" />
                      AI Enhanced
                    </span>
                  </div>

                  {/* Before Image (Original) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <Image
                      src={activeModalItem.source_image_url}
                      alt="Original Photo"
                      fill
                      className="object-cover"
                      sizes="450px"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-bold backdrop-blur-md shadow-md pointer-events-none">
                      Original Photo
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)] pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-purple-600 border-2 border-purple-500 hover:scale-110 transition-transform">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="m8 18-5-6 5-6" />
                        <path d="m16 6 5 6-5 6" />
                      </svg>
                    </div>
                  </div>

                  {/* Drag Hint */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/50 text-white/90 text-[9px] font-semibold backdrop-blur-md pointer-events-none">
                    Drag slider to compare before &amp; after
                  </div>
                </div>
              )}

              {/* SPLIT VIEW */}
              {modalViewMode === "split" && (
                <div className="w-full max-w-xl grid grid-cols-2 gap-3 max-h-[420px]">
                  <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                    <Image
                      src={activeModalItem.source_image_url}
                      alt="Before"
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold backdrop-blur-sm">
                      Original Photo
                    </div>
                  </div>
                  <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-lg border border-purple-200 bg-white">
                    <Image
                      src={activeModalItem.result_image_url}
                      alt="After"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="300px"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[9px] font-bold backdrop-blur-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-pink-300" />
                      AI Enhanced
                    </div>
                  </div>
                </div>
              )}

              {/* RESULT ONLY VIEW */}
              {modalViewMode === "result" && (
                <div className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-white">
                  <Image
                    src={activeModalItem.result_image_url}
                    alt="Enhanced"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="450px"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Credits used:</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {activeModalItem.credits_used} credits
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(activeModalItem, e)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() =>
                    handleDownload(
                      activeModalItem.result_image_url,
                      activeModalItem.tool
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-md shadow-purple-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
