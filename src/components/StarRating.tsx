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
        {...(!interactive && {
          role: 'img',
          'aria-label': `${rating} out of ${maxRating} stars`,
        })}
      >
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={cn(
                'transition-transform',
                interactive &&
                  'hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm',
                !interactive && 'cursor-default'
              )}
              {...(interactive && {
                'aria-label': `Rate ${starValue} stars`,
                'aria-pressed': isFilled,
              })}
              {...(!interactive && {
                'aria-hidden': 'true',
                tabIndex: -1,
              })}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFilled ? 'fill-rating text-rating' : 'text-rating-muted'
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
