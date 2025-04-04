
import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs h-5 px-1.5',
  md: 'text-sm h-6 px-2',
  lg: 'text-base h-8 px-3',
};

const PointsBadge: React.FC<PointsBadgeProps> = ({
  points,
  size = 'md',
  showIcon = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center font-medium bg-gradient-to-r from-amber-500 to-amber-300 text-white rounded-full',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Trophy className={cn('mr-1', size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5')} />}
      <span>{points}</span>
    </div>
  );
};

export default PointsBadge;
