
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  community: string;
  communityId: string;
  status: 'open' | 'in-progress' | 'completed';
  upvotes: number;
  comments: number;
  contributors: number;
  progress: number;
  createdAt: string;
  className?: string;
}

const statusStyles = {
  'open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'completed': 'bg-green-100 text-green-800 border-green-200',
};

const IssueCard: React.FC<IssueCardProps> = ({
  id,
  title,
  description,
  category,
  community,
  communityId,
  status,
  upvotes,
  comments,
  contributors,
  progress,
  createdAt,
  className,
}) => {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("font-normal", statusStyles[status])}>
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Link 
            to={`/community/${communityId}`} 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {community}
          </Link>
        </div>
        <Link to={`/issue/${id}`} className="text-lg font-bold hover:text-primary transition-colors mt-2">
          {title}
        </Link>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          <Badge variant="outline">{category}</Badge>
        </div>
        
        {status !== 'open' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="flex w-full justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-muted-foreground">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{comments}</span>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            <span>{contributors} contributors</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
