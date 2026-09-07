import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  count?: number;
  className?: string;
}

export function StarRating({ count = 5, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-xs"
        />
      ))}
    </div>
  );
}
