
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import VoiceInput from '@/components/voice/VoiceInput';

interface CreateCommunityDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CommunityFormValues {
  name: string;
  description: string;
  location: string;
  imageUrl: string;
}

const CreateCommunityDialog: React.FC<CreateCommunityDialogProps> = ({ 
  open: externalOpen, 
  onOpenChange 
}) => {
  const [open, setOpen] = useState(externalOpen || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<keyof CommunityFormValues | null>(null);
  const { t } = useLanguage();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  // Update open state when external open prop changes
  React.useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);
  
  const form = useForm<CommunityFormValues>({
    defaultValues: {
      name: '',
      description: '',
      location: '',
      imageUrl: '',
    },
  });
  
  // Sync open state changes back to parent
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  // Function to handle form submission
  const onSubmit = async (data: CommunityFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, we would send this data to an API
      console.log('Creating community:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      uiToast({
        title: "Community created",
        description: "Your community has been successfully created.",
        variant: "default",
      });
      
      // Close the dialog and reset form
      handleOpenChange(false);
      form.reset();
      
      // In a real app, we would navigate to the new community
      // navigate(`/community/${newCommunityId}`);
    } catch (error) {
      console.error('Failed to create community:', error);
      uiToast({
        title: "Failed to create community",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle voice input transcripts
  const handleVoiceTranscript = (transcript: string) => {
    if (activeVoiceField && transcript) {
      form.setValue(activeVoiceField, transcript);
      toast.success(`Added voice input to ${activeVoiceField}`);
      setActiveVoiceField(null);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle size={16} />
          {t('Create Community')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Create New Community')}</DialogTitle>
          <DialogDescription>
            {t('Create a new community for people to join and collaborate')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Community name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Community Name')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder={t('Enter community name')} {...field} />
                    </FormControl>
                    <VoiceInput 
                      onTranscriptChange={handleVoiceTranscript}
                      isListening={activeVoiceField === 'name'}
                      onListeningChange={(isListening) => {
                        setActiveVoiceField(isListening ? 'name' : null);
                      }}
                      placeholder="Name"
                      buttonSize="icon"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Description')}</FormLabel>
                  <div className="flex gap-2 items-start">
                    <FormControl>
                      <Textarea 
                        placeholder={t('What is this community about?')} 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <VoiceInput 
                      onTranscriptChange={handleVoiceTranscript}
                      isListening={activeVoiceField === 'description'}
                      onListeningChange={(isListening) => {
                        setActiveVoiceField(isListening ? 'description' : null);
                      }}
                      placeholder="Description"
                      buttonSize="icon"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Location')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder={t('Optional: City, State, or Region')} {...field} />
                    </FormControl>
                    <VoiceInput 
                      onTranscriptChange={handleVoiceTranscript}
                      isListening={activeVoiceField === 'location'}
                      onListeningChange={(isListening) => {
                        setActiveVoiceField(isListening ? 'location' : null);
                      }}
                      placeholder="Location"
                      buttonSize="icon"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Community Image URL')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder={t('Optional: URL to community image')} {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image uploader - in a real app, this would allow file uploads */}
            <div className="border-2 border-dashed border-muted rounded-md p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('Drag and drop or click to upload')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('PNG, JPG or GIF, max 5MB')}</p>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Creating...')}
                  </>
                ) : (
                  t('Create Community')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;
