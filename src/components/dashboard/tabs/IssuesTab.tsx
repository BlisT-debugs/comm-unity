
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import IssueCard from '@/components/issues/IssueCard';
import { useIssues } from '@/hooks/useIssues';

interface IssuesTabProps {
  limit?: number;
}

const IssuesTab: React.FC<IssuesTabProps> = ({ limit = 4 }) => {
  const { issues, isLoading } = useIssues({ limit });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {isLoading ? (
          <>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
          </>
        ) : issues.length > 0 ? (
          issues.map((issue) => (
            <IssueCard 
              key={issue.id}
              id={issue.id}
              title={issue.title}
              description={issue.description}
              category={issue.category}
              community={issue.community_name || 'Community'}
              communityId={issue.community_id}
              status={issue.status as any}
              upvotes={issue.upvote_count || 0}
              comments={0}
              contributors={0}
              progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
              createdAt={new Date(issue.created_at).toLocaleDateString()}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground mb-4">No issues found</p>
            <Button asChild>
              <Link to="/issues?create=true">Create your first issue</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" asChild>
          <Link to="/issues">View All Issues</Link>
        </Button>
      </div>
    </div>
  );
};

export default IssuesTab;
