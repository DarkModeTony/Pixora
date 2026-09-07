import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  colorClass: string;
  btnBg: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "skin-face",
    title: "Skin & Face",
    description: "Clear skin, natural beauty enhancements",
    image: "/images/skin-face.jpg",
    colorClass: "from-orange-100/60 to-amber-50/40",
    btnBg: "bg-orange-400 text-white hover:bg-orange-500",
  },
  {
    id: "fashion",
    title: "Fashion",
    description: "Refresh your style with AI",
    image: "/images/fashion-man.jpg",
    colorClass: "from-emerald-100/60 to-teal-50/40",
    btnBg: "bg-teal-400 text-white hover:bg-teal-500",
  },
  {
    id: "virtual-try-on",
    title: "Virtual Try-On",
    description: "See it on you, before you buy",
    image: "/images/tryon-outfit.jpg",
    colorClass: "from-sky-100/60 to-blue-50/40",
    btnBg: "bg-sky-400 text-white hover:bg-sky-500",
  },
  {
    id: "hair-beard",
    title: "Hair & Beard",
    description: "Try new styles instantly",
    image: "/images/hair-beard.jpg",
    colorClass: "from-cyan-100/60 to-indigo-50/40",
    btnBg: "bg-cyan-400 text-white hover:bg-cyan-500",
  },
  {
    id: "image-editing",
    title: "Image Editing",
    description: "Remove, replace, create anything",
    image: "/images/creative-edit.jpg",
    colorClass: "from-pink-100/60 to-rose-50/40",
    btnBg: "bg-pink-500 text-white hover:bg-pink-600",
  },
];

export function FeatureCategories() {
  return (
    <section id="features" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-white rounded-3xl p-3 border border-slate-100/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Image Preview Container */}
              <div
                className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br ${cat.colorClass}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-106 transition-transform duration-500"
                />
              </div>

              {/* Card Meta Content */}
              <div className="p-2.5 pt-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Circular Action Button */}
                <div className="pt-4 flex items-center justify-start">
                  <Link
                    href={`/editor?category=${cat.id}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${cat.btnBg} shadow-xs group-hover:scale-110`}
                    aria-label={`Try ${cat.title}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
