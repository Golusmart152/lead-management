import React from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  Flag,
  MoreHorizontal,
  Target,
  Hash
} from 'lucide-react';
import { InteractiveDashboardCard } from './DashboardCard';
import { BookmarkButton } from './BookmarkButton';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    assignee: string;
    dueDate: string;
    estimatedHours: number;
    actualHours?: number;
    tags: string[];
    relatedLead?: string;
    createdAt: string;
  };
  onStatusChange?: (status: string) => void;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

const priorityStyles = {
  low: {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: Flag,
    iconColor: 'text-blue-400'
  },
  medium: {
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: Clock,
    iconColor: 'text-yellow-400'
  },
  high: {
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: AlertTriangle,
    iconColor: 'text-orange-400'
  },
  urgent: {
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: AlertTriangle,
    iconColor: 'text-red-400'
  }
};

const statusStyles = {
  pending: {
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    icon: Circle,
    iconColor: 'text-gray-400'
  },
  'in-progress': {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: Clock,
    iconColor: 'text-blue-400'
  },
  completed: {
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: CheckCircle,
    iconColor: 'text-green-400'
  },
  overdue: {
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: AlertTriangle,
    iconColor: 'text-red-400'
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onViewDetails
}) => {
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const priorityStyle = priorityStyles[task.priority];
  const statusStyle = statusStyles[task.status];
  const PriorityIcon = priorityStyle.icon;
  const StatusIcon = statusStyle.icon;
  
  const completionPercentage = task.actualHours && task.estimatedHours
    ? Math.min((task.actualHours / task.estimatedHours) * 100, 100)
    : 0;

  const isOverdue = task.status === 'overdue' ||
    (new Date(task.dueDate) < new Date() && task.status !== 'completed');

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'completed') {
      onStatusChange?.('pending');
    } else {
      onStatusChange?.('completed');
    }
  };

  // Use ref for progress bar width to avoid inline styles
  const progressRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${completionPercentage}%`;
    }
  }, [completionPercentage]);

  return (
    <InteractiveDashboardCard
      variant="glass"
      size="md"
      onClick={onViewDetails}
      aria-label={`View details for task ${task.title}`}
      className={cn(
        "task-card",
        isOverdue && "border-red-500/30 bg-red-500/5"
      )}
    >
      {/* Bookmark Button */}
      <div className="absolute top-4 right-4 z-10">
        <BookmarkButton
          isBookmarked={isBookmarked}
          onToggle={handleBookmarkToggle}
        />
      </div>

      <CardContent spacing="sm" className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 w-full">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words">
                <span className="block truncate">
                  {task.title}
                </span>
              </h3>
              {task.description && (
                <p className="text-sm text-gray-400 mt-1 leading-relaxed break-words">
                  <span className="line-clamp-2">
                    {task.description}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={cn('font-medium border text-xs px-2 py-1 flex-shrink-0', priorityStyle.badge)}>
            <PriorityIcon className={cn("h-3 w-3 mr-1 flex-shrink-0", priorityStyle.iconColor)} />
            <span className="truncate max-w-[80px]">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </Badge>
          <Badge className={cn('font-medium border text-xs px-2 py-1 flex-shrink-0', statusStyle.badge)}>
            <StatusIcon className={cn("h-3 w-3 mr-1 flex-shrink-0", statusStyle.iconColor)} />
            <span className="truncate max-w-[90px]">
              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
            </span>
          </Badge>
        </div>

        {/* Tags Section */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-gray-600 text-gray-300 px-2 py-0.5 flex-shrink-0"
              >
                <Hash className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[60px]">{tag}</span>
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs border-gray-600 text-gray-300 px-2 py-0.5 flex-shrink-0"
              >
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Progress Section */}
        {task.estimatedHours > 0 && (
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Target className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-400 whitespace-nowrap">Progress</span>
              </div>
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {task.actualHours || 0}h / {task.estimatedHours}h
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                ref={progressRef}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  task.status === 'completed'
                    ? "bg-green-500"
                    : isOverdue
                      ? "bg-red-500"
                      : "bg-blue-500"
                )}
              />
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-3 min-w-0">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300">
                Assigned to:
                <span className="ml-1 font-medium break-words">
                  {task.assignee}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className={cn(
                "text-gray-300",
                isOverdue && "text-red-400 font-medium"
              )}>
                Due:
                <span className="ml-1 break-words">
                  {task.dueDate}
                </span>
              </span>
            </div>
          </div>
          {task.relatedLead && (
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-4 h-4 flex-shrink-0 mt-0.5"></div>
              <div className="min-w-0 flex-1">
                <span className="text-gray-300">
                  Related to:
                  <span className="ml-1 font-medium break-words">
                    {task.relatedLead}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-gray-700/50">
          <Button
            variant={task.status === 'completed' ? "outline" : "default"}
            size="sm"
            onClick={handleStatusToggle}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </InteractiveDashboardCard>
  );
};