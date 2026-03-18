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
import { ExternalLink, Mail, ArrowUpDown, MapPin, Share2, Copy, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type SortOption = 'none' | 'highest' | 'lowest';

interface FacultyModalProps {
  faculty: ProcessedFaculty | null;
  onClose: () => void;
}

export function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  const { data: reviews, isLoading } = useReviews(faculty?.id || '');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [sortOpen, setSortOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const shareText = `Faculty Info:\nName: ${faculty.name}\nDepartment: ${faculty.department}\nOffice: ${faculty.office || 'N/A'}\nEmail: ${faculty.email}\nRating: ${avgRating > 0 ? avgRating.toFixed(1) + ' / 5.0' : 'No ratings yet'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      toast.success('Faculty info copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Faculty Info: ${faculty.name}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={!!faculty} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 border border-border/60 rounded-2xl overflow-hidden bg-card/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0 relative">
          {/* Subtle gradient header background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent pointer-events-none rounded-t-2xl" />

          <div className="absolute top-4 right-12 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWhatsAppShare} className="gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span>Share to WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailShare} className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Share via Email</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
