import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { ProcessedFaculty } from '@/hooks/useFacultyData';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
interface FacultyCardProps {
  faculty: ProcessedFaculty;
  stats?: { total: number; avg: number };
  onClick: () => void;
  index?: number;
}

export const FacultyCard = React.forwardRef<HTMLDivElement, FacultyCardProps>(
  ({ faculty, stats, onClick, index = 0 }, ref) => {
    // Stagger delay: 50ms per card, max 500ms
    const delay = Math.min(index * 50, 500);
    
    return (
      <Card
        ref={ref}
        className={cn(
          'group cursor-pointer overflow-hidden',
          'border border-border/60',
          'hover:border-primary/40',
          'hover:shadow-xl hover:shadow-primary/[0.12]',
          'hover:-translate-y-1',
          'transition-all duration-300',
          'bg-card/95 backdrop-blur-sm',
          'opacity-0 animate-fade-in'
        )}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        onClick={onClick}
      >
      <CardContent className="p-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
            <div className="w-full h-full rounded-2xl overflow-hidden ring-2 ring-primary/15 bg-muted shadow-sm">
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                {faculty.name}
              </h3>
              {faculty.isHOD && (
                <Badge className="shrink-0 text-xs bg-gradient-to-r from-primary to-primary-end text-primary-foreground border-0 shadow-sm">
                  HOD
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {faculty.department}
            </p>
            
            {faculty.office && (
              <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {faculty.office}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              {stats && stats.total > 0 ? (
                <>
                  <StarRating rating={Math.round(stats.avg)} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    ({stats.total})
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground/60 italic">
                  No reviews yet
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      </Card>
    );
  }
);

FacultyCard.displayName = 'FacultyCard';
