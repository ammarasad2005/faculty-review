import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useSubmitReview } from '@/hooks/useReviews';
import { toast } from 'sonner';

interface ReviewFormProps {
  facultyId: string;
  facultyName: string;
}

export function ReviewForm({ facultyId, facultyName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutate: submitReview, isPending } = useSubmitReview();

  const charCount = comment.length;
  // Valid if empty OR between 50-500 characters
  const isValidComment = charCount === 0 || (charCount >= 50 && charCount <= 500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Only validate comment length if user typed something
    if (charCount > 0 && !isValidComment) {
      toast.error('Comment must be between 50 and 500 characters');
      return;
    }

    submitReview(
      { facultyId, rating, comment: comment.trim() || '' },
      {
        onSuccess: () => {
          toast.success('Review submitted successfully!');
          setRating(0);
          setComment('');
        },
        onError: () => {
          toast.error('Failed to submit review. Please try again.');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl bg-primary/[0.03] border border-primary/15 dark:bg-primary/[0.05]">
      <div>
        <h3 className="font-semibold text-lg mb-2">Rate {facultyName}</h3>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="(Optional) Share your experience with this faculty member (minimum 50 characters if provided)..."
          className="min-h-[120px] resize-none rounded-xl border-border/50 bg-card/80 focus-visible:ring-primary/30 focus-visible:border-primary/50"
          maxLength={500}
        />
        <div className="flex justify-between mt-2 text-sm">
          <span
            className={
              charCount === 0
                ? 'text-muted-foreground'
                : charCount < 50
                ? 'text-destructive'
                : charCount > 500
                ? 'text-destructive'
                : 'text-muted-foreground'
            }
          >
            {charCount}/500 characters
          </span>
          {charCount > 0 && charCount < 50 && (
            <span className="text-muted-foreground">
              {50 - charCount} more needed
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || rating === 0 || !isValidComment}
        className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-end border-0 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
      >
        {isPending ? 'Submitting...' : 'Submit Anonymous Review'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your review is completely anonymous and cannot be edited or deleted once submitted.
      </p>
    </form>
  );
}
