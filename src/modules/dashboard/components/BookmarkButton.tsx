import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'rounded-full hover:bg-muted transition-colors h-8 w-8',
        className
      )}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-blue-600" />
      ) : (
        <Bookmark className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};