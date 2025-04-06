
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const IssueCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded"></div>
        <div className="flex gap-2 mt-1">
          <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-16 bg-muted animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-full bg-muted animate-pulse rounded-md mb-2"></div>
        <div className="h-2 w-full bg-muted animate-pulse rounded-md"></div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <div className="flex gap-2">
          <div className="h-5 w-10 bg-muted animate-pulse rounded"></div>
          <div className="h-5 w-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
      </CardFooter>
    </Card>
  );
};

export default IssueCardSkeleton;
