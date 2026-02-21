import { format } from 'date-fns';
import { StarRating } from './StarRating';
import { Review } from '@/types/faculty';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewListProps {
  reviews: Review[] | undefined;
  isLoading: boolean;
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card/60 p-4 space-y-2">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center bg-card/40">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border border-border/50 p-4 bg-card/60 backdrop-blur-sm hover:border-border/70 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground font-mono">
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          {review.comment ? (
            <p className="text-foreground leading-relaxed text-sm">{review.comment}</p>
          ) : (
            <p className="text-muted-foreground italic text-sm">Rating only</p>
          )}
        </div>
      ))}
    </div>
  );
}
