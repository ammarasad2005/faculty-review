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
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.5), ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="block"
      >
        <Card
          className={cn(
            'group cursor-pointer overflow-hidden h-full',
            'border-border/10',
            'bg-card/5 backdrop-blur-xl',
            'hover:border-primary/30',
            'transition-colors duration-500'
          )}
        >
          {/* Subtle gradient glow inside card on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

          <CardContent className="p-0 flex flex-col h-full relative z-10">
            {/* Image Section - Large and dominant */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted/20">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              {faculty.isHOD && (
                <Badge className="absolute top-4 right-4 z-20 text-xs tracking-wider bg-background/80 backdrop-blur-md text-primary border border-primary/20 shadow-xl uppercase font-semibold">
                  HOD
                </Badge>
              )}
            </div>
            
            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-background to-card/5">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold tracking-tight text-foreground truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-end transition-all duration-300">
                  {faculty.name}
                </h3>

                <p className="text-sm font-medium tracking-wide text-primary/80 uppercase mt-2 mb-4">
                  {faculty.department}
                </p>

                {faculty.office && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 shrink-0 text-primary/50" />
                    {faculty.office}
                  </p>
                )}
              </div>

              {/* Footer / Stats */}
              <div className="pt-4 border-t border-border/10 flex items-center justify-between mt-auto">
                {stats && stats.total > 0 ? (
                  <div className="flex flex-col gap-1">
                    <StarRating rating={Math.round(stats.avg)} size="sm" />
                    <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
                      {stats.total} Reviews
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground/60 italic">
                    No reviews yet
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

FacultyCard.displayName = 'FacultyCard';
