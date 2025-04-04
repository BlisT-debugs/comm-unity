
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  createLink?: string;
  createLabel?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  createLink = "/issues?create=true",
  createLabel = "Create Issue"
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <Button asChild>
        <Link to={createLink}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {createLabel}
        </Link>
      </Button>
    </div>
  );
};

export default DashboardHeader;
