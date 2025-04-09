
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  categories: string[];
  imageUrl?: string;
  joined?: boolean;
  className?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  name,
  description,
  memberCount,
  categories,
  imageUrl,
  joined = false,
  className,
}) => {
  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <div 
        className="h-32 w-full bg-gradient-to-r from-socio-blue to-socio-darkgreen relative"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {joined && (
          <Badge className="absolute top-2 right-2 bg-white/80 text-primary hover:bg-white/90">
            Joined
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <Link to={`/community/${id}`} className="text-xl font-bold hover:text-primary transition-colors">
          {name}
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>{memberCount} members</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        {joined ? (
          <Button variant="outline" size="sm" className="w-full">
            View Community
          </Button>
        ) : (
          <Button size="sm" className="w-full">
            Join Community
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
