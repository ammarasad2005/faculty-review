import { useState, useMemo, useEffect } from 'react';
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
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [mobileViewMode, setMobileViewMode] = useState<'carousel' | 'list'>(() => {
    const saved = localStorage.getItem('facultyViewMode');
    return saved === 'list' ? 'list' : 'carousel';
  });

  // Persist view preference
  useEffect(() => {
    localStorage.setItem('facultyViewMode', mobileViewMode);
  }, [mobileViewMode]);

  const filteredFaculty = useMemo(() => {
    return faculty
      .filter((member) => {
        const matchesSearch = member.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesDepartment =
          selectedDepartment === 'all' || member.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => {
        const avgA = reviewStats?.[a.id]?.avg ?? 0;
        const avgB = reviewStats?.[b.id]?.avg ?? 0;
        const totalA = reviewStats?.[a.id]?.total ?? 0;
        const totalB = reviewStats?.[b.id]?.total ?? 0;
        return avgB - avgA || totalB - totalA;
      });
  }, [faculty, searchQuery, selectedDepartment, reviewStats]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment]);

  const totalPages = Math.ceil(filteredFaculty.length / pageSize);
  
  const paginatedFaculty = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFaculty.slice(start, start + pageSize);
  }, [filteredFaculty, currentPage, pageSize]);

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

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Aurora background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-end/[0.04] rounded-full blur-3xl" />
      </div>

      <Header
        totalFaculty={faculty.length}
        totalDepartments={departments.length}
        faculty={faculty}
        onFacultyClick={setSelectedFaculty}
      />

      <main className="container py-6">
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
                Showing {paginatedFaculty.length} of {filteredFaculty.length} faculty members
                {filteredFaculty.length !== faculty.length && ` (filtered from ${faculty.length})`}
              </p>
              
              <div className="flex items-center gap-2">
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

            {filteredFaculty.length === 0 && (
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
