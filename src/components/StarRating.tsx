import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    { rating, maxRating = 5, size = "md", interactive = false, onRatingChange },
    ref,
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-7 h-7",
    };

    return (
      <div
        ref={ref}
        className="flex gap-1"
        role={interactive ? "group" : "img"}
        aria-label={
          interactive ? "Rate" : `${rating} out of ${maxRating} stars`
        }
      >
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          const StarIcon = (
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled ? "fill-rating text-rating" : "text-rating-muted",
              )}
            />
          );

          if (!interactive) {
            return (
              <div key={index} aria-hidden="true">
                {StarIcon}
              </div>
            );
          }

          return (
            <button
              key={index}
              type="button"
              aria-label={`Rate ${starValue} stars`}
              aria-pressed={isFilled}
              onClick={() => onRatingChange?.(starValue)}
              className={cn(
                "transition-transform hover:scale-110 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              {StarIcon}
            </button>
          );
        })}
      </div>
    );
  },
);

StarRating.displayName = "StarRating";
