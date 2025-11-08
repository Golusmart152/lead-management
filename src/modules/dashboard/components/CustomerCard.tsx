import React from 'react';
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Star,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { InteractiveDashboardCard } from './DashboardCard';
import { BookmarkButton } from './BookmarkButton';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    totalSpent: number;
    lastPurchase: string;
    lifetimeValue: number;
    satisfactionScore: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    purchases: number;
    avatar?: string;
  };
  onContact?: () => void;
  onViewDetails?: () => void;
}

const tierStyles = {
  bronze: {
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    stars: 'text-orange-400'
  },
  silver: {
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    stars: 'text-gray-400'
  },
  gold: {
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    stars: 'text-yellow-400'
  },
  platinum: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    stars: 'text-purple-400'
  }
};

const tierStars = {
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4
};

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onContact,
  onViewDetails
}) => {
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const tierStyle = tierStyles[customer.tier];
  const tierStarCount = tierStars[customer.tier];

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <InteractiveDashboardCard
      variant="glass"
      size="md"
      onClick={onViewDetails}
      aria-label={`View details for ${customer.name}`}
      className="customer-card"
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg flex-shrink-0">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="font-semibold">
                  {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words">
                <span className="block">
                  {customer.name}
                </span>
              </h3>
              <div className="flex items-center gap-2 mt-1 min-w-0">
                <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-400 truncate min-w-0 flex-1">
                  {customer.company}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1 min-w-0">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-400 break-words">
                  {customer.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tier and Star Rating */}
        <div className="flex items-center justify-between gap-2">
          <Badge className={cn('font-medium border text-xs px-2 py-1 flex-shrink-0', tierStyle.badge)}>
            <span className="truncate">
              {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)} Customer
            </span>
          </Badge>
          <div className="flex items-center gap-1 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < tierStarCount
                    ? `fill-current ${tierStyle.stars}`
                    : "text-gray-600"
                )}
              />
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-3 min-w-0">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300 break-all">
                {customer.email}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300 break-all">
                {customer.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div>
            <div className="flex items-center gap-2 mb-1 min-w-0">
              <DollarSign className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-gray-400">Total Spent</p>
            </div>
            <p className="text-lg font-bold text-emerald-400 break-words">
              ${customer.totalSpent.toLocaleString()}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 min-w-0">
              <ShoppingCart className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-gray-400">Purchases</p>
            </div>
            <p className="text-lg font-bold text-white">
              {customer.purchases}
            </p>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Satisfaction Score</span>
            <span className="text-sm font-medium text-white whitespace-nowrap">
              {customer.satisfactionScore}%
            </span>
          </div>
          <Progress
            value={customer.satisfactionScore}
            className="h-2 bg-gray-800"
          />
        </div>

        {/* Last Purchase */}
        <div className="flex items-start gap-3 min-w-0 text-sm">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-gray-300">
              Last purchase:
              <span className="ml-1 break-words">
                {customer.lastPurchase}
              </span>
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            size="sm"
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