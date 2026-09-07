"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Upload,
  ImageIcon,
  X,
  Eye,
  Wand2,
  Layers,
  CheckCircle2,
  RefreshCcw,
  Download,
  Sliders,
  AlertCircle,
  Coins,
  ArrowRight,
  SplitSquareVertical,
  Check,
  Columns2,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type BeautyTool = "makeup-transfer" | "makeup-tryon" | "eye-color";

interface ToolCard {
  id: BeautyTool;
  label: string;
  tag: string;
  description: string;
  image: string;
  icon: React.ElementType;
}

const BEAUTY_TOOLS: ToolCard[] = [
  {
    id: "makeup-transfer",
    label: "AI Makeup Transfer",
    tag: "Transfer Look",
    description: "Transfer a complete makeup look from any reference photo onto your face instantly.",
    image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
    icon: Layers,
  },
  {
    id: "makeup-tryon",
    label: "AI Makeup Virtual Try-On",
    tag: "Virtual Try-On",
    description: "Virtually try on lipstick, blush, eyeshadow, and full glam looks in real time.",
    image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
    icon: Wand2,
  },
  {
    id: "eye-color",
    label: "AI Eye Color Try-On",
    tag: "Eye Lenses",
    description: "Try on contact lenses and dramatically change your eye color with stunning realism.",
    image: "/ai-photo-editing-images/eye-color-try-on.webp",
    icon: Eye,
  },
];

const TEST_IMAGES = [
  { id: "girl1", src: "/normal-headshot/girl1.png", label: "Model 1" },
  { id: "girl2", src: "/normal-headshot/girl2.png", label: "Model 2" },
  { id: "boy1", src: "/normal-headshot/boy1.png", label: "Model 3" },
  { id: "girl3", src: "/normal-headshot/girl3.png", label: "Model 4" },
  { id: "girl4", src: "/normal-headshot/girl4.png", label: "Model 5" },
];

// Real YouCam templates for look-vto
const MAKEUP_TRYON_LOOKS = [
  { id: "all_blush_beauty", label: "Blush Beauty", tag: "Summer Glow", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA240904-0002/2/200602_Summer_collection_01_store_thumb.jpg" },
  { id: "all_sunkissed", label: "Sunkissed", tag: "Warm Bronze", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA240626-0018/4/240531_Summer_liveframe_look_store_thumb.jpg" },
  { id: "all_ethereal", label: "Ethereal", tag: "Radiant", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA161102-0009/15/161026_Wedding_02_store_thumb.jpg" },
  { id: "all_classic", label: "Classic", tag: "Timeless", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA161102-0009/17/161026_Wedding_01_store_thumb.jpg" },
  { id: "all_goddess", label: "Goddess", tag: "High Glam", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA190328-0070/3/181121_FW_Collection_04_store_thumb.jpg" },
  { id: "all_coral", label: "Coral", tag: "Fresh Day", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA240823-0006/23/look_thumb_12_store_thumb.jpg" },
  { id: "all_fresh", label: "Fresh Dewy", tag: "Everyday", preview: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA160513-0018/39/160518_FTP_LiYingZhao_02.jpg" },
  { id: "all_daring", label: "Daring", tag: "Evening Bold", preview: "https://cdn.perfectcorp.com/makeupstore/MSR/APP150514-0009/27/Sum_thumb_3.jpg" },
];

// Curated reference styles for makeup-transfer from user's assets
const MAKEUP_TRANSFER_LOOKS = [
  { id: "transfer_1", label: "Red Carpet Glam", tag: "Look 01", preview: "/makeup-transfer/webp_makeup_transfer_01.png" },
  { id: "transfer_2", label: "Soft Chic", tag: "Look 02", preview: "/makeup-transfer/webp_makeup_transfer_02_.png" },
  { id: "transfer_3", label: "Dewy Radiance", tag: "Look 03", preview: "/makeup-transfer/webp_makeup_transfer_03.png" },
  { id: "transfer_4", label: "Sunset Bronze", tag: "Look 04", preview: "/makeup-transfer/webp_makeup_transfer_04_21e14d1789.png" },
];

// Contact lens styles from user's eye-lens assets
const EYE_LENS_LOOKS = [
  { id: "lens_1", label: "Aqua Blue", tag: "Lens 01", preview: "/eye-lens/webp_eye_len_01.png" },
  { id: "lens_2", label: "Emerald Green", tag: "Lens 02", preview: "/eye-lens/webp_eye_len_02.png" },
  { id: "lens_3", label: "Honey Hazel", tag: "Lens 03", preview: "/eye-lens/webp_eye_len_03.png" },
  { id: "lens_4", label: "Smoky Gray", tag: "Lens 04", preview: "/eye-lens/webp_eye_len_04.png" },
  { id: "lens_5", label: "Mystic Violet", tag: "Lens 05", preview: "/eye-lens/webp_eye_len_05_a2cb4f207a.png" },
  { id: "lens_6", label: "Radiant Olive", tag: "Lens 06", preview: "/eye-lens/webp_eye_len_06_a6bc280531.png" },
];

export default function BeautyStudioPage() {
  const { user, refreshUser } = useAuth();

  const [selectedTool, setSelectedTool] = useState<BeautyTool>("makeup-tryon");
  const [sourceImage, setSourceImage] = useState<string | null>("/normal-headshot/girl1.png");
  const [sourceBase64, setSourceBase64] = useState<string | null>(null);

  // Look state
  const [selectedTryonTemplate, setSelectedTryonTemplate] = useState<string>("all_blush_beauty");
  const [selectedTransferLook, setSelectedTransferLook] = useState<string>("transfer_1");
  const [customRefBase64, setCustomRefBase64] = useState<string | null>(null);
  const [selectedLensId, setSelectedLensId] = useState<string>("lens_1");
  const [lensIntensity, setLensIntensity] = useState<number>(85);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Comparison & View State
  const [viewMode, setViewMode] = useState<"slider" | "split" | "result">("slider");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // File upload refs
  const sourceFileRef = useRef<HTMLInputElement>(null);
  const customRefInputRef = useRef<HTMLInputElement>(null);
  const [activeSourceTab, setActiveSourceTab] = useState<"test" | "upload">("test");

  const activeTool = BEAUTY_TOOLS.find((t) => t.id === selectedTool)!;

  // Handle interactive before/after drag
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
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
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

  // Handle source file upload
  const handleSourceUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSourceBase64(reader.result as string);
      setSourceImage(reader.result as string);
      setResultImage(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle custom reference upload for makeup-transfer
  const handleCustomRefUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomRefBase64(reader.result as string);
      setSelectedTransferLook("custom");
    };
    reader.readAsDataURL(file);
  };

  const handleToolChange = (id: BeautyTool) => {
    setSelectedTool(id);
    setResultImage(null);
    setErrorMessage(null);
  };

  // Main Generation Handler calling the API
  const handleGenerate = async () => {
    if (!sourceImage) return;

    // If user is not logged in, prompt sign-in to get 50 credits
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if ((user.credits ?? 0) < 5) {
      setErrorMessage("Insufficient credits. You need 5 credits for this generation.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setProgressStep("Analyzing facial features & contours...");

    try {
      let lookPayload: Record<string, unknown> = {};

      if (selectedTool === "makeup-tryon") {
        lookPayload = { templateId: selectedTryonTemplate };
      } else if (selectedTool === "makeup-transfer") {
        if (selectedTransferLook === "custom" && customRefBase64) {
          lookPayload = { referenceBase64: customRefBase64 };
        } else {
          const matched = MAKEUP_TRANSFER_LOOKS.find((l) => l.id === selectedTransferLook);
          lookPayload = { referenceUrl: matched?.preview || "/makeup-transfer/webp_makeup_transfer_01.png" };
        }
      } else if (selectedTool === "eye-color") {
        const lens = EYE_LENS_LOOKS.find((l) => l.id === selectedLensId);
        lookPayload = {
          eyeLensUrl: lens?.preview || "/eye-lens/webp_eye_len_01.png",
          intensity: lensIntensity,
          enlargement: 0,
        };
      }

      setProgressStep("Applying AI beauty transformation...");

      const payload = {
        tool: selectedTool,
        sourceImageUrl: sourceBase64 ? undefined : sourceImage,
        sourceImageBase64: sourceBase64 || undefined,
        look: lookPayload,
        userId: user.id,
      };

      const res = await fetch("/api/studio/beauty/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setProgressStep("Finalizing high-definition portrait...");
      setResultImage(data.resultUrl);
      setViewMode("slider"); // Default to slider comparison on success
      setSliderPosition(50);
      // Refresh user to update live credit count in sidebar & header
      await refreshUser();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong during generation.";
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
      setProgressStep("");
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixora-${selectedTool}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(resultImage, "_blank");
    }
  };

  return (
    <div className="flex flex-col -m-4 sm:-m-8 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      {/* Top Bar Header */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-slate-100 bg-white/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Beauty Studio</h1>
            <p className="text-[11px] text-slate-400 font-medium">{activeTool.label} • Next-Gen AI Enhancement</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Credits Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/80">
            <Coins className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-bold text-purple-900">
              {user?.credits ?? 50} <span className="text-[10px] font-medium text-purple-600">credits</span>
            </span>
            <span className="text-[10px] text-slate-400">|</span>
            <span className="text-[10px] font-semibold text-slate-500">5 credits / run</span>
          </div>

          {resultImage && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Two-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT COLUMN: Controls & Customization */}
        <div className="w-80 xl:w-96 shrink-0 flex flex-col border-r border-slate-100 bg-white overflow-y-auto">
          <div className="flex-1 px-4 py-5 space-y-6">
            {/* Step 1: Tool Selection */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-black text-[10px]">
                  1
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Feature</h2>
              </div>
              <div className="space-y-2">
                {BEAUTY_TOOLS.map((tool) => {
                  const isActive = selectedTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolChange(tool.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all duration-200 group ${
                        isActive
                          ? "border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md shadow-purple-100"
                          : "border-slate-100 bg-white hover:border-purple-200 hover:bg-purple-50/30 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 transition-all ${
                          isActive ? "ring-purple-300 shadow-md" : "ring-slate-100"
                        }`}
                      >
                        <Image src={tool.image} alt={tool.label} fill className="object-cover" sizes="56px" />
                        {isActive && (
                          <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? "text-purple-600" : "text-slate-400"}`}>
                          {tool.tag}
                        </div>
                        <div className={`text-sm font-bold truncate ${isActive ? "text-purple-700" : "text-slate-800"}`}>
                          {tool.label}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                          {tool.description}
                        </div>
                      </div>
                      <div className={`shrink-0 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`}>
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Step 2: Source Image */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-black text-[10px]">
                    2
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Source Image</h2>
                </div>
                {sourceImage && (
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setSourceBase64(null);
                      setResultImage(null);
                    }}
                    className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Source Tabs */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 mb-3">
                <button
                  onClick={() => setActiveSourceTab("test")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSourceTab === "test" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Test Images
                </button>
                <button
                  onClick={() => setActiveSourceTab("upload")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSourceTab === "upload" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Image
                </button>
              </div>

              {activeSourceTab === "test" ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {TEST_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSourceImage(img.src);
                        setSourceBase64(null);
                        setResultImage(null);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all hover:scale-[1.03] ${
                        sourceImage === img.src && !sourceBase64 ? "ring-purple-500 shadow-md" : "ring-transparent hover:ring-purple-200"
                      }`}
                    >
                      <Image src={img.src} alt={img.label} fill className="object-cover" sizes="120px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate text-center block">{img.label}</span>
                      {sourceImage === img.src && !sourceBase64 && (
                        <div className="absolute inset-0 bg-purple-500/25 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    ref={sourceFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleSourceUpload(f);
                    }}
                  />
                  {sourceBase64 ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-2 ring-purple-400 shadow-md">
                      <Image src={sourceBase64} alt="Uploaded Source" fill className="object-cover" sizes="300px" />
                      <button
                        onClick={() => sourceFileRef.current?.click()}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-bold text-slate-700 shadow-md hover:bg-white transition-colors"
                      >
                        <RefreshCcw className="w-3 h-3" />
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => sourceFileRef.current?.click()}
                      className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Drop or browse photo</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Clear front-facing portrait recommended</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="border-t border-slate-100" />

            {/* Step 3: Choose Look / Customization */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                    3
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Look</h2>
                </div>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {activeTool.tag}
                </span>
              </div>

              {/* Sub-view for Makeup Try-On (YouCam Templates) */}
              {selectedTool === "makeup-tryon" && (
                <div className="grid grid-cols-2 gap-2">
                  {MAKEUP_TRYON_LOOKS.map((look) => {
                    const isActive = selectedTryonTemplate === look.id;
                    return (
                      <button
                        key={look.id}
                        onClick={() => {
                          setSelectedTryonTemplate(look.id);
                          setResultImage(null);
                        }}
                        className={`relative flex flex-col rounded-xl overflow-hidden ring-2 transition-all hover:scale-[1.02] ${
                          isActive ? "ring-purple-500 shadow-md" : "ring-transparent hover:ring-purple-200 border border-slate-100"
                        }`}
                      >
                        <div className="relative aspect-video w-full bg-slate-100">
                          <Image src={look.preview} alt={look.label} fill unoptimized className="object-cover" sizes="140px" />
                          {isActive && (
                            <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                            </div>
                          )}
                          <span className="absolute top-1 left-1 text-[8px] font-bold uppercase tracking-wider bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                            {look.tag}
                          </span>
                        </div>
                        <div className={`px-2 py-1.5 text-[11px] font-semibold text-left ${isActive ? "bg-purple-50 text-purple-700 font-bold" : "bg-white text-slate-700"}`}>
                          {look.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sub-view for Makeup Transfer (Curated looks + Custom upload) */}
              {selectedTool === "makeup-transfer" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {MAKEUP_TRANSFER_LOOKS.map((look) => {
                      const isActive = selectedTransferLook === look.id;
                      return (
                        <button
                          key={look.id}
                          onClick={() => {
                            setSelectedTransferLook(look.id);
                            setResultImage(null);
                          }}
                          className={`relative flex flex-col rounded-xl overflow-hidden ring-2 transition-all hover:scale-[1.02] ${
                            isActive ? "ring-purple-500 shadow-md" : "ring-transparent hover:ring-purple-200 border border-slate-100"
                          }`}
                        >
                          <div className="relative aspect-square w-full bg-slate-100">
                            <Image src={look.preview} alt={look.label} fill className="object-cover" sizes="140px" />
                            {isActive && (
                              <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                              </div>
                            )}
                            <span className="absolute top-1 left-1 text-[8px] font-bold uppercase tracking-wider bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                              {look.tag}
                            </span>
                          </div>
                          <div className={`px-2 py-1.5 text-[11px] font-semibold text-left ${isActive ? "bg-purple-50 text-purple-700 font-bold" : "bg-white text-slate-700"}`}>
                            {look.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Reference Upload Option */}
                  <div className="pt-1">
                    <input
                      ref={customRefInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleCustomRefUpload(f);
                      }}
                    />
                    <button
                      onClick={() => customRefInputRef.current?.click()}
                      className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-dashed text-xs font-semibold transition-all ${
                        selectedTransferLook === "custom"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/20"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-500" />
                      {customRefBase64 ? "Custom Reference Loaded (Change)" : "Upload Custom Reference Look"}
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-view for Eye Color Try-On (6 Lenses + Intensity slider) */}
              {selectedTool === "eye-color" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {EYE_LENS_LOOKS.map((lens) => {
                      const isActive = selectedLensId === lens.id;
                      return (
                        <button
                          key={lens.id}
                          onClick={() => {
                            setSelectedLensId(lens.id);
                            setResultImage(null);
                          }}
                          className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all hover:scale-[1.03] ${
                            isActive
                              ? "border-purple-500 bg-purple-50 shadow-sm"
                              : "border-slate-100 bg-white hover:border-purple-200"
                          }`}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-inner bg-slate-50 mb-1.5 ring-2 ring-slate-100 flex items-center justify-center">
                            <Image src={lens.preview} alt={lens.label} fill className="object-contain p-1" sizes="48px" />
                            {isActive && (
                              <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center rounded-full">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">
                            {lens.label}
                          </span>
                          <span className="text-[8px] text-slate-400">{lens.tag}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Lens Intensity Slider */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-purple-500" />
                        Color Intensity
                      </span>
                      <span className="font-bold text-purple-700">{lensIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={lensIntensity}
                      onChange={(e) => setLensIntensity(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Bottom Action Footer */}
          <div className="shrink-0 p-4 border-t border-slate-100 bg-white space-y-2">
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !sourceImage}
              className={`w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                !isGenerating && sourceImage
                  ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white hover:shadow-purple-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Result (5 Credits)</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-400">
              Instant AI generation &bull; 5 credits deducted upon completion
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Result Canvas */}
        <div className="flex-1 flex flex-col bg-[#fafafc] overflow-hidden min-w-0">
          {/* Canvas Header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  resultImage
                    ? "bg-emerald-500"
                    : isGenerating
                    ? "bg-amber-500 animate-ping"
                    : "bg-purple-500"
                }`}
              />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {resultImage
                  ? "Generated Transformation"
                  : isGenerating
                  ? "Transforming Portrait..."
                  : "Preview & Result"}
              </span>
            </div>

            {resultImage && (
              <div className="flex items-center gap-2">
                {/* View Mode Switcher */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 gap-1">
                  <button
                    onClick={() => setViewMode("slider")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "slider"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Interactive Before/After Slider"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-purple-500" />
                    <span>Slider</span>
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "split"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Side-by-Side Split View"
                  >
                    <Columns2 className="w-3 h-3 text-purple-500" />
                    <span>Split</span>
                  </button>
                  <button
                    onClick={() => setViewMode("result")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "result"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Full Result View"
                  >
                    <Eye className="w-3 h-3 text-purple-500" />
                    <span>Result</span>
                  </button>
                </div>

                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  title="Regenerate with current settings"
                >
                  <RefreshCcw className="w-3 h-3 text-slate-500" />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-xs transition-all cursor-pointer"
                  title="Download Result"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Canvas Main Content */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                {/* Visual Avatar with Scanning Laser Beam */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-100 bg-slate-900">
                  {sourceImage && (
                    <Image
                      src={sourceImage}
                      alt="Source Portrait"
                      fill
                      className="object-cover opacity-85"
                      sizes="150px"
                    />
                  )}
                  {/* Glowing Laser Scan Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_12px_#ec4899] animate-[bounce_2s_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-purple-950/20" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold shrink-0 whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-pink-300 animate-spin" />
                    AI Processing
                  </div>
                </div>

                {/* Progress Detail */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">{activeTool.label}</h3>
                  <p className="text-xs text-purple-600 font-semibold animate-pulse">
                    {progressStep || "Transforming portrait with AI..."}
                  </p>
                  <p className="text-[10px] text-slate-400">Usually completes in 5–10 seconds</p>
                </div>

                {/* Progress Bar */}
                <div className="w-56 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-full animate-pulse shadow-sm" />
                </div>

                {/* Processing Steps Checklist */}
                <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-purple-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-purple-500" />
                    Facial Contours
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="flex items-center gap-1 text-purple-600 font-semibold animate-pulse">
                    <Sparkles className="w-3 h-3 text-pink-500" />
                    AI Styling
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    HD Polish
                  </span>
                </div>
              </div>
            ) : resultImage ? (
              <div className="w-full h-full max-w-2xl flex flex-col items-center justify-center gap-3 overflow-hidden">
                {/* 1. SLIDER COMPARISON MODE */}
                {viewMode === "slider" && sourceImage && (
                  <div className="flex flex-col items-center w-full">
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
                      className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-200 select-none cursor-ew-resize bg-slate-900 group"
                    >
                      {/* After Image (AI Enhanced) - Base Layer */}
                      <div className="absolute inset-0">
                        <Image
                          src={resultImage}
                          alt="AI Enhanced Result"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="420px"
                          priority
                        />
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-purple-900/80 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md pointer-events-none">
                          <Sparkles className="w-3 h-3 text-pink-300" />
                          AI Enhanced
                        </span>
                      </div>

                      {/* Before Image (Original) - Clipped Overlay */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <Image
                          src={sourceImage}
                          alt="Original Photo"
                          fill
                          className="object-cover"
                          sizes="420px"
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
                        {/* Draggable Circle Handle */}
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

                      {/* Drag Hint on top */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/50 text-white/90 text-[9px] font-semibold backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Move slider to compare before &amp; after
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SPLIT COMPARISON MODE */}
                {viewMode === "split" && sourceImage && (
                  <div className="w-full max-w-2xl grid grid-cols-2 gap-3 max-h-[360px] sm:max-h-[400px]">
                    <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                      <Image src={sourceImage} alt="Before" fill className="object-cover" sizes="300px" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold backdrop-blur-sm">
                        Original Photo
                      </div>
                    </div>
                    <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-lg border border-purple-200 bg-white">
                      <Image src={resultImage} alt="After" fill unoptimized className="object-cover" sizes="300px" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[9px] font-bold backdrop-blur-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-pink-300" />
                        AI Enhanced
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RESULT ONLY MODE */}
                {viewMode === "result" && (
                  <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/80 bg-white">
                    <Image
                      src={resultImage}
                      alt="Generated AI Beauty Look"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="450px"
                      priority
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
                      <Sparkles className="w-3 h-3 text-pink-300" />
                      {activeTool.label}
                    </div>
                  </div>
                )}

                {/* Bottom Result Action Bar */}
                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <button
                    onClick={() => setResultImage(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 text-slate-500" />
                    Try Another Look
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-md shadow-purple-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save &amp; Download Image
                  </button>
                </div>
              </div>
            ) : (
              // Empty / Ready to Generate State
              <div className="flex flex-col items-center justify-center text-center gap-4 max-w-md">
                {sourceImage ? (
                  <div className="relative w-40 h-40 mb-1">
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl ring-2 ring-purple-200 rotate-2 bg-white">
                      <Image src={sourceImage} alt="Ready" fill className="object-cover" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-300 ring-4 ring-white">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-36 h-36">
                    <div className="w-32 h-36 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 absolute -rotate-6 top-0 left-0" />
                    <div className="w-32 h-36 rounded-3xl bg-white border-2 border-dashed border-purple-200 absolute top-2 left-3 flex items-center justify-center shadow-md">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    {sourceImage ? "Photo Ready for Transformation!" : "Your result will appear here"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                    {sourceImage
                      ? `Click "Generate Result" to apply ${activeTool.label} with AI.`
                      : "Choose a source portrait from the left panel and click Generate to see the beauty transformation."}
                  </p>
                </div>

                {sourceImage && (
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate with 5 Credits
                  </button>
                )}

                <div className="mt-1 flex flex-col gap-1.5 w-full text-left max-w-xs">
                  {[
                    { num: 1, text: `Feature: ${activeTool.label}`, done: true },
                    { num: 2, text: sourceImage ? "Source photo selected" : "Select source photo", done: !!sourceImage },
                    { num: 3, text: "Look preset configured", done: true },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        step.done ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-slate-400">{step.num}</span>
                        </div>
                      )}
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Sign-In Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Claim 50 Free Credits</h3>
              <p className="text-xs text-slate-500">
                Sign in or create a free account to generate AI looks with your 50 free credits!
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                href="/signup?returnTo=/studio/beauty"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
              >
                <span>Create Free Account (Get 50 Credits)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/login?returnTo=/studio/beauty"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center hover:bg-slate-50 transition-all"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
