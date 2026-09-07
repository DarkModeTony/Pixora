import React from "react";
import Image from "next/image";
import { SectionBadge } from "./shared/SectionBadge";
import { StarRating } from "./shared/StarRating";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aditi Sharma",
    role: "Content Creator",
    avatar: "/images/skin-face.jpg",
    quote:
      "“The AI retouching is insanely good! Makes my photos look natural and stunning at the same time.”",
  },
  {
    name: "Rohan Mehta",
    role: "Fashion Enthusiast",
    avatar: "/images/fashion-man.jpg",
    quote:
      "“Virtual try-on is a game changer. I can style outfits before buying — super helpful!”",
  },
  {
    name: "Neha Kapoor",
    role: "Photographer",
    avatar: "/images/hero-main.jpg",
    quote:
      "“All the editing tools I need in one app. Fast, easy and professional results.”",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto space-y-4">
          <SectionBadge text="TRUSTED WORLDWIDE" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Loved by Creators, Fashion Lovers <br className="hidden sm:inline" />
            and Everyday Users
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Join millions who are already creating their best photos with Pixora.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-14 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top User Info */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-100 shadow-xs">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 font-normal leading-relaxed mb-6 italic">
                {t.quote}
              </p>

              {/* Stars */}
              <div className="pt-2 border-t border-slate-50">
                <StarRating count={5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
