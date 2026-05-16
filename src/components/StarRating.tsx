import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, maxRating = 5, size = 'md', interactive = false, onRatingChange }, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

    return (
      <div
        ref={ref}
        className="flex gap-1"
        role={!interactive ? "img" : undefined}
        aria-label={!interactive ? `${rating} out of ${maxRating} stars` : undefined}
      >
        {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return interactive ? (
          <button
            key={index}
            type="button"
            aria-label={`${starValue} stars`}
            aria-pressed={isFilled}
            onClick={() => onRatingChange?.(starValue)}
            className={cn(
              'transition-transform hover:scale-110 cursor-pointer rounded-sm',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
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
        ) : (
          <div key={index} aria-hidden="true" className="cursor-default">
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? 'fill-rating text-rating' : 'text-rating-muted'
              )}
            />
          </div>
        );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
