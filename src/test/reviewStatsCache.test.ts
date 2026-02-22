import { describe, it, expect } from "vitest";

type StatsMap = Record<string, { total: number; sum: number; avg: number }>;

// Mirrors computeStats from useReviews.ts
function computeStats(
  reviews: { faculty_id: string; rating: number }[],
  base: StatsMap = {},
): StatsMap {
  const stats: StatsMap = { ...base };
  reviews.forEach((review) => {
    if (!stats[review.faculty_id]) {
      stats[review.faculty_id] = { total: 0, sum: 0, avg: 0 };
    }
    stats[review.faculty_id].total++;
    stats[review.faculty_id].sum += review.rating;
    stats[review.faculty_id].avg =
      stats[review.faculty_id].sum / stats[review.faculty_id].total;
  });
  return stats;
}

describe("computeStats", () => {
  it("builds stats from scratch on first visit", () => {
    const reviews = [
      { faculty_id: "a", rating: 4 },
      { faculty_id: "a", rating: 2 },
      { faculty_id: "b", rating: 5 },
    ];
    const stats = computeStats(reviews);
    expect(stats["a"]).toEqual({ total: 2, sum: 6, avg: 3 });
    expect(stats["b"]).toEqual({ total: 1, sum: 5, avg: 5 });
  });

  it("merges new reviews into cached stats on subsequent visits", () => {
    const cached: StatsMap = {
      a: { total: 2, sum: 6, avg: 3 },
      b: { total: 1, sum: 5, avg: 5 },
    };
    // New reviews since last visit
    const delta = [
      { faculty_id: "a", rating: 4 },
      { faculty_id: "c", rating: 3 },
    ];
    const merged = computeStats(delta, cached);
    expect(merged["a"]).toEqual({ total: 3, sum: 10, avg: 10 / 3 });
    expect(merged["b"]).toEqual({ total: 1, sum: 5, avg: 5 }); // unchanged
    expect(merged["c"]).toEqual({ total: 1, sum: 3, avg: 3 }); // newly added
  });

  it("returns cached stats unchanged when delta is empty", () => {
    const cached: StatsMap = {
      a: { total: 2, sum: 6, avg: 3 },
    };
    const merged = computeStats([], cached);
    expect(merged).toEqual(cached);
  });

  it("returns empty stats when no reviews and no base", () => {
    expect(computeStats([])).toEqual({});
  });
});
