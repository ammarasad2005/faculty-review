import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { SearchFilter } from '@/components/SearchFilter';
import { PageTransition } from '@/components/PageTransition';
import { FacultyCard } from '@/components/FacultyCard';
import { FacultyCarousel } from '@/components/FacultyCarousel';
import { FacultyListCompact } from '@/components/FacultyListCompact';
import { FacultyModal } from '@/components/FacultyModal';
import { useFacultyData, ProcessedFaculty } from '@/hooks/useFacultyData';
import { useAllReviewStats } from '@/hooks/useReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type SortOrder = 'none' | 'highest' | 'lowest';

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const Index = () => {
  const { faculty, departments, loading, error } = useFacultyData();
  const { data: reviewStats, isLoading: statsLoading } = useAllReviewStats();
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState<ProcessedFaculty | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'carousel' | 'list'>(() => {
    const saved = localStorage.getItem('facultyViewMode');
    return saved === 'list' ? 'list' : 'carousel';
  });

  // Persist view preference
  useEffect(() => {
    localStorage.setItem('facultyViewMode', mobileViewMode);
  }, [mobileViewMode]);

  const filteredFaculty = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return faculty.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(query);
      const matchesDepartment =
        selectedDepartment === 'all' || member.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [faculty, searchQuery, selectedDepartment]);

  // Reset to page 1 (and sort) when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSortOrder('none');
  }, [searchQuery, selectedDepartment]);

  const sortedFaculty = useMemo(() => {
    if (sortOrder === 'none') return filteredFaculty;
    const sorted = [...filteredFaculty];
    if (sortOrder === 'highest') {
      return sorted.sort((a, b) => {
        const aAvg = reviewStats?.[a.id]?.avg ?? -1;
        const bAvg = reviewStats?.[b.id]?.avg ?? -1;
        return bAvg - aAvg;
      });
    }
    // lowest
    return sorted.sort((a, b) => {
      const aAvg = reviewStats?.[a.id]?.avg ?? Infinity;
      const bAvg = reviewStats?.[b.id]?.avg ?? Infinity;
      return aAvg - bAvg;
    });
  }, [filteredFaculty, sortOrder, reviewStats]);

  const totalPages = Math.ceil(sortedFaculty.length / pageSize);
  
  const paginatedFaculty = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFaculty.slice(start, start + pageSize);
  }, [sortedFaculty, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('ellipsis');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  const scaleMission = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1]);
  const opacityMission = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const scrollToDirectory = () => {
    const directory = document.getElementById('faculty-directory');
    if (directory) {
      directory.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background text-foreground font-sans">
      {/* Deep dark cinematic background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary-end/[0.02] rounded-full blur-[100px]" />
      </div>

      <Header
        totalFaculty={faculty.length}
        totalDepartments={departments.length}
        faculty={faculty}
        onFacultyClick={setSelectedFaculty}
      />

      {/* Cinematic Hero Section */}
      <motion.section
        style={{ opacity: opacityHero, y: yHero }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-center max-w-5xl z-10"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
            <span className="text-sm font-medium tracking-widest text-primary uppercase">The pursuit of excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-8">
            Shape the Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-end to-primary bg-300% animate-gradient">
              Education.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12">
            An uncompromising, anonymous platform to evaluate, elevate, and empower the academic standards of FAST-NUCES.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold glow-primary"
              onClick={scrollToDirectory}
            >
              Explore Faculty
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToDirectory}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-primary/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* The "Why" / Narrative Section */}
      <section className="relative py-32 px-4 overflow-hidden border-t border-border/10 bg-background/50">
        <motion.div
          style={{ scale: scaleMission, opacity: opacityMission }}
          className="container max-w-4xl text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Why anonymity <span className="italic font-serif text-primary">matters</span>.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-16">
            We believe that true transparency requires a safe space. By removing the fear of retaliation, we unlock honest, constructive feedback that drives real change in our academic environment. Your voice is powerful, and here, it is protected.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border/20">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-6xl font-black text-primary mb-2">{faculty.length}</span>
              <span className="text-sm tracking-widest text-muted-foreground uppercase">Faculty Members</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-6xl font-black text-primary mb-2">{departments.length}</span>
              <span className="text-sm tracking-widest text-muted-foreground uppercase">Departments</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center">
              <span className="text-4xl md:text-6xl font-black text-primary mb-2">100%</span>
              <span className="text-sm tracking-widest text-muted-foreground uppercase">Anonymous</span>
            </div>
          </div>
        </motion.div>
      </section>

      <main id="faculty-directory" className="container py-24 min-h-screen">
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-2">Faculty Directory</h3>
          <p className="text-muted-foreground">Find and review your instructors.</p>
        </div>

        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />

        {(loading || statsLoading) ? (
          <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-card/80 p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 shrink-0 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                    <Skeleton className="h-4 w-1/3 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mt-4 mb-4 flex-wrap">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedFaculty.length} of {sortedFaculty.length} faculty members
                {sortedFaculty.length !== faculty.length && ` (filtered from ${faculty.length})`}
              </p>
              
              <div className="flex items-center gap-2">
                {/* Sort popover */}
                <Popover open={sortOpen} onOpenChange={setSortOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 gap-1.5 rounded-xl border-border/50 bg-card/80 text-sm ${sortOrder !== 'none' ? 'border-primary/40 text-primary' : ''}`}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      {sortOrder === 'none' ? 'Sort' : sortOrder === 'highest' ? 'Sort: High→Low' : 'Sort: Low→High'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-44 p-1.5 rounded-xl border-border/50 bg-card/95 backdrop-blur-sm z-50"
                    align="end"
                  >
                    <button
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 ${sortOrder === 'highest' ? 'text-primary font-medium bg-primary/5' : ''}`}
                      onClick={() => { setSortOrder('highest'); setSortOpen(false); }}
                    >
                      High to Low
                    </button>
                    <button
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 ${sortOrder === 'lowest' ? 'text-primary font-medium bg-primary/5' : ''}`}
                      onClick={() => { setSortOrder('lowest'); setSortOpen(false); }}
                    >
                      Low to High
                    </button>
                    {sortOrder !== 'none' && (
                      <>
                        <Separator className="my-1 opacity-50" />
                        <button
                          className="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 text-muted-foreground"
                          onClick={() => { setSortOrder('none'); setSortOpen(false); }}
                        >
                          Clear Sort
                        </button>
                      </>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Mobile view toggle */}
                {isMobile && (
                  <div className="flex border border-border/50 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
                    <Button
                      variant={mobileViewMode === 'carousel' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 px-2 rounded-none"
                      onClick={() => setMobileViewMode('carousel')}
                      aria-label="Carousel view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={mobileViewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 px-2 rounded-none border-l border-border/50"
                      onClick={() => setMobileViewMode('list')}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <span className="text-sm text-muted-foreground hidden sm:inline">Per page:</span>
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[70px] h-8 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-sm">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isMobile ? (
              mobileViewMode === 'carousel' ? (
                <FacultyCarousel
                  faculty={paginatedFaculty}
                  reviewStats={reviewStats}
                  onFacultyClick={setSelectedFaculty}
                />
              ) : (
                <FacultyListCompact
                  faculty={paginatedFaculty}
                  reviewStats={reviewStats}
                  onFacultyClick={setSelectedFaculty}
                />
              )
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedFaculty.map((member, index) => (
                  <FacultyCard
                    key={member.id}
                    faculty={member}
                    stats={reviewStats?.[member.id]}
                    onClick={() => setSelectedFaculty(member)}
                    index={index}
                  />
                ))}
              </div>
            )}

            {sortedFaculty.length === 0 && (
              <div className="text-center py-14 rounded-2xl border border-dashed border-border/50 mt-6 bg-card/40 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-primary/60" />
                </div>
                <p className="font-medium text-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No faculty members found matching your criteria.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getPageNumbers().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page
                        ? 'h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary-end border-0 shadow-md shadow-primary/20'
                        : 'h-8 w-8 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all'
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <FacultyModal
        faculty={selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
      />

      <footer className="border-t border-border/30 py-8 mt-12 bg-gradient-to-t from-primary/[0.05] via-transparent to-transparent">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-medium">Anonymous Faculty Review System • FAST-NUCES Islamabad</p>
          <p className="mt-1.5 text-muted-foreground/70">Reviews are completely anonymous and cannot be traced back to users.</p>
        </div>
      </footer>
    </PageTransition>
  );
};

export default Index;
