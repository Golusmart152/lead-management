import React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '../../lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Header Skeleton */}
      <div className="grid gap-4 border rounded-md">
        <div className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
        
        {/* Table Row Skeletons */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-t">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex items-center gap-3">
                {colIndex === 0 ? (
                  <>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-6 space-y-4 border rounded-lg", className)}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-muted rounded-lg" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export { TableSkeleton, CardSkeleton };