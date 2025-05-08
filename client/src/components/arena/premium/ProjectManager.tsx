import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Share2, 
  Trash, 
  Download, 
  Copy, 
  Camera, 
  ShoppingCart, 
  History, 
  Users, 
  Calendar, 
  Info,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Award,
  Undo2,
  Redo2,
  EyeIcon,
  Edit,
  HelpCircle,
  Loader2,
  SendIcon
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  CustomizationProject, 
  ProjectHistoryEntry, 
  ProjectCollaborationStatus
} from '@shared/arena-schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Format date to local string
const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Menu for project actions
interface ProjectActionsMenuProps {
  project: CustomizationProject;
  onSave: () => void;
  onSaveAs: () => void;
  onShare: () => void;
  onDelete: () => void;
  onExport: () => void;
  onDuplicate: () => void;
  onTakeScreenshot: () => void;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean) => void;
  isSaving?: boolean;
  className?: string;
}

const ProjectActionsMenu: React.FC<ProjectActionsMenuProps> = ({
  project,
  onSave,
  onSaveAs,
  onShare,
  onDelete,
  onExport,
  onDuplicate,
  onTakeScreenshot,
  isMenuOpen,
  setIsMenuOpen,
  isSaving = false,
  className = '',
}) => {
  return (
    <DropdownMenu 
      open={isMenuOpen} 
      onOpenChange={setIsMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-1 ${className}`}
        >
          <MoreHorizontal size={16} />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Project'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSaveAs}>
          <Copy size={16} className="mr-2" />
          <span>Save As New</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onShare}>
          <Share2 size={16} className="mr-2" />
          <span>Share Project</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy size={16} className="mr-2" />
          <span>Duplicate Project</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTakeScreenshot}>
          <Camera size={16} className="mr-2" />
          <span>Take Screenshot</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExport}>
          <Download size={16} className="mr-2" />
          <span>Export Project</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete} 
          className="text-red-600 focus:text-red-600"
        >
          <Trash size={16} className="mr-2" />
          <span>Delete Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Component to display project history log
interface ProjectHistoryProps {
  history: ProjectHistoryEntry[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ProjectHistory: React.FC<ProjectHistoryProps> = ({
  history,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Project History</h3>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 size={16} />
                  <span className="sr-only">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo last action</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 size={16} />
                  <span className="sr-only">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo last undone action</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <ScrollArea className="h-64 rounded-md border p-2">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No history recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 text-sm"
              >
                <div className="mt-0.5">
                  {entry.action === 'add' && (
                    <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-0">
                      Added
                    </Badge>
                  )}
                  {entry.action === 'remove' && (
                    <Badge className="bg-red-100 hover:bg-red-200 text-red-800 border-0">
                      Removed
                    </Badge>
                  )}
                  {entry.action === 'modify' && (
                    <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-0">
                      Modified
                    </Badge>
                  )}
                  {entry.action === 'undo' && (
                    <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-0">
                      Undone
                    </Badge>
                  )}
                  {entry.action === 'redo' && (
                    <Badge className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-0">
                      Redone
                    </Badge>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">
                    {entry.partName || entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{entry.userName}</span>
                    <span className="mx-1">•</span>
                    <Clock size={12} className="mr-1" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Component to display project collaborators
interface CollaboratorsProps {
  collaborationStatus: ProjectCollaborationStatus;
  onInviteUser: () => void;
}

const Collaborators: React.FC<CollaboratorsProps> = ({
  collaborationStatus,
  onInviteUser,
}) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const { toast } = useToast();

  const handleInvite = () => {
    // Would send invite via API in a real implementation
    toast({
      title: 'Invitation Sent',
      description: `Sent collaboration invite to ${inviteEmail}`,
    });
    setInviteEmail('');
    setShowInviteDialog(false);
    onInviteUser();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Collaborators</h3>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Users size={14} className="mr-1.5" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Collaborators</DialogTitle>
              <DialogDescription>
                Invite others to view or edit this customization project
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permission level</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="editor"
                      name="role"
                      checked={inviteRole === 'editor'}
                      onChange={() => setInviteRole('editor')}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="editor" className="cursor-pointer">
                      Editor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="viewer"
                      name="role"
                      checked={inviteRole === 'viewer'}
                      onChange={() => setInviteRole('viewer')}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="viewer" className="cursor-pointer">
                      Viewer
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {inviteRole === 'editor' 
                    ? 'Can make changes to the project' 
                    : 'Can only view the project, no editing'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Add a message (optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="I'd like your input on this customization design..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail}>
                <SendIcon size={14} className="mr-1.5" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md p-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">
            {collaborationStatus.activeUsers.length} active user{collaborationStatus.activeUsers.length !== 1 ? 's' : ''}
          </div>
          {collaborationStatus.lastSaved && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              Last saved {formatDate(collaborationStatus.lastSaved)}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {collaborationStatus.activeUsers.map((user) => (
            <div 
              key={user.userId} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.userName}`} />
                  <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{user.userName}</div>
                  <div className="text-xs text-gray-500 flex items-center mt-0.5">
                    {user.role === 'owner' ? (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 hover:bg-blue-200 text-blue-800 border-0">
                        Owner
                      </Badge>
                    ) : user.role === 'editor' ? (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-100 hover:bg-green-200 text-green-800 border-0">
                        Editor
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">
                        Viewer
                      </Badge>
                    )}
                    <span className="mx-1">•</span>
                    <span>
                      {user.lastActive ? 'Active' : 'Idle'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-400">
                {user.role === 'owner' && <Award size={16} />}
                {user.role === 'editor' && <Edit size={16} />}
                {user.role === 'viewer' && <EyeIcon size={16} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// The main project manager component
interface ProjectManagerProps {
  project: CustomizationProject;
  onSave: (projectData: Partial<CustomizationProject>) => Promise<void>;
  onSaveAs: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onExport: () => void;
  onAddToCart: () => void;
  history: ProjectHistoryEntry[];
  collaborationStatus: ProjectCollaborationStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isOwner?: boolean;
  showHistory?: boolean;
  isSaving?: boolean;
  className?: string;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  project,
  onSave,
  onSaveAs,
  onDelete,
  onExport,
  onAddToCart,
  history,
  collaborationStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isOwner = true,
  showHistory = true,
  isSaving = false,
  className = '',
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [currentTab, setCurrentTab] = useState<'info' | 'history' | 'collaborators'>('info');
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const { toast } = useToast();

  // Update local state when project changes
  useEffect(() => {
    setProjectName(project.name);
    setProjectDescription(project.description || '');
  }, [project]);

  // Handle project save
  const handleSave = async () => {
    try {
      await onSave({
        name: projectName,
        description: projectDescription,
      });
      toast({
        title: 'Project Saved',
        description: 'Your changes have been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your project',
        variant: 'destructive',
      });
    }
  };

  // Handle Save As functionality
  const handleSaveAs = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a name for the new project',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await onSaveAs(newProjectName);
      setShowSaveAsDialog(false);
      setNewProjectName('');
      toast({
        title: 'Project Duplicated',
        description: `Saved as "${newProjectName}"`,
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'There was an error creating a new copy',
        variant: 'destructive',
      });
    }
  };

  // Handle project name edit
  const handleNameSubmit = () => {
    if (projectName.trim()) {
      handleSave();
      setIsEditingName(false);
    } else {
      setProjectName(project.name);
      setIsEditingName(false);
      toast({
        title: 'Invalid Name',
        description: 'Project name cannot be empty',
        variant: 'destructive',
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await onDelete();
      setShowDeleteConfirm(false);
      toast({
        title: 'Project Deleted',
        description: 'Your project has been deleted',
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting your project',
        variant: 'destructive',
      });
    }
  };

  // Simulate taking a screenshot
  const handleTakeScreenshot = () => {
    toast({
      title: 'Screenshot Taken',
      description: 'Vehicle screenshot has been saved',
    });
  };

  // Handle sharing
  const handleShare = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  // Generate share link
  const getShareLink = () => {
    const baseUrl = window.location.origin;
    const shareKey = project.sharingKey || project.id;
    return `${baseUrl}/arena/shared/${shareKey}`;
  };

  // Copy share link to clipboard
  const copyShareLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'Share link copied to clipboard',
    });
    setIsShareMenuOpen(false);
  };

  // Handle project duplication
  const handleDuplicate = () => {
    setNewProjectName(`${project.name} Copy`);
    setShowSaveAsDialog(true);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                className="w-64 text-lg font-medium"
                autoFocus
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setProjectName(project.name);
                  setIsEditingName(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <ContextMenuTrigger>
              <h2 
                className="text-lg font-medium text-gray-900 cursor-pointer hover:underline"
                onClick={() => isOwner && setIsEditingName(true)}
              >
                {projectName}
              </h2>
              <ContextMenuContent>
                {isOwner && (
                  <ContextMenuItem onClick={() => setIsEditingName(true)}>
                    <Edit size={16} className="mr-2" />
                    Rename Project
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={handleSave} disabled={!isOwner || isSaving}>
                  <Save size={16} className="mr-2" />
                  Save Project
                </ContextMenuItem>
                <ContextMenuItem onClick={handleShare}>
                  <Share2 size={16} className="mr-2" />
                  Share Project
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenuTrigger>
          )}
          
          <div className="flex items-center gap-1.5">
            <Badge className="capitalize">
              {project.status}
            </Badge>
            
            <Badge variant="outline" className="capitalize">
              {project.visibility}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOwner && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span className="hidden sm:inline">
                      {isSaving ? 'Saving...' : 'Save'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save project changes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5"
                    >
                      <Share2 size={16} />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <h3 className="font-medium">Share Project</h3>
                      <p className="text-sm text-gray-500">
                        Anyone with the link can view this project
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          value={getShareLink()}
                          readOnly
                          className="flex-grow"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={copyShareLink}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch id="public" />
                          <Label htmlFor="public">Make project public</Label>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                  onClick={onAddToCart}
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Add to Cart</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add parts to shopping cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ProjectActionsMenu 
            project={project}
            onSave={handleSave}
            onSaveAs={() => setShowSaveAsDialog(true)}
            onShare={handleShare}
            onDelete={() => setShowDeleteConfirm(true)}
            onExport={onExport}
            onDuplicate={handleDuplicate}
            onTakeScreenshot={handleTakeScreenshot}
            isMenuOpen={isActionsMenuOpen}
            setIsMenuOpen={setIsActionsMenuOpen}
            isSaving={isSaving}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Updated {formatDate(project.updatedAt || new Date())}</span>
          </div>
          
          {project.basePrice && (
            <>
              <span className="text-gray-300 mx-1">•</span>
              <div className="text-sm text-gray-500 flex items-center gap-1.5">
                <span>Base Price: ₹{project.basePrice.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
          
          {project.totalPrice && (
            <>
              <span className="text-gray-300 mx-1">•</span>
              <div className="text-sm font-medium text-blue-600 flex items-center gap-1.5">
                <span>Total: ₹{project.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Detail tabs for project info */}
      <Tabs
        defaultValue="info"
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as 'info' | 'history' | 'collaborators')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="text-xs sm:text-sm">
            <Info size={14} className="mr-1.5 hidden sm:inline" />
            Project Info
          </TabsTrigger>
          {showHistory && (
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <History size={14} className="mr-1.5 hidden sm:inline" />
              History
            </TabsTrigger>
          )}
          <TabsTrigger value="collaborators" className="text-xs sm:text-sm">
            <Users size={14} className="mr-1.5 hidden sm:inline" />
            Collaborators
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="info" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Project Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Add a description for your project..."
                    rows={3}
                    disabled={!isOwner}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <Select
                      value={project.status || "in-progress"}
                      disabled={!isOwner}
                      onValueChange={(value: string) => {
                        if (isOwner) onSave({ status: value as 'draft' | 'in-progress' | 'completed' });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Visibility</h4>
                    <Select
                      value={project.visibility || "private"}
                      disabled={!isOwner}
                      onValueChange={(value: string) => {
                        if (isOwner) onSave({ visibility: value as 'private' | 'public' | 'shared' });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Parts Summary</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.selectedParts?.length || 0} parts selected
                    </p>
                  </div>
                  
                  {project.totalPoints && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                      <div className="text-blue-700 text-xs font-medium">Arena Points</div>
                      <div className="text-blue-800 font-medium text-lg flex items-center justify-center">
                        <Award size={16} className="mr-1 text-blue-600" />
                        {project.totalPoints}
                      </div>
                    </div>
                  )}
                </div>
                
                {isOwner && (
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {showHistory && (
            <TabsContent value="history">
              <ProjectHistory
                history={history}
                onUndo={onUndo}
                onRedo={onRedo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </TabsContent>
          )}
          
          <TabsContent value="collaborators">
            <Collaborators
              collaborationStatus={collaborationStatus}
              onInviteUser={() => {}}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Save As Dialog */}
      <Dialog open={showSaveAsDialog} onOpenChange={setShowSaveAsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project As</DialogTitle>
            <DialogDescription>
              Create a new copy of this project with a different name
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-project-name">Project Name</Label>
              <Input
                id="new-project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter a name for your new project"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSaveAsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAs} disabled={!newProjectName.trim()}>
              <Save size={16} className="mr-2" />
              Save As New Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              <Trash size={16} className="mr-2" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;