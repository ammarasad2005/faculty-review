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

    if (!interactive) {
      return (
        <div
          ref={ref}
          className="flex gap-1"
          role="img"
          aria-label={`Rating: ${rating} out of ${maxRating} stars`}
        >
          {Array.from({ length: maxRating }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;

            return (
              <Star
                key={index}
                aria-hidden="true"
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled ? "fill-rating text-rating" : "text-rating-muted",
                )}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="flex gap-1"
        role="radiogroup"
        aria-label="Rate out of 5 stars"
      >
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isFilled}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              onClick={() => onRatingChange?.(starValue)}
              className={cn(
                "transition-transform hover:scale-110 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
              )}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled ? "fill-rating text-rating" : "text-rating-muted",
                )}
              />
            </button>
          );
        })}
      </div>
    );
  },
);

StarRating.displayName = "StarRating";
