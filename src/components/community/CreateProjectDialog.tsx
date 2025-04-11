
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onOpenChange,
  communityId
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }

      if (!communityId) {
        throw new Error('Community ID is required');
      }

      if (!name.trim()) {
        throw new Error('Project name is required');
      }

      // This would insert into a 'projects' table, but for now we'll just mock it
      // since the table doesn't exist in the schema yet
      
      // Mock successful creation
      return { id: 'mock-id-' + Date.now() };
    },
    onSuccess: () => {
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects', communityId] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setGoal('');
    setDeadline('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Start a new project for the community to collaborate on.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this project aims to achieve"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What is the main goal of this project?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Target Completion Date
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending || !name.trim()}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
