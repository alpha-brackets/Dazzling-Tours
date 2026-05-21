"use client";
import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = "md",
  readonly = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "focus:outline-none transition-transform",
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 focus-visible:scale-110",
              readonly
                ? ""
                : "focus-visible:ring-2 focus-visible:ring-[var(--theme)] focus-visible:ring-offset-2 rounded-sm",
            )}
            onClick={() => handleStarClick(index)}
            disabled={readonly}
            aria-label={`Rate ${index + 1} out of ${maxStars} stars`}
            aria-pressed={isFilled}
          >
            {isHalfFilled ? (
              <StarHalf
                className={cn(
                  sizeClasses[size],
                  "text-yellow-400 fill-yellow-400",
                )}
                aria-hidden="true"
              />
            ) : (
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-none",
                )}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
