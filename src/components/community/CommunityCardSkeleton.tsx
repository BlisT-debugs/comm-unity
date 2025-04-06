
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const CommunityCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-2/3 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-1"></div>
      </CardHeader>
      <CardContent>
        <div className="h-20 bg-muted animate-pulse rounded-md"></div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
        <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
      </CardFooter>
    </Card>
  );
};

export default CommunityCardSkeleton;
