import { performance } from 'perf_hooks';

interface Faculty {
  id: string;
  name: string;
  department: string;
}

const numFaculty = 100000;
const facultyList: Faculty[] = Array.from({ length: numFaculty }).map((_, i) => ({
  id: `faculty-${i}`,
  name: `Dr. Faculty Member ${i}`,
  department: i % 10 === 0 ? 'Computer Science' : `Department ${i % 10}`,
}));

const reviewCountByFaculty: Record<string, number> = {};
facultyList.forEach((f, i) => {
  reviewCountByFaculty[f.id] = i % 2; // Half have reviews
});

const facultySearch = 'Member 10';

function bench(name: string, fn: () => void) {
  const runs = 100;
  let totalTime = 0;

  // Warmup
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Benchmark
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    totalTime += (end - start);
  }

  console.log(`${name}: ${(totalTime / runs).toFixed(3)} ms per run (average over ${runs} runs)`);
}

console.log('--- Benchmarking Original Implementations ---');

bench('Original .filter().map() [Department Delete]', () => {
  const department = 'Computer Science';
  const facultyIds = facultyList
    .filter((f) => f.department === department)
    .map((f) => f.id);
  return facultyIds;
});

bench('Original .filter().filter() [Faculty Search]', () => {
  const facultyWithReviews = facultyList
    .filter((f) => reviewCountByFaculty[f.id] > 0)
    .filter((f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase())
    );
  return facultyWithReviews;
});

console.log('--- Benchmarking Optimized Implementations ---');

bench('Optimized .reduce() [Department Delete]', () => {
  const department = 'Computer Science';
  const facultyIds = facultyList.reduce((acc, f) => {
    if (f.department === department) {
      acc.push(f.id);
    }
    return acc;
  }, [] as string[]);
  return facultyIds;
});

bench('Optimized single .filter() [Faculty Search]', () => {
  const searchLower = facultySearch.toLowerCase();
  const facultyWithReviews = facultyList.filter((f) =>
    reviewCountByFaculty[f.id] > 0 &&
    (f.name.toLowerCase().includes(searchLower) ||
    f.department.toLowerCase().includes(searchLower))
  );
  return facultyWithReviews;
});
