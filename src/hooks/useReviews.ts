import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/faculty';

function getCacheKey(facultyId: string) {
  return `reviews_cache_${facultyId}`;
}

function getLastFetchedKey(facultyId: string) {
  return `reviews_last_fetched_${facultyId}`;
}

function readCachedReviews(facultyId: string): Review[] {
  try {
    const raw = localStorage.getItem(getCacheKey(facultyId));
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveCachedReviews(facultyId: string, reviews: Review[]) {
  try {
    localStorage.setItem(getCacheKey(facultyId), JSON.stringify(reviews));
  } catch {
    // localStorage may be unavailable; ignore
  }
}

function readLastFetched(facultyId: string): string | null {
  return localStorage.getItem(getLastFetchedKey(facultyId));
}

function saveLastFetched(facultyId: string, timestamp: string) {
  try {
    localStorage.setItem(getLastFetchedKey(facultyId), timestamp);
  } catch {
    // localStorage may be unavailable; ignore
  }
}

export function useReviews(facultyId: string) {
  return useQuery({
    queryKey: ['reviews', facultyId],
    queryFn: async () => {
      const cached = readCachedReviews(facultyId);
      const lastFetched = readLastFetched(facultyId);
      const fetchedAt = new Date().toISOString();

      let newReviews: Review[] = [];

      if (lastFetched && cached.length > 0) {
        // Incremental fetch: only reviews newer than last fetch
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('faculty_id', facultyId)
          .gt('created_at', lastFetched)
          .order('created_at', { ascending: false });

        if (error) throw error;
        newReviews = (data as Review[]) ?? [];
      } else {
        // First visit: fetch all reviews
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('faculty_id', facultyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        newReviews = (data as Review[]) ?? [];
      }

      // Merge: deduplicate by id, sort by created_at descending
      const existingIds = new Set(cached.map((r) => r.id));
      const merged = [
        ...newReviews.filter((r) => !existingIds.has(r.id)),
        ...cached,
      ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      saveCachedReviews(facultyId, merged);
      saveLastFetched(facultyId, fetchedAt);

      return merged;
    },
    initialData: () => {
      const cached = readCachedReviews(facultyId);
      return cached.length > 0 ? cached : undefined;
    },
    enabled: !!facultyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAllReviews() {
  return useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAllReviewStats() {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('faculty_id, rating');

      if (error) throw error;

      const stats: Record<string, { total: number; sum: number; avg: number }> = {};
      
      (data as Review[]).forEach((review) => {
        if (!stats[review.faculty_id]) {
          stats[review.faculty_id] = { total: 0, sum: 0, avg: 0 };
        }
        stats[review.faculty_id].total++;
        stats[review.faculty_id].sum += review.rating;
        stats[review.faculty_id].avg = stats[review.faculty_id].sum / stats[review.faculty_id].total;
      });

      return stats;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facultyId, rating, comment }: { facultyId: string; rating: number; comment: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ facultyId, rating, comment }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.facultyId] });
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
}
