
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import IssueCard from '@/components/issues/IssueCard';
import { useIssues } from '@/hooks/useIssues';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const IssuesTab = () => {
  const navigate = useNavigate();
  const { issues, isLoading } = useIssues({ limit: 6 });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              id={issue.id}
              title={issue.title}
              description={issue.description}
              category={issue.category}
              community={issue.community_name || 'Community'}
              communityId={issue.community_id}
              status={issue.status as 'open' | 'in-progress' | 'completed'}
              upvotes={issue.upvote_count || 0}
              comments={0}
              contributors={0}
              progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
              createdAt={new Date(issue.created_at).toLocaleDateString()}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No issues found</p>
          <Button onClick={() => navigate('/issues?create=true')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create an Issue
          </Button>
        </Card>
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={() => navigate('/issues')}>
          View All Issues
        </Button>
      </div>
    </div>
  );
};

export default IssuesTab;
