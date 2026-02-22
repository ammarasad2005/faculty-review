import { describe, it, expect } from "vitest";

// Mirrors the sort used in filteredFaculty inside Index.tsx
function sortFaculty(
  faculty: { id: string }[],
  reviewStats: Record<string, { avg: number; total: number }> | undefined,
) {
  return [...faculty].sort((a, b) => {
    const avgA = reviewStats?.[a.id]?.avg ?? 0;
    const avgB = reviewStats?.[b.id]?.avg ?? 0;
    const totalA = reviewStats?.[a.id]?.total ?? 0;
    const totalB = reviewStats?.[b.id]?.total ?? 0;
    return avgB - avgA || totalB - totalA;
  });
}

describe("faculty sort order", () => {
  const faculty = [
    { id: "a" }, // avg 3.0, 10 reviews
    { id: "b" }, // avg 4.5, 2 reviews
    { id: "c" }, // unrated
    { id: "d" }, // avg 4.5, 5 reviews (same avg as b, more reviews)
    { id: "e" }, // avg 1.0, 1 review
  ];

  const stats = {
    a: { avg: 3.0, total: 10 },
    b: { avg: 4.5, total: 2 },
    d: { avg: 4.5, total: 5 },
    e: { avg: 1.0, total: 1 },
  };

  it("sorts rated faculty highest first, unrated last", () => {
    const sorted = sortFaculty(faculty, stats);
    const ids = sorted.map((f) => f.id);
    // d (4.5, 5) before b (4.5, 2), then a (3.0), e (1.0), c (unrated)
    expect(ids).toEqual(["d", "b", "a", "e", "c"]);
  });

  it("places all unrated faculty after all rated faculty", () => {
    const sorted = sortFaculty(faculty, stats);
    const unratedIndex = sorted.findIndex((f) => f.id === "c");
    const lowestRatedIndex = sorted.findIndex((f) => f.id === "e");
    expect(unratedIndex).toBeGreaterThan(lowestRatedIndex);
  });

  it("breaks ties by total reviews descending", () => {
    const sorted = sortFaculty(faculty, stats);
    const dIndex = sorted.findIndex((f) => f.id === "d");
    const bIndex = sorted.findIndex((f) => f.id === "b");
    expect(dIndex).toBeLessThan(bIndex);
  });

  it("returns original order when reviewStats is undefined (no flash of sorted content)", () => {
    const sorted = sortFaculty(faculty, undefined);
    expect(sorted.map((f) => f.id)).toEqual(["a", "b", "c", "d", "e"]);
  });
});
