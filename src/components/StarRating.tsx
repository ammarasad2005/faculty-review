import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  ariaLabel?: string;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, maxRating = 5, size = 'md', interactive = false, ariaLabel = "Rate item", onRatingChange }, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

    if (!interactive) {
      return (
        <div
          ref={ref}
          className="flex gap-1"
          role="img"
          aria-label={`${rating} out of ${maxRating} stars`}
        >
          {Array.from({ length: maxRating }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;

            return (
              <div
                key={index}
                aria-hidden="true"
                className="cursor-default"
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    'transition-colors',
                    isFilled ? 'fill-rating text-rating' : 'text-rating-muted'
                  )}
                />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="flex gap-1"
        role="group"
        aria-label={ariaLabel}
      >
        {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onRatingChange?.(starValue)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            aria-pressed={isFilled}
            className={cn(
              'transition-transform hover:scale-110 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                isFilled ? 'fill-rating text-rating' : 'text-rating-muted'
              )}
            />
          </button>
        );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
