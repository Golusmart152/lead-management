import React from 'react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

interface ToggleButtonsProps {
  values: string[];
  selectedValues: string[];
  onValueChange: (value: string | string[]) => void;
  type: 'single' | 'multiple';
  className?: string;
  children?: (value: string) => React.ReactNode;
}

export const ToggleButtons: React.FC<ToggleButtonsProps> = ({
  values,
  selectedValues,
  onValueChange,
  type,
  className,
  children
}) => {
  const isActive = (value: string) =>
    type === 'single' 
      ? selectedValues.includes(value)
      : selectedValues.includes(value);

  const handleClick = (value: string) => {
    if (type === 'single') {
      onValueChange(value);
    } else {
      const newValues = isActive(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onValueChange(newValues);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {values.map((value) => (
        <Button
          key={value}
          variant={isActive(value) ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick(value)}
          className="font-normal transition-all duration-200"
        >
          {children ? children(value) : value}
        </Button>
      ))}
    </div>
  );
};