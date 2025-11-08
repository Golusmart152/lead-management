import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  Clock,
  TrendingUp,
  Globe
} from 'lucide-react';
import { InteractiveDashboardCard } from './DashboardCard';
import { BookmarkButton } from './BookmarkButton';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

interface LeadCardProps {
  lead: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    value: number;
    status: 'hot' | 'warm' | 'cold' | 'qualified';
    source: string;
    location: string;
    lastContact: string;
    avatar?: string;
  };
  onContact?: () => void;
  onViewDetails?: () => void;
  onUpdateStatus?: (status: string) => void;
}

const statusStyles = {
  hot: {
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: TrendingUp,
    iconColor: 'text-red-400'
  },
  warm: {
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: Calendar,
    iconColor: 'text-yellow-400'
  },
  cold: {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: Clock,
    iconColor: 'text-blue-400'
  },
  qualified: {
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: DollarSign,
    iconColor: 'text-green-400'
  }
};

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onContact,
  onViewDetails
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const statusStyle = statusStyles[lead.status];
  const StatusIcon = statusStyle.icon;

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <InteractiveDashboardCard
      variant="glass"
      size="md"
      onClick={onViewDetails}
      aria-label={`View details for lead ${lead.name}`}
      className="lead-card"
    >
      {/* Bookmark Button */}
      <div className="absolute top-4 right-4 z-10">
        <BookmarkButton
          isBookmarked={isBookmarked}
          onToggle={handleBookmarkToggle}
        />
      </div>

      <CardContent spacing="md" className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 w-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
              {lead.avatar ? (
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="font-semibold">
                  {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight break-words">
                <span className="block">
                  {lead.name}
                </span>
              </h3>
              <div className="flex items-center gap-2 mt-2 min-w-0">
                <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-400 truncate min-w-0 flex-1">
                  {lead.company}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 min-w-0">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-400 break-words">
                  {lead.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Source Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={cn('font-medium border text-sm px-3 py-1.5 flex-shrink-0', statusStyle.badge)}>
            <StatusIcon className={cn("h-4 w-4 mr-1.5 flex-shrink-0", statusStyle.iconColor)} />
            <span className="truncate max-w-[80px]">
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </span>
          </Badge>
          <Badge variant="outline" className="text-sm border-gray-600 text-gray-300 px-3 py-1.5 flex-shrink-0">
            <Globe className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate max-w-[90px]">
              {lead.source}
            </span>
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex items-start gap-3 min-w-0">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300 break-all">
                {lead.email}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300 break-all">
                {lead.phone}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300">
                Last contact:
                <span className="ml-1 break-words">
                  {lead.lastContact}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Lead Value Section */}
        <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg flex-shrink-0">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-400 mb-1">Potential Value</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 break-words">
                ${lead.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-700/50">
          <Button
            variant="outline"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              onContact?.();
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button
            size="default"
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