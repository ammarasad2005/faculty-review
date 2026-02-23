import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { useReviews } from '@/hooks/useReviews';
import { ProcessedFaculty } from '@/hooks/useFacultyData';
import { ExternalLink, Mail, ArrowUpDown, MapPin } from 'lucide-react';

type SortOption = 'none' | 'highest' | 'lowest';

interface FacultyModalProps {
  faculty: ProcessedFaculty | null;
  onClose: () => void;
}

export function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  const { data: reviews, isLoading } = useReviews(faculty?.id || '');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [sortOpen, setSortOpen] = useState(false);

  const sortedReviews = useMemo(() => {
    if (!reviews) return undefined;
    if (sortBy === 'none') return reviews;

    const sorted = [...reviews];
    return sorted.sort((a, b) =>
      sortBy === 'highest' ? b.rating - a.rating : a.rating - b.rating
    );
  }, [reviews, sortBy]);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setSortOpen(false);
  };

  const sortLabel: Record<SortOption, string> = {
    none: '',
    highest: ': High to Low',
    lowest: ': Low to High',
  };

  if (!faculty) return null;

  const totalReviews = reviews?.length || 0;
  const avgRating =
    totalReviews > 0 ? reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  return (
    <Dialog open={!!faculty} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 border border-border/60 rounded-2xl overflow-hidden bg-card/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0 relative">
          {/* Subtle gradient header background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent pointer-events-none rounded-t-2xl" />
          <div className="flex gap-4 relative">
            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/20 bg-muted shadow-md">
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <DialogTitle className="text-xl font-bold">
                  {faculty.name}
                </DialogTitle>
                {faculty.isHOD && (
                  <Badge className="bg-gradient-to-r from-primary to-primary-end text-primary-foreground border-0 shadow-sm">
                    Head of Department
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mt-1">{faculty.department}</p>
              <p className="text-sm text-muted-foreground">{faculty.school}</p>
              
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({totalReviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4 text-sm flex-wrap relative">
            {faculty.office && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground px-2.5 py-1 rounded-full bg-muted/50 border border-border/40">
                <MapPin className="w-3.5 h-3.5 text-primary/60" />
                {faculty.office}
              </span>
            )}
            <a
              href={`mailto:${faculty.email}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary px-2.5 py-1 rounded-full bg-muted/50 border border-border/40 hover:border-primary/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {faculty.email}
            </a>
            <a
              href={faculty.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary px-2.5 py-1 rounded-full bg-muted/50 border border-border/40 hover:border-primary/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Profile
            </a>
          </div>
        </DialogHeader>

        <Separator className="my-4 opacity-50" />

        <ScrollArea className="max-h-[50vh] px-6 pb-6">
          <div className="space-y-6">
            <ReviewForm facultyId={faculty.id} facultyName={faculty.name} />
            
            <div>
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <h3 className="font-semibold text-lg">
                  Reviews {totalReviews > 0 && `(${totalReviews})`}
                </h3>
                {totalReviews > 1 && (
                  <Popover open={sortOpen} onOpenChange={setSortOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 gap-1.5 rounded-xl border-border/50 bg-card/80 text-sm ${sortBy !== 'none' ? 'border-primary/40 text-primary' : ''}`}
                      >
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort{sortLabel[sortBy]}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-44 p-1.5 rounded-xl border-border/50 bg-card/95 backdrop-blur-sm z-50"
                      align="end"
                    >
                      <button
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 ${sortBy === 'lowest' ? 'text-primary font-medium bg-primary/5' : ''}`}
                        onClick={() => handleSortChange('lowest')}
                      >
                        Low to High
                      </button>
                      <button
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 ${sortBy === 'highest' ? 'text-primary font-medium bg-primary/5' : ''}`}
                        onClick={() => handleSortChange('highest')}
                      >
                        High to Low
                      </button>
                      {sortBy !== 'none' && (
                        <>
                          <Separator className="my-1 opacity-50" />
                          <button
                            className="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-muted/60 text-muted-foreground"
                            onClick={() => handleSortChange('none')}
                          >
                            Clear Sort
                          </button>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <ReviewList reviews={sortedReviews} isLoading={isLoading} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
