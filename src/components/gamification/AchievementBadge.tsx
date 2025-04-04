
import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked?: boolean;
  progress?: number;
  className?: string;
}

const typeStyles = {
  bronze: 'bg-amber-700 text-amber-100 border-amber-500',
  silver: 'bg-slate-400 text-slate-100 border-slate-300',
  gold: 'bg-amber-500 text-amber-50 border-amber-400',
  platinum: 'bg-indigo-600 text-indigo-100 border-indigo-400',
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  icon,
  type,
  unlocked = false,
  progress,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center relative border-2 transition-all',
              unlocked ? typeStyles[type] : 'bg-gray-200 text-gray-400 border-gray-300',
              unlocked && 'badge-shine',
              className
            )}
          >
            {unlocked ? (
              icon || <BadgeCheck className="h-6 w-6" />
            ) : (
              <span className="text-xs font-bold">?</span>
            )}
            
            {progress !== undefined && progress < 100 && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                />
              </svg>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-2 max-w-xs">
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
          {!unlocked && progress !== undefined && (
            <div className="text-xs mt-1">{progress}% completed</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
