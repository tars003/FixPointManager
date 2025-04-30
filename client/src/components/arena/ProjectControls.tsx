import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Save, Play, Undo, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomizationProject } from '@shared/schema';

interface ProjectControlsProps {
  projectId?: number;
  currentStep: number;
  totalSteps: number;
  onSave: (projectName: string, projectDesc: string) => void;
  onResume?: () => void;
  vehicleModel?: string;
  customizations?: Record<string, any>;
}

const ProjectControls: React.FC<ProjectControlsProps> = ({
  projectId,
  currentStep,
  totalSteps,
  onSave,
  onResume,
  vehicleModel,
  customizations
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query draft projects
  const { data: draftProjects, isLoading } = useQuery<CustomizationProject[]>({
    queryKey: ['/api/arena/projects/drafts'],
    enabled: resumeDialogOpen, // Only fetch when the resume dialog is open
  });

  // Save project mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { 
      name: string; 
      description: string; 
      vehicleModel?: string;
      customizations?: Record<string, any>;
      status: 'draft' | 'in-progress' | 'completed';
    }) => {
      const res = await apiRequest(
        projectId ? 'PATCH' : 'POST',
        projectId ? `/api/arena/projects/${projectId}` : '/api/arena/projects',
        data
      );
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Saved",
        description: "Your project has been saved as a draft",
      });
      setSaveDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/arena/projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save project",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }

    onSave(projectName, projectDescription);
    
    // Call the mutation to save the project
    saveMutation.mutate({
      name: projectName,
      description: projectDescription,
      vehicleModel,
      customizations,
      status: 'draft'
    });
  };

  const handleResumeProject = (project: CustomizationProject) => {
    if (onResume) {
      onResume();
      setResumeDialogOpen(false);
      
      toast({
        title: "Project Resumed",
        description: `Resumed project: ${project.name}`,
      });
    }
  };

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Save As Draft Button with Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Your Project</DialogTitle>
              <DialogDescription>
                Save your current customization progress to continue later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="col-span-3"
                  placeholder="My Dream Car"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Brief description of your customization"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveProject}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resume Customization Button with Dialog */}
        <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Play className="mr-2 h-4 w-4" />
              Resume Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Resume a Saved Project</DialogTitle>
              <DialogDescription>
                Select a previously saved project to continue customizing.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-[50vh] overflow-auto">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : draftProjects && draftProjects.length > 0 ? (
                <div className="space-y-4">
                  {draftProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleResumeProject(project)}
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>Last updated: {project.updatedAt && new Date(project.updatedAt).toLocaleDateString()}</span>
                        <span>Status: {project.status}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 p-4">
                  No saved projects found. Start customizing and save your progress!
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="mr-4 text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </div>
        <Button variant="ghost" size="sm" className="mr-2">
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
        <Button>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProjectControls;