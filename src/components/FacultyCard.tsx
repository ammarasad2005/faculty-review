import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { ProcessedFaculty } from '@/hooks/useFacultyData';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
interface FacultyCardProps {
  faculty: ProcessedFaculty;
  stats?: { total: number; avg: number };
  onClick: () => void;
  index?: number;
}

export const FacultyCard = React.forwardRef<HTMLDivElement, FacultyCardProps>(
  ({ faculty, stats, onClick, index = 0 }, ref) => {
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        ref={ref as any}
      >
      <Card
        className={cn(
          'group cursor-pointer overflow-hidden',
          'border border-border/20',
          'hover:border-primary/50',
          'hover:shadow-2xl hover:shadow-primary/20',
          'transition-all duration-500 ease-out',
          'bg-card/40 backdrop-blur-md',
          'relative'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-5 relative z-10">
        <div className="flex gap-4 sm:gap-5">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 shrink-0">
            <div className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-border group-hover:ring-primary/50 transition-all duration-500 shadow-lg">
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
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
      </motion.div>
    );
  }
);

FacultyCard.displayName = 'FacultyCard';
