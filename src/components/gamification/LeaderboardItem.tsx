
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PointsBadge from './PointsBadge';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  points: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  className?: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  points,
  avatarUrl,
  isCurrentUser = false,
  className,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const rankColors = {
    1: 'bg-amber-500 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-amber-700 text-white',
  };

  return (
    <div 
      className={cn(
        'flex items-center p-3 rounded-lg gap-3',
        isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50',
        className
      )}
    >
      <div 
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
          rankColors[rank as keyof typeof rankColors] || 'bg-muted text-muted-foreground'
        )}
      >
        {rank}
      </div>
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
          {name}
        </p>
      </div>
      
      <PointsBadge points={points} />
    </div>
  );
};

export default LeaderboardItem;
