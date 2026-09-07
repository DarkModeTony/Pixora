import React from "react";
import { Sparkles } from "lucide-react";

interface SectionBadgeProps {
  text: string;
  icon?: boolean;
  className?: string;
}

export function SectionBadge({ text, icon = true, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-50/80 border border-purple-200/60 text-purple-600 backdrop-blur-sm shadow-xs ${className}`}
    >
      {icon && <Sparkles className="w-3.5 h-3.5 text-purple-500 fill-purple-400" />}
      <span>{text}</span>
    </div>
  );
}
