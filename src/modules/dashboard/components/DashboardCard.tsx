import React from 'react';
import { cn } from '../../../lib/utils';
import { Card } from '../../../components/ui/card';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  size?: '1' | '2' | '3' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'subtle' | 'elevated';
  interactive?: boolean;
  focusable?: boolean;
  hover?: boolean; // Backward compatibility
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className,
  size = 'md',
  variant = 'glass',
  interactive = true,
  focusable = true,
  hover = true, // Backward compatibility - default to true
  onClick,
  tabIndex,
  role,
  'aria-label': ariaLabel,
  ...props
}) => {
  // Map old size values to new ones for backward compatibility
  const sizeMap = {
    '1': 'md',
    '2': 'lg',
    '3': 'xl',
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg',
    'xl': 'xl'
  } as const;

  const mappedSize = (sizeMap[size as keyof typeof sizeMap] || 'md') as 'sm' | 'md' | 'lg' | 'xl';

  // Handle click interactions for accessibility
  const handleClick = onClick && hover ? () => {
    if (!interactive) return;
    onClick();
  } : onClick;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onClick || !hover) return;
    
    // Handle Enter and Space key presses
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'dashboard-card',
        interactive && onClick && hover && 'cursor-pointer',
        className
      )}
      variant={variant}
      size={mappedSize}
      interactive={interactive && onClick && hover}
      focusable={focusable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive && onClick && hover ? 0 : tabIndex}
      role={role || (interactive && onClick && hover ? 'button' : undefined)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Card>
  );
};

// Specialized dashboard card with enhanced hover states
export const InteractiveDashboardCard: React.FC<DashboardCardProps & {
  hoverEffect?: 'lift' | 'glow' | 'border' | 'scale';
  activeEffect?: 'press' | 'glow' | 'border';
}> = ({
  children,
  className,
  size = 'md',
  variant = 'glass',
  interactive = true,
  focusable = true,
  hoverEffect = 'lift',
  activeEffect = 'press',
  onClick,
  tabIndex,
  role,
  'aria-label': ariaLabel,
  ...props
}) => {
  // Map old size values to new ones for backward compatibility
  const sizeMap = {
    '1': 'md',
    '2': 'lg',
    '3': 'xl',
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg',
    'xl': 'xl'
  } as const;

  const mappedSize = (sizeMap[size as keyof typeof sizeMap] || 'md') as 'sm' | 'md' | 'lg' | 'xl';

  const handleClick = onClick ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick();
  } : undefined;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onClick) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'dashboard-card-interactive',
        `dashboard-card--hover-${hoverEffect}`,
        `dashboard-card--active-${activeEffect}`,
        interactive && onClick && 'cursor-pointer',
        className
      )}
      variant={variant}
      size={mappedSize}
      interactive={interactive}
      focusable={focusable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive && onClick ? 0 : tabIndex}
      role={role || (interactive && onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Card>
  );
};